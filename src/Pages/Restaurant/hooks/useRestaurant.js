import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfStroke,
  faStar as regularStar,
} from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import BASE_URL from "../../../constants/BASE_URL";
import { useAuth } from "../../../contexts/AuthContext";

// Utility function to fetch with retries
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      if (i === retries - 1)
        throw new Error(`Failed to fetch ${url}: ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Fetch all restaurant-related data
const fetchRestaurantDetails = async (restaurantId) => {
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

    // Helper function to normalize rating
    const normalizeRating = (rating) => {
      const parsed = parseFloat(rating);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Helper function to normalize tags
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

    // Normalize rating for main restaurant
    const normalizedRestaurantRating = normalizeRating(
      restaurantData.average_rating
    );

    // Normalize tags and rating for main restaurant
    const normalizedRestaurant = {
      ...restaurantData,
      hours:
        typeof restaurantData.hours === "string"
          ? JSON.parse(restaurantData.hours)
          : restaurantData.hours || {},
      average_rating: normalizedRestaurantRating,
      image_url: Array.isArray(restaurantData.image_url)
        ? restaurantData.image_url
        : [],
      rating_total: restaurantData.rating_total || 0,
      tags: normalizeTags(restaurantData.tags),
      status: restaurantData.status || "unknown",
    };

    // Normalize tags and rating for nearbyRestaurants
    const normalizedNearby = nearbyData.nearbyTopRestaurant.map(
      (restaurant) => ({
        ...restaurant,
        tags: normalizeTags(restaurant.tags),
        average_rating: normalizeRating(restaurant.average_rating),
      })
    );

    return {
      restaurant: normalizedRestaurant,
      city: cityData,
      resRank: rankData,
      nearbyRestaurants: normalizedNearby,
      reviews: reviewData.map((review) => ({
        ...review,
        rating: parseFloat(review.rating) || 0,
        isCurrentUser: review.user_id === restaurantData.user_id,
      })),
    };
  } catch (err) {
    throw new Error("Failed to load restaurant details: " + err.message);
  }
};

const useRestaurant = () => {
  const { id: restaurantId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [showHours, setShowHours] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [savedRestaurants, setSavedRestaurants] = useState({});
  const [isLoadingVisible, setIsLoadingVisible] = useState(false);

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery(
    ["restaurant", restaurantId],
    () => fetchRestaurantDetails(restaurantId),
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: () => setMapError("Failed to load restaurant data."),
    }
  );

  const { restaurant, city, resRank, nearbyRestaurants, reviews } = data || {
    restaurant: null,
    city: null,
    resRank: null,
    nearbyRestaurants: [],
    reviews: [],
  };

  // Quản lý hiển thị Loading với độ trễ tối thiểu 500ms
  useEffect(() => {
    let timeout;
    if (isLoading) {
      setIsLoadingVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsLoadingVisible(false);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Fetch geocode for map
  const fetchGeocode = useCallback(
    debounce(async (address) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`,
          { headers: { Accept: "application/json" } }
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setMapCenter([parseFloat(lat), parseFloat(lon)]);
        } else {
          setMapError("Could not find location on map.");
        }
      } catch (err) {
        setMapError("Error loading location: " + err.message);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (restaurant?.address) {
      fetchGeocode(restaurant.address);
    }
  }, [restaurant?.address, fetchGeocode]);

  // Focus on fullscreen image when opened
  useEffect(() => {
    if (isFullScreen) {
      document.querySelector(".fullscreen-image")?.focus();
    }
  }, [isFullScreen]);

  // Sort reviews based on sortType
  const sortReviews = useCallback((reviews, sortType) => {
    return [...reviews].sort((a, b) => {
      if (sortType === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortType === "highest") return b.rating - a.rating;
      if (sortType === "lowest") return a.rating - b.rating;
      return 0;
    });
  }, []);

  // Handle review sorting
  const handleSortChange = useCallback((e) => {
    const newSort = e.target.value;
    setReviewSort(newSort);
  }, []);

  // Render star ratings
  const renderStars = useCallback((rating) => {
    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      return <div className="stars-container">Invalid rating</div>;
    }
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={
              star <= Math.floor(numRating)
                ? solidStar
                : star === Math.ceil(numRating) && !Number.isInteger(numRating)
                ? faStarHalfStroke
                : regularStar
            }
            className={`star-icon ${
              star <= Math.floor(numRating)
                ? "filled"
                : star === Math.ceil(numRating) && !Number.isInteger(numRating)
                ? "half"
                : "empty"
            }`}
          />
        ))}
      </div>
    );
  }, []);

  // Share restaurant link
  const handleShareClick = useCallback(() => {
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
  }, [restaurant, city]);

  // Scroll to review section
  const handleReviewClick = useCallback(() => {
    navigate(`/tripguide/review/restaurant/${restaurantId}`);
  }, [navigate, restaurantId]);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid date";
    }
  }, []);

  // Parse restaurant hours
  const parseHours = useCallback((hours) => {
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
        return {
          day,
          hours: `${range.openHours} - ${range.closeHours}`,
        };
      }
      return {
        day,
        hours: "Closed",
      };
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
  }, []);

  const hoursInfo = useMemo(
    () =>
      restaurant
        ? parseHours(restaurant.hours)
        : { formatted: [], status: "Unknown" },
    [restaurant, parseHours]
  );

  // Apply sorting to reviews
  const sortedReviews = useMemo(
    () => (reviews ? sortReviews(reviews, reviewSort) : []),
    [reviews, reviewSort, sortReviews]
  );

  // Fetch danh sách nhà hàng đã lưu
  useEffect(() => {
    if (isLoggedIn && user?.user_id) {
      axios
        .get(`${BASE_URL}/favorites?user_id=${user.user_id}`)
        .then((response) => {
          const saved = response.data.reduce((acc, item) => {
            acc[item.restaurant_id] = true;
            return acc;
          }, {});
          setSavedRestaurants(saved);
        })
        .catch((err) => console.error("Failed to fetch favorites:", err));
    }
  }, [isLoggedIn, user]);

  // Hàm xử lý lưu/thêm nhà hàng
  const handleToggleSave = useCallback(
    async (restaurantId) => {
      try {
        if (savedRestaurants[restaurantId]) {
          await axios.delete(`${BASE_URL}/favorites/${restaurantId}`);
          setSavedRestaurants((prev) => {
            const newSaved = { ...prev };
            delete newSaved[restaurantId];
            return newSaved;
          });
        } else {
          await axios.post(`${BASE_URL}/favorites`, {
            user_id: user?.user_id,
            restaurant_id: restaurantId,
          });
          setSavedRestaurants((prev) => ({
            ...prev,
            [restaurantId]: true,
          }));
        }
      } catch (err) {
        setError("Failed to update favorites: " + err.message);
      }
    },
    [savedRestaurants, user]
  );

  return {
    restaurant,
    city,
    resRank,
    nearbyRestaurants,
    reviews: sortedReviews,
    loading: isLoading,
    isLoadingVisible,
    submitting,
    error: error || queryError?.message,
    activeImageIndex,
    isFullScreen,
    mapCenter,
    mapError,
    showHours,
    reviewSort,
    isLoggedIn,
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
    savedRestaurants,
    handleToggleSave,
  };
};

export default useRestaurant;
