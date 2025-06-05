import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.scss";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfStroke,
  faStar as regularStar,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import LocationCard from "../../components/LocationCard/LocationCard";
import { useAuth } from "../../contexts/AuthContext";
import BASE_URL from "../../constants/BASE_URL";
import trendcast from "../../views/trendcast.png";
import useFavorites from "../../hooks/useFavorites";

const HomePage = () => {
  const [searchText, setSearchText] = useState("");
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [error, setError] = useState(null);
  const [famousAttractions, setFamousAttractions] = useState([]);
  const [famousRestaurants, setFamousRestaurants] = useState([]);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [city, setCity] = useState([]);
  const { isFavoritesLoading, favoritesError } = useFavorites(
    user?.user_id,
    isLoggedIn
  );

  const userCityId = useMemo(() => {
    if (isLoggedIn && user?.user_id) {
      return city.find((c) => c.name === user.bio.currentCity)?.city_id || null;
    }
    return null;
  }, [isLoggedIn, user, city]);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        let recentItems = [];
        if (isLoggedIn && user?.user_id) {
          const response = await axios.get(
            `${BASE_URL}/recently-viewed?user_id=${user.user_id}`
          );
          recentItems = response.data;
        } else {
          recentItems = JSON.parse(
            localStorage.getItem("recentlyViewedItems") || "[]"
          );
        }

        const uniqueItemsMap = new Map();
        recentItems
          .filter(
            (item) =>
              item.id &&
              item.name &&
              item.type &&
              (item.type === "restaurant" || item.type === "attraction")
          )
          .forEach((item) => {
            const key = `${item.type}-${item.id}`;
            if (!uniqueItemsMap.has(key)) {
              // Normalize image_url (JSONB) to image string
              const image =
                item.image ||
                (Array.isArray(item.image_url)
                  ? item.image_url[0]
                  : item.image_url?.primary || item.image_url) ||
                "";
              uniqueItemsMap.set(key, {
                ...item,
                restaurant_id:
                  item.type === "restaurant" ? item.id : item.restaurant_id,
                attraction_id:
                  item.type === "attraction" ? item.id : item.attraction_id,
                image,
                rating: Number(item.average_rating || item.rating) || 0,
                reviewCount: Number(item.rating_total || item.reviewCount) || 0,
                tags: Array.isArray(item.tags)
                  ? item.tags
                  : item.tags
                  ? [item.tags]
                  : [],
              });
            }
          });

        const uniqueItems = Array.from(uniqueItemsMap.values()).slice(0, 4);
        setRecentlyViewedItems(uniqueItems);
      } catch (err) {
        console.error("Failed to fetch recently viewed items:", err);
        setError("Failed to load recently viewed items.");
      }
    };

    fetchRecentlyViewed();
  }, [isLoggedIn, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityResponse = await axios.get(`${BASE_URL}/cities`);
        setCity(cityResponse.data);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        setError("Failed to load cities.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFamousItems = async () => {
      if (!userCityId) return;
      try {
        const attractionsResponse = await axios.get(
          `${BASE_URL}/attractions/special/${userCityId}`
        );
        const normalizedAttractions = attractionsResponse.data.map((attr) => ({
          id: attr.attraction_id,
          name: attr.name,
          image: Array.isArray(attr.image_url)
            ? attr.image_url[0]
            : attr.image_url?.primary || attr.image_url || "",
          rating: Number(attr.average_rating) || 0,
          reviewCount: Number(attr.rating_total) || 0,
          tags: Array.isArray(attr.tags)
            ? attr.tags
            : attr.tags
            ? [attr.tags]
            : [],
          type: "attraction",
        }));
        setFamousAttractions(normalizedAttractions);

        const restaurantsResponse = await axios.get(
          `${BASE_URL}/restaurants/special/${userCityId}`
        );
        const normalizedRestaurants = restaurantsResponse.data.map((rest) => ({
          id: rest.restaurant_id,
          name: rest.name,
          image: Array.isArray(rest.image_url)
            ? rest.image_url[0]
            : rest.image_url?.primary || rest.image_url || "",
          rating: Number(rest.average_rating) || 0,
          reviewCount: Number(rest.rating_total) || 0,
          tags: Array.isArray(rest.tags)
            ? rest.tags
            : rest.tags
            ? [rest.tags]
            : [],
          type: "restaurant",
        }));
        setFamousRestaurants(normalizedRestaurants);
      } catch (err) {
        console.error("Failed to fetch famous items:", err);
        setError("Failed to load famous items.");
      }
    };
    fetchFamousItems();
  }, [userCityId]);

  const renderStars = useCallback((rating) => {
    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      return <div className="stars-container">No rating</div>;
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

  const handleItemClick = useCallback(
    (item) => {
      if (item.type === "restaurant") {
        navigate(`/tripguide/restaurant/${item.restaurant_id || item.id}`);
      } else if (item.type === "attraction") {
        navigate(`/tripguide/attraction/${item.attraction_id || item.id}`);
      }
    },
    [navigate]
  );

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/cities/search/${encodeURIComponent(searchText)}`
      );
      const data = response.data;
      if (data && data.city_id) {
        navigate(`/tripguide/citydetail/${data.city_id}`);
      } else {
        alert("Không tìm thấy địa điểm!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert(`Lỗi khi tìm kiếm: ${error.message || "Vui lòng thử lại!"}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="homepage">
      <div className="search-container">
        <h1 className="search-title">Ready for a perfect trip?</h1>
        <div className={`search-box ${isSearchFocused ? "focused" : ""}`}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Places to go, things to do, hotels..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {favoritesError && (
          <div className="error-message">{favoritesError.message}</div>
        )}
        {isFavoritesLoading && <div>Loading favorites...</div>}
      </div>

      <div className="featured-container">
        <img src={trendcast} alt="Featured" className="featured-image" />
        <div className="featured-overlay">
          <h2>The 2025 Tripadvisor Trendcast</h2>
          <p>Forecasting the future of travel—now.</p>
          <button className="featured-button">Check it out</button>
        </div>
      </div>

      <hr />

      <div className="content-section">
        <h2 className="section-title">Recently viewed</h2>
        <p className="section-subtitle">Places you explored</p>
        {recentlyViewedItems.length > 0 ? (
          <div className="picture-grid">
            {recentlyViewedItems.map((item) => (
              <LocationCard
                key={`${item.type}-${item.id}`}
                item={item}
                onClick={() => handleItemClick(item)}
                renderStars={renderStars}
              />
            ))}
          </div>
        ) : (
          <p>No recently viewed items.</p>
        )}
      </div>

      {userCityId && famousAttractions.length > 0 && (
        <div className="content-section">
          <h2 className="section-title">
            Famous attractions in {user.bio.currentCity}
          </h2>
          <p className="section-subtitle">
            Explore the must-see landmarks and experiences.
          </p>
          <div className="picture-grid">
            {famousAttractions.map((attraction) => (
              <LocationCard
                key={`attraction-${attraction.id}`}
                item={attraction}
                onClick={() => handleItemClick(attraction)}
                renderStars={renderStars}
              />
            ))}
          </div>
        </div>
      )}

      {userCityId && famousRestaurants.length > 0 && (
        <div className="content-section">
          <h2 className="section-title">
            Famous restaurants in {user.bio.currentCity}
          </h2>
          <p className="section-subtitle">
            Discover the best dining spots loved by locals.
          </p>
          <div className="picture-grid">
            {famousRestaurants.map((restaurant) => (
              <LocationCard
                key={`restaurant-${restaurant.id}`}
                item={restaurant}
                onClick={() => handleItemClick(restaurant)}
                renderStars={renderStars}
              />
            ))}
          </div>
        </div>
      )}

      <div className="content-section">
        <h2 className="section-title">Start your adventure</h2>
        <p className="section-subtitle">Choose what you want to explore</p>
        <div className="adventure-grid">
          <div
            className="adventure-card attraction-card"
            onClick={() => navigate("/tripguide/attractions")}
          >
            <div className="adventure-overlay">
              <div className="adventure-icon" aria-hidden="true">
                🧭
              </div>
              <h3>Attractions</h3>
              <p>Discover amazing places and landmarks</p>
            </div>
          </div>
          <div
            className="adventure-card restaurant-card"
            onClick={() => navigate("/tripguide/restaurants")}
          >
            <div className="adventure-overlay">
              <div className="adventure-icon" aria-hidden="true">
                🍽️
              </div>
              <h3>Restaurants</h3>
              <p>Find the best dining experiences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
