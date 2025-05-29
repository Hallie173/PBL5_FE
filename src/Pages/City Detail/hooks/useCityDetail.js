import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

const fallbackImages = [
  "/images/cities/danang1.png",
  "/images/cities/danang2.png",
  "/images/cities/danang3.png",
  "/images/cities/danang4.png",
];

const initialVisitPlaces = [
  {
    attraction_id: 1,
    name: "Hai Van Pass",
    image_url: "/images/cities/haivanpass.png",
    average_rating: 4.5,
    rating_total: 120,
    tags: ["Scenic", "Adventure", "Nature"],
  },
  {
    attraction_id: 2,
    name: "The Marble Mountains",
    image_url: "/images/cities/marblemountains.png",
    average_rating: 4.2,
    rating_total: 95,
    tags: ["Cultural", "Nature", "History"],
  },
  {
    attraction_id: 3,
    name: "Lady Buddha",
    image_url: "/images/cities/ladybuddha.png",
    average_rating: 4.7,
    rating_total: 150,
    tags: ["Spiritual", "Scenic", "Culture"],
  },
  {
    attraction_id: 4,
    name: "Dragon Bridge",
    image_url: "/images/cities/dragonbridge.png",
    average_rating: 4.3,
    rating_total: 200,
    tags: ["Landmark", "Architecture", "Nightlife"],
  },
  {
    attraction_id: 5,
    name: "Golden Bridge",
    image_url: "/images/cities/goldenbridge.png",
    average_rating: 4.8,
    rating_total: 180,
    tags: ["Iconic", "Scenic", "Architecture"],
  },
  {
    attraction_id: 6,
    name: "Tien Sa",
    image_url: "/images/cities/tiensa.png",
    average_rating: 4.0,
    rating_total: 80,
    tags: ["Beach", "Nature", "Relaxation"],
  },
  {
    attraction_id: 7,
    name: "The Lady of Tra Kieu's Marian Shrine",
    image_url: "/images/cities/trakieu.png",
    average_rating: 4.1,
    rating_total: 60,
    tags: ["Spiritual", "History", "Culture"],
  },
  {
    attraction_id: 8,
    name: "Asia Park",
    image_url: "/images/cities/asiapark.png",
    average_rating: 4.4,
    rating_total: 110,
    tags: ["Amusement", "Family", "Fun"],
  },
];

const initialEatPlaces = [
  {
    restaurant_id: 1,
    name: "Le Petit Bistro Da Nang",
    image_url: "/images/fooddrink/petitbistro.png",
    average_rating: 4.6,
    rating_total: 85,
    tags: ["French", "Fine Dining", "Cozy"],
  },
  {
    restaurant_id: 2,
    name: "All Seasons Buffet - Da Nang",
    image_url: "/images/fooddrink/allseason.png",
    average_rating: 4.3,
    rating_total: 70,
    tags: ["Buffet", "Variety", "Casual"],
  },
  {
    restaurant_id: 3,
    name: "Le Comptoir Danang",
    image_url: "/images/fooddrink/lecomptoir.png",
    average_rating: 4.5,
    rating_total: 90,
    tags: ["French", "Casual", "Modern"],
  },
  {
    restaurant_id: 4,
    name: "Citron Restaurant",
    image_url: "/images/fooddrink/citron.png",
    average_rating: 4.7,
    rating_total: 100,
    tags: ["Fine Dining", "Scenic", "Asian"],
  },
  {
    restaurant_id: 5,
    name: "Missteak",
    image_url: "/images/fooddrink/missteak.png",
    average_rating: 4.2,
    rating_total: 65,
    tags: ["Steakhouse", "Western", "Casual"],
  },
  {
    restaurant_id: 6,
    name: "Rang.danang",
    image_url: "/images/fooddrink/rang.png",
    average_rating: 4.4,
    rating_total: 75,
    tags: ["Vietnamese", "Local", "Casual"],
  },
  {
    restaurant_id: 7,
    name: "Mộc Seafood",
    image_url: "/images/fooddrink/mocseafood.png",
    average_rating: 4.8,
    rating_total: 120,
    tags: ["Seafood", "Local", "Fresh"],
  },
  {
    restaurant_id: 8,
    name: "Madame Lan",
    image_url: "/images/fooddrink/madamelan.png",
    average_rating: 4.5,
    rating_total: 95,
    tags: ["Vietnamese", "Traditional", "Casual"],
  },
];

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
  const [images, setImages] = useState(fallbackImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placesToVisit, setPlacesToVisit] = useState(initialVisitPlaces);
  const [placesToEat, setPlacesToEat] = useState(initialEatPlaces);

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
            : initialVisitPlaces
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
            : initialEatPlaces
        );
        setImages(
          Array.isArray(cityResponse.data.image_url) &&
            cityResponse.data.image_url.length
            ? cityResponse.data.image_url
            : fallbackImages
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
