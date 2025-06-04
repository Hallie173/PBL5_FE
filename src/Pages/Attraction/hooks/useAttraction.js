// useAttraction.js
import { useCallback, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";

import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";
import { useAuth } from "../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfStroke,
  faStar as regularStar,
} from "@fortawesome/free-solid-svg-icons";
import useFavorites from "../../../hooks/useFavorites";
import UserService from "../../../services/userService";
const fetchAttractionDetails = async (attractionId, user) => {
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
        .get(`${BASE_URL}/reviews/attraction/${attractionId}`, {
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
    const normalizePhotos = (photos) => {
      if (!photos) return [];
      if (Array.isArray(photos)) return photos;
      if (typeof photos === "string") {
        try {
          const parsed = JSON.parse(photos);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("Failed to parse photos:", e);
          return [];
        }
      }
      return [];
    };
    const reviewsWithUsers = await Promise.all(
      reviewsResponse.data.map(async (review) => {
        let userData = { username: "Anonymous", avatar_url: null };
        try {
          if (review.user_id) {
            const response = await UserService.getUserById(review.user_id);
            userData = {
              username: response.username || "Anonymous",
              avatar_url: response.avatar_url || null,
            };
          }
        } catch (error) {
          console.error(
            `Failed to fetch user ${review.user_id}:`,
            error.message
          );
        }
        const rawRating = review.rating;
        const parsedRating = parseFloat(rawRating);
        const finalRating = isNaN(parsedRating)
          ? 0
          : Math.max(0, Math.min(5, parsedRating));
        console.log(
          `Review ID ${
            review.review_id
          }: raw=${rawRating}, type=${typeof rawRating}, parsed=${parsedRating}, final=${finalRating}`
        );
        if (finalRating === 5 && rawRating !== 5) {
          console.warn(
            `Review ID ${review.review_id} has unexpected rating of 5 (raw was ${rawRating})`
          );
        }
        return {
          ...review,
          rating: finalRating,
          isCurrentUser: review.user_id === user?.user_id,
          photos: normalizePhotos(review.photos),
          title: review.title || "Untitled Review",
          userName: userData.username,
          profilePic: userData.avatar_url,
        };
      })
    );

    return {
      attraction: {
        ...attractionData,
        average_rating: parseFloat(attractionData.average_rating) || 0,
      },
      city: cityResponse.data,
      reviews: reviewsWithUsers,
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
    throw new Error(error);
  }
};

const useAttraction = () => {
  const { id: attractionId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reviewSort, setReviewSort] = useState("newest");

  // Use the useFavorites hook
  const {
    favorites,
    isFavoritesLoading,
    favoritesError,
    createFavorite,
    deleteFavorite,
  } = useFavorites(user?.user_id, isLoggedIn);

  const {
    data = {
      attraction: {
        attraction_id: null,
        name: "",
        image_url: [],
        average_rating: 0,
        rating_total: 0,
        tags: [],
        latitude: null,
        longitude: null,
        description: "",
        address: "",
      },
      city: { city_id: null, name: "" },
      reviews: [],
      nearbyAttractions: [],
    },
    isLoading,
    error: attractionError,
  } = useQuery(
    ["attraction", attractionId],
    () => fetchAttractionDetails(attractionId, user),
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
      navigate("/");
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
  const sortReviews = (reviews, sortType) => {
    return [...reviews].sort((a, b) => {
      if (sortType === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortType === "highest") return b.rating - a.rating;
      if (sortType === "lowest") return a.rating - b.rating;
      return 0;
    });
  };

  const handleSortChange = (e) => {
    setReviewSort(e.target.value);
  };
  const renderStars = (rating) => {
    // Chuyển đổi rating thành số và xử lý giá trị không hợp lệ
    const numRating = typeof rating === "number" ? rating : parseFloat(rating);

    // Kiểm tra giá trị hợp lệ
    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      return <div className="stars-container">Invalid rating</div>;
    }

    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => {
          // Tính toán loại sao cho vị trí hiện tại
          const isFilled = star <= Math.floor(numRating);
          const isHalf =
            !isFilled && star === Math.ceil(numRating) && numRating % 1 !== 0;
          const isEmpty = !isFilled && !isHalf;

          // Xác định icon phù hợp
          let icon;
          if (isFilled) {
            icon = solidStar;
          } else if (isHalf) {
            icon = faStarHalfStroke;
          } else {
            icon = regularStar;
          }

          // Xác định className phù hợp
          let starClass = "star-icon ";
          if (isFilled) {
            starClass += "filled";
          } else if (isHalf) {
            starClass += "half";
          } else {
            starClass += "empty";
          }

          return (
            <FontAwesomeIcon key={star} icon={icon} className={starClass} />
          );
        })}
      </div>
    );
  };

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
      navigate("/");
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
    handleSortChange,
    isLoggedIn,
    fetchAttraction: () =>
      queryClient.invalidateQueries(["attraction", attractionId]),
    renderStars,
    formatDate,
  };
};

export default useAttraction;
