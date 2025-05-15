// useAttraction.js
import { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";
import { useAuth } from "../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt,
  faStar as regularStar,
} from "@fortawesome/free-solid-svg-icons";
import useFavorites from "../../../hooks/useFavorites";
const fetchAttractionDetails = async (attractionId) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const attractionResponse = await axios.get(
      `${BASE_URL}/attractions/${attractionId}`,
      { signal: controller.signal }
    );
    const attractionData = attractionResponse.data;

    const [cityResponse, reviewsResponse, nearbyResponse] = await Promise.all([
      axios.get(`${BASE_URL}/cities/${attractionData.city_id}`, {
        signal: controller.signal,
      }),
      axios
        .get(`${BASE_URL}/attractions/${attractionId}/reviews`, {
          signal: controller.signal,
        })
        .catch(() => ({ data: [] })),
      axios
        .get(`${BASE_URL}/attractions/${attractionId}/topnearby`, {
          signal: controller.signal,
        })
        .catch(() => ({ data: { nearbyTopAttractions: [] } })),
    ]);

    const nearbyAttractions = (
      nearbyResponse.data.nearbyTopAttractions || []
    ).map((place) => ({
      attraction_id: place.attraction_id || place.id,
      image_url: Array.isArray(place.image_url)
        ? place.image_url
        : typeof place.image_url === "string"
        ? [place.image_url]
        : [],
      average_rating: parseFloat(place.average_rating) || 0,
      rating_total: Number(place.rating_total) || 0,
      tags: Array.isArray(place.tags)
        ? place.tags
        : typeof place.tags === "string"
        ? place.tags.split(", ").filter((tag) => tag.trim())
        : [],
      ...place,
    }));

    clearTimeout(timeoutId);

    return {
      attraction: {
        ...attractionData,
        average_rating: parseFloat(attractionData.average_rating) || 0,
      },
      city: cityResponse.data,
      reviews: reviewsResponse.data || [],
      nearbyAttractions,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    if (error.response) {
      throw new Error(
        `Server error: ${error.response.status} ${error.response.statusText}`
      );
    }
    if (error.request) {
      throw new Error("Network error: Unable to connect to server.");
    }
    throw new Error("Unable to load attraction details.");
  }
};

const useAttraction = () => {
  const { id: attractionId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Use the useFavorites hook
  const {
    favorites,
    isFavoritesLoading,
    favoritesError,
    createFavorite,
    deleteFavorite,
  } = useFavorites(user?.user_id, isLoggedIn);

  const {
    data = { attraction: null, city: null, reviews: [], nearbyAttractions: [] },
    isLoading,
    error: attractionError,
  } = useQuery(
    ["attraction", attractionId],
    () => fetchAttractionDetails(attractionId),
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  );

  const { attraction, city, reviews, nearbyAttractions } = data;

  const isFavorite = useMemo(() => {
    if (!favorites || !attractionId) return false;
    return favorites.some(
      (fav) => String(fav.attraction_id) === String(attractionId)
    );
  }, [favorites, attractionId]);

  const handleToggleSave = useCallback(() => {
    if (!isLoggedIn || !user?.user_id) {
      alert("Please log in to save this attraction!");
      navigate("/login");
      return;
    }

    if (isFavorite) {
      const favorite = favorites.find(
        (fav) => String(fav.attraction_id) === String(attractionId)
      );
      if (favorite) {
        deleteFavorite(favorite.favorite_id);
      }
    } else {
      createFavorite({ userId: user.user_id, attractionId });
    }
  }, [
    isLoggedIn,
    user?.user_id,
    isFavorite,
    favorites,
    attractionId,
    navigate,
    createFavorite,
    deleteFavorite,
  ]);

  const renderStars = useCallback((rating) => {
    const numericRating = parseFloat(rating) || 0;
    const stars = Array.from({ length: 5 }, (_, i) => {
      const index = i + 1;
      if (numericRating >= index) {
        return (
          <FontAwesomeIcon
            key={index}
            icon={solidStar}
            className="star-icon filled"
          />
        );
      }
      if (numericRating >= index - 0.5) {
        return (
          <FontAwesomeIcon
            key={index}
            icon={faStarHalfAlt}
            className="star-icon half"
          />
        );
      }
      return (
        <FontAwesomeIcon key={index} icon={regularStar} className="star-icon" />
      );
    });
    return <div className="stars-container">{stars}</div>;
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const handleShareClick = useCallback(() => {
    const title = data.attraction?.name || "Attraction";
    const text = `Check out ${title} in ${data.city?.name || "this city"}!`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title, text, url }).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }, [data.attraction, data.city]);

  const handleReviewClick = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(`/tripguide/review/attraction/${attractionId}`);
  }, [isLoggedIn, navigate, attractionId]);

  return {
    attraction,
    city,
    reviews,
    nearbyAttractions,
    loading: isLoading || isFavoritesLoading,
    error: attractionError?.message || favoritesError?.message,
    isFavorite,
    favorites, // Pass favorites for use in NearbyAttractions
    handleShareClick,
    handleReviewClick,
    handleToggleSave,
    isLoggedIn,
    fetchAttraction: () =>
      queryClient.invalidateQueries(["attraction", attractionId]),
    renderStars,
    formatDate,
  };
};

export default useAttraction;
