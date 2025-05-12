import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";
import { useAuth } from "../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt,
  faStar as regularStar,
} from "@fortawesome/free-solid-svg-icons";

const fetchAttractionDetails = async (attractionId) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout 10s

  try {
    const attractionResponse = await axios.get(
      `${BASE_URL}/attractions/${attractionId}`,
      { signal: controller.signal }
    );
    const attractionData = attractionResponse.data;

    const requests = [
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
    ];

    const [cityResponse, reviewsResponse, nearbyResponse] = await Promise.all(
      requests
    );

    const nearbyAttractions = (
      nearbyResponse.data.nearbyTopAttractions || []
    ).map((place) => ({
      ...place,
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
      throw new Error("Network error: Unable to reach the server.");
    }
    throw new Error("Failed to fetch attraction details.");
  }
};

const useAttraction = () => {
  const { id: attractionId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [reviewForm, setReviewForm] = useState({ comment: "", rating: 5 });
  const [savedAttractions, setSavedAttractions] = useState({});
  const [reviewError, setReviewError] = useState("");

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery(
    ["attraction", attractionId],
    () => fetchAttractionDetails(attractionId),
    {
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
      retry: 1, // Retry only once to avoid API spam
    }
  );

  const { attraction, city, reviews, nearbyAttractions } = data || {
    attraction: null,
    city: null,
    reviews: [],
    nearbyAttractions: [],
  };

  // Function to render star ratings
  const renderStars = useCallback((rating) => {
    const numericRating = parseFloat(rating) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (numericRating >= i) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={solidStar}
            className="star-icon filled"
          />
        );
      } else if (numericRating >= i - 0.5) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfAlt}
            className="star-icon half"
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon key={i} icon={regularStar} className="star-icon" />
        );
      }
    }
    return <div className="stars-container">{stars}</div>;
  }, []);

  // Function to format dates
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const handleShareClick = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: attraction?.name || "Attraction",
        text: `Check out ${attraction?.name || "this attraction"} in ${
          city?.name || "this city"
        }!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, [attraction?.name, city?.name]);

  const handleReviewClick = useCallback(() => {
    console.log("Review button clicked" + attractionId);

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(`/tripguide/review/attraction/${attractionId}`);
  }, [navigate, attractionId, isLoggedIn]);

  const handleToggleSave = useCallback(
    (attractionId) => {
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      setSavedAttractions((prev) => ({
        ...prev,
        [attractionId]: !prev[attractionId],
      }));
    },
    [isLoggedIn, navigate]
  );

  return {
    attraction,
    city,
    reviews,
    nearbyAttractions,
    loading: isLoading,
    error: queryError?.message,
    savedAttractions,
    handleShareClick,
    handleReviewClick,
    handleToggleSave,
    reviewForm,
    setReviewForm,
    reviewError,
    isLoggedIn,
    fetchAttraction: () =>
      queryClient.invalidateQueries(["attraction", attractionId]),
    renderStars,
    formatDate,
  };
};

export default useAttraction;
