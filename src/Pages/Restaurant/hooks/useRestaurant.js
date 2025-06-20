import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import BASE_URL from "../../../constants/BASE_URL";
import { useAuth } from "../../../contexts/AuthContext";
import useFavorites from "../../../hooks/useFavorites";
import UserService from "../../../services/userService";
const fetchWithRetry = async (url) => {
  for (let i = 0; i < 3; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      if (i === 2) throw new Error(`Failed to fetch ${url}: ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

const fetchRestaurantDetails = async (restaurantId, user) => {
  try {
    const restaurantData = await fetchWithRetry(
      `${BASE_URL}/restaurants/${restaurantId}`
    );
    const [cityData, rankData, nearbyData, reviewData] = await Promise.all([
      fetchWithRetry(`${BASE_URL}/cities/${restaurantData.city_id}`),
      fetchWithRetry(`${BASE_URL}/restaurants/rank/${restaurantId}`),
      fetchWithRetry(`${BASE_URL}/restaurants/topnearby/${restaurantId}`),
      fetchWithRetry(`${BASE_URL}/reviews/restaurant/${restaurantId}`),
    ]);

    const normalizeRating = (rating) => {
      const parsed = parseFloat(rating);
      return isNaN(parsed) ? 0 : parsed;
    };

    const normalizeTags = (tags) => {
      if (!tags) return [];
      if (Array.isArray(tags)) return tags;
      if (typeof tags === "string") {
        try {
          const parsed = JSON.parse(tags);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("Failed to parse tags:", e);
          return [];
        }
      }
      return [];
    };

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

    const normalizedRestaurantRating = normalizeRating(
      restaurantData.average_rating
    );
    const normalizedRestaurant = {
      ...restaurantData,
      hours:
        typeof restaurantData.hours === "string"
          ? JSON.parse(restaurantData.hours)
          : restaurantData.hours || {},
      average_rating: normalizedRestaurantRating,
      image_url:
        Array.isArray(restaurantData.image_url) &&
        restaurantData.image_url.length > 30
          ? restaurantData.image_url.slice(0, 30)
          : restaurantData.image_url || [],
      rating_total: restaurantData.rating_total || 0,
      tags: normalizeTags(restaurantData.tags),
      status: restaurantData.status || "unknown",
      latitude: parseFloat(restaurantData.latitude) || 21.0285,
      longitude: parseFloat(restaurantData.longitude) || 105.8542,
    };

    const normalizedNearby = nearbyData.nearbyTopRestaurant.map(
      (restaurant) => ({
        ...restaurant,
        tags: normalizeTags(restaurant.tags),
        average_rating: normalizeRating(restaurant.average_rating),
        image_url: Array.isArray(restaurant.image_url)
          ? restaurant.image_url
          : typeof restaurant.image_url === "string"
          ? [restaurant.image_url]
          : [],
      })
    );

    // Fetch user data for each review
    const reviewsWithUsers = await Promise.all(
      reviewData.map(async (review) => {
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
      restaurant: normalizedRestaurant,
      city: cityData,
      resRank: rankData,
      nearbyRestaurants: normalizedNearby,
      reviews: reviewsWithUsers,
    };
  } catch (err) {
    console.error("fetchRestaurantDetails error:", err);
    throw new Error("Failed to load restaurant details: " + err.message);
  }
};

const useRestaurant = () => {
  const { id: restaurantId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");
  const [mapCenter, setMapCenter] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [localReviews, setLocalReviews] = useState([]);

  const { favorites, createFavorite, deleteFavorite } = useFavorites(
    user?.user_id,
    isLoggedIn
  );

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery(
    ["restaurant", restaurantId],
    () => fetchRestaurantDetails(restaurantId, user),
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    }
  );

  const { restaurant, city, resRank, nearbyRestaurants, reviews } = data || {
    restaurant: null,
    city: null,
    resRank: null,
    nearbyRestaurants: [],
    reviews: [],
  };

  const isFavorite = favorites?.some(
    (fav) => String(fav.restaurant_id) === String(restaurantId)
  );

  const handleToggleSave = (restaurantId) => {
    if (!isLoggedIn || !user?.user_id) {
      alert("Please log in to save this restaurant!");
      navigate("/");
      return;
    }

    if (isFavorite) {
      const favorite = favorites.find(
        (fav) => String(fav.restaurant_id) === String(restaurantId)
      );
      if (favorite) {
        deleteFavorite(favorite.favorite_id);
      }
    } else {
      createFavorite({ userId: user.user_id, restaurantId });
    }
  };

  // Khi data thay đổi, cập nhật localReviews và gán isCurrentUser
  useEffect(() => {
    if (data?.reviews) {
      setLocalReviews(
        data.reviews.map((review) => ({
          ...review,
          isCurrentUser: user && review.user_id === user.user_id,
        }))
      );
    }
  }, [data?.reviews, user]);

  // Hàm xử lý xóa review
  const handleDeleteReview = async (review) => {
    if (!review?.review_id) return;
    try {
      await axios.delete(`${BASE_URL}/reviews/${review.review_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          user_id: user?.user_id,
        },
      });
      // Xóa review khỏi local state để cập nhật UI ngay lập tức
      setLocalReviews((prev) =>
        prev.filter((r) => r.review_id !== review.review_id)
      );
    } catch (err) {
      alert("Failed to delete review. Please try again.");
      console.error("Delete review error:", err);
    }
  };

  useEffect(() => {
    if (isFullScreen) {
      document.querySelector(".fullscreen-image")?.focus();
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (restaurant) {
      const lat = parseFloat(restaurant.latitude);
      const lon = parseFloat(restaurant.longitude);
      if (!isNaN(lat) && !isNaN(lon)) {
        setMapCenter([lat, lon]);
        setMapError(null);
      } else {
        setMapCenter([21.0285, 105.8542]);
        setMapError("Invalid coordinates from restaurant data");
      }
    }
  }, [restaurant]);

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
    const numRating = typeof rating === "number" ? rating : parseFloat(rating);

    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      return <div className="stars-container">Invalid rating</div>;
    }

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (numRating >= i) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={solidStar}
            className="star-icon filled"
          />
        );
      } else if (numRating >= i - 0.5) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfAlt}
            className="star-icon half"
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={regularStar}
            className="star-icon empty"
          />
        );
      }
    }
    return <span className="stars-container">{stars}</span>;
  };
  const handleShareClick = () => {
    const shareData = {
      title: restaurant?.name || "Restaurant",
      text: `Check out ${restaurant?.name || "this restaurant"} in ${
        city?.name || "Vietnam"
      }!`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  const handleReviewClick = () => {
    navigate(`/tripguide/review/restaurant/${restaurantId}`);
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid date";
    }
  };

  const hoursInfo = useMemo(() => {
    const parseHours = (hours) => {
      let parsedHours = hours;
      if (typeof hours === "string") {
        try {
          parsedHours = JSON.parse(hours);
        } catch (e) {
          console.error("Failed to parse hours:", e);
          return { formatted: [], status: "Unknown" };
        }
      }
      if (!parsedHours || !parsedHours.weekRanges) {
        return { formatted: [], status: "Unknown" };
      }

      const englishDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const todayIndex = new Date().getDay();
      const formatted = englishDays.map((day, index) => {
        const dayRanges = parsedHours.weekRanges[index];
        if (dayRanges && dayRanges.length > 0) {
          const range = dayRanges[0];
          return { day, hours: `${range.openHours} - ${range.closeHours}` };
        }
        return { day, hours: "Closed" };
      });

      const todayRanges = parsedHours.weekRanges[todayIndex];
      let status = "Closed";
      if (todayRanges && todayRanges.length > 0) {
        const range = todayRanges[0];
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        if (currentMinutes >= range.open && currentMinutes <= range.close) {
          status = `Open until ${range.closeHours}`;
        } else {
          status = `Closed (Opens at ${range.openHours})`;
        }
      }

      return { formatted, status };
    };

    return restaurant
      ? parseHours(restaurant.hours)
      : { formatted: [], status: "Unknown" };
  }, [restaurant]);

  const sortedReviews = useMemo(
    () => (localReviews ? sortReviews(localReviews, reviewSort) : []),
    [localReviews, reviewSort]
  );

  return {
    restaurant,
    city,
    resRank,
    nearbyRestaurants,
    reviews: sortedReviews,
    loading: isLoading,
    error: queryError?.message,
    activeImageIndex,
    isFullScreen,
    showHours,
    reviewSort,
    isLoggedIn,
    mapCenter,
    mapError,
    setActiveImageIndex,
    setIsFullScreen,
    setShowHours,
    handleSortChange,
    handleShareClick,
    handleReviewClick,
    fetchRestaurant: refetch,
    renderStars,
    formatDate,
    hoursInfo,
    savedRestaurants: favorites,
    handleToggleSave,
    handleDeleteReview, // <-- export hàm này
  };
};

export default useRestaurant;
