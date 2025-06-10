import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

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

        return <FontAwesomeIcon key={star} icon={icon} className={starClass} />;
      })}
    </div>
  );
};

const useCityDetail = (cityId) => {
  const [city, setCity] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placesToVisit, setPlacesToVisit] = useState([]);
  const [placesToEat, setPlacesToEat] = useState([]);

  useEffect(() => {
    if (!cityId) {
      setError("No city ID provided");
      setLoading(false);
      return;
    }

    const fetchCity = async () => {
      try {
        setLoading(true);
        const [cityResponse, attractionsResponse, restaurantsResponse] =
          await Promise.all([
            axios.get(`${BASE_URL}/cities/${cityId}`),
            axios.get(`${BASE_URL}/attractions/special/${cityId}`),
            axios.get(`${BASE_URL}/restaurants/special/${cityId}`),
          ]);

        setCity(cityResponse.data);
        setPlacesToVisit(
          attractionsResponse.data.length
            ? attractionsResponse.data.map((attraction) => ({
                ...attraction,
                attraction_id: attraction.attraction_id,
                average_rating: attraction.average_rating || 0,
                rating_total: attraction.rating_total || 0,
                image_url: Array.isArray(attraction.image_url)
                  ? attraction.image_url[0]
                  : attraction.image_url || "/images/placeholder.png",
                tags: Array.isArray(attraction.tags)
                  ? attraction.tags
                  : typeof attraction.tags === "string"
                  ? JSON.parse(attraction.tags)
                  : [],
              }))
            : []
        );
        setPlacesToEat(
          restaurantsResponse.data.length
            ? restaurantsResponse.data.map((restaurant) => ({
                ...restaurant,
                restaurant_id: restaurant.restaurant_id,
                average_rating: restaurant.average_rating || 0,
                rating_total: restaurant.rating_total || 0,
                image_url: Array.isArray(restaurant.image_url)
                  ? restaurant.image_url[0]
                  : restaurant.image_url || "/images/placeholder.png",
                tags: Array.isArray(restaurant.tags)
                  ? restaurant.tags
                  : typeof restaurant.tags === "string"
                  ? JSON.parse(restaurant.tags)
                  : [],
              }))
            : []
        );
        setImages(
          Array.isArray(cityResponse.data.image_url) &&
            cityResponse.data.image_url.length
            ? cityResponse.data.image_url
            : ""
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [cityId]);

  return {
    city,
    images,
    placesToVisit,
    placesToEat,
    loading,
    error,
    currentIndex,
    renderStars,
    setCurrentIndex,
  };
};

export default useCityDetail;
