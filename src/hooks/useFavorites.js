import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import BASE_URL from "../constants/BASE_URL";

const fetchFavoritesByUser = async (userId) => {
  if (!userId) throw new Error("Invalid user ID.");
  const response = await axios.get(`${BASE_URL}/favorites/user/${userId}`);
  return response.data;
};

const createFavorite = async ({ userId, attractionId, restaurantId }) => {
  if (!userId || (!attractionId && !restaurantId)) {
    throw new Error("Missing userId or location ID.");
  }
  const response = await axios.post(`${BASE_URL}/favorites`, {
    user_id: userId,
    attraction_id: attractionId,
    restaurant_id: restaurantId,
  });
  return response.data;
};

const deleteFavorite = async (favoriteId) => {
  if (!favoriteId) throw new Error("Missing favoriteId.");
  const response = await axios.delete(`${BASE_URL}/favorites/${favoriteId}`);
  return response.data;
};

const useFavorites = (userId, isLoggedIn) => {
  const queryClient = useQueryClient();

  const {
    data: favorites = [],
    isLoading: isFavoritesLoading,
    error: favoritesError,
  } = useQuery(["favorites", userId], () => fetchFavoritesByUser(userId), {
    enabled: !!userId && isLoggedIn,
    staleTime: 30 * 1000, // Giảm để cập nhật nhanh hơn
    retry: 1,
  });

  const createFavoriteMutation = useMutation(createFavorite, {
    onMutate: async ({ userId, attractionId, restaurantId }) => {
      await queryClient.cancelQueries(["favorites", userId]);
      const previousFavorites =
        queryClient.getQueryData(["favorites", userId]) || [];
      const newFavorite = {
        favorite_id: `temp-${Date.now()}`,
        user_id: userId,
        attraction_id: attractionId,
        restaurant_id: restaurantId,
      };
      queryClient.setQueryData(
        ["favorites", userId],
        [...previousFavorites, newFavorite]
      );
      return { previousFavorites };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["favorites", userId],
        context.previousFavorites
      );
      console.error("Error adding favorite:", error);
      alert(`Cannot add favorite: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["favorites", userId]);
    },
  });

  const deleteFavoriteMutation = useMutation(deleteFavorite, {
    onMutate: async (favoriteId) => {
      await queryClient.cancelQueries(["favorites", userId]);
      const previousFavorites =
        queryClient.getQueryData(["favorites", userId]) || [];
      queryClient.setQueryData(
        ["favorites", userId],
        previousFavorites.filter((fav) => fav.favorite_id !== favoriteId)
      );
      return { previousFavorites };
    },
    onError: (error, favoriteId, context) => {
      queryClient.setQueryData(
        ["favorites", userId],
        context.previousFavorites
      );
      console.error("Error removing favorite:", error);
      alert(`Cannot remove favorite: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["favorites", userId]);
    },
  });

  return {
    favorites,
    isFavoritesLoading,
    favoritesError,
    createFavorite: createFavoriteMutation.mutate,
    deleteFavorite: deleteFavoriteMutation.mutate,
  };
};

export default useFavorites;
