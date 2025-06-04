import React, { useState, useEffect, useCallback } from "react";
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

import golemcafe from "../../assets/images/FoodDrink/golemcafe.png";
import marblemountains from "../../assets/images/Cities/marblemountains.png";
import danangmuseum from "../../assets/images/Cities/danangmuseum.png";
import dragonbridge from "../../assets/images/Cities/dragonbridge.png";
import burgerbros from "../../assets/images/FoodDrink/burgerbros.png";
import banhxeobaduong from "../../assets/images/FoodDrink/banhxeobaduong.png";
import madamelan from "../../assets/images/FoodDrink/madamelan.png";
import quancomhuengon from "../../assets/images/FoodDrink/quancomhuengon.png";

const imageMap = {
  1: golemcafe,
  2: marblemountains,
  3: danangmuseum,
  4: dragonbridge,
  5: burgerbros,
  6: banhxeobaduong,
  7: madamelan,
  8: quancomhuengon,
};

const HomePage = () => {
  const [searchText, setSearchText] = useState("");
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [city, setCity] = useState([]);
  const [recommendAttraction, setRecommendAttraction] = useState([]);
  const {
    favorites,
    isFavoritesLoading,
    favoritesError,
    createFavorite,
    deleteFavorite,
  } = useFavorites(user?.user_id, isLoggedIn);

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

        // Lọc các item hợp lệ và loại bỏ trùng lặp
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
            // Chỉ giữ item mới nhất cho mỗi cặp type-id
            if (!uniqueItemsMap.has(key)) {
              uniqueItemsMap.set(key, {
                ...item,
                restaurant_id:
                  item.type === "restaurant" ? item.id : item.restaurant_id,
                attraction_id:
                  item.type === "attraction" ? item.id : item.attraction_id,
                image:
                  item.image ||
                  imageMap[item.id] ||
                  "https://via.placeholder.com/150",
              });
            }
          });

        // Chuyển Map thành array và giới hạn 4 item
        const uniqueItems = Array.from(uniqueItemsMap.values()).slice(0, 4);
        const attractionRespone = await axios.get(`${BASE_URL}/attractions/gettoprating`)
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

  const recommendedItems = [
    {
      id: 5,
      restaurant_id: 5,
      name: "Burger Bros",
      image: burgerbros,
      rating: 4.5,
      reviewCount: 1567,
      tags: ["Restaurants", "Burgers"],
      type: "restaurant",
    },
    {
      id: 6,
      restaurant_id: 6,
      name: "Banh Xeo Ba Duong",
      image: banhxeobaduong,
      rating: 4.0,
      reviewCount: 987,
      tags: ["Local Food", "Restaurants"],
      type: "restaurant",
    },
    {
      id: 2,
      attraction_id: 2,
      name: "Marble Mountains",
      image: marblemountains,
      rating: 4.2,
      reviewCount: 2345,
      tags: ["Attractions", "Nature"],
      type: "attraction",
    },
    {
      id: 8,
      restaurant_id: 8,
      name: "Quan Com Hue Ngon",
      image: quancomhuengon,
      rating: 3.5,
      reviewCount: 765,
      tags: ["Local Food", "Budget"],
      type: "restaurant",
    },
  ];

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

  const toggleSave = useCallback(
    (item) => {
      if (!isLoggedIn) {
        navigate("/");
        showNotification("Please log in to save this location!");
        return;
      }

      const { id, type } = item;
      const isFavorite = favorites.some(
        (fav) =>
          (type === "restaurant" && String(fav.restaurant_id) === String(id)) ||
          (type === "attraction" && String(fav.attraction_id) === String(id))
      );

      if (isFavorite) {
        const favorite = favorites.find(
          (fav) =>
            (type === "restaurant" &&
              String(fav.restaurant_id) === String(id)) ||
            (type === "attraction" && String(fav.attraction_id) === String(id))
        );
        if (favorite) {
          deleteFavorite(favorite.favorite_id);
        } else {
          console.error("Favorite not found for deletion");
        }
      } else {
        createFavorite({
          userId: user.user_id,
          attractionId: type === "attraction" ? id : undefined,
          restaurantId: type === "restaurant" ? id : undefined,
        });
      }
    },
    [isLoggedIn, navigate, favorites, user, createFavorite, deleteFavorite]
  );

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
        showNotification("Không tìm thấy địa điểm!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      showNotification(
        `Lỗi khi tìm kiếm: ${error.message || "Vui lòng thử lại!"}`
      );
    }
  };

  const showNotification = (message) => {
    alert(message);
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
            {recentlyViewedItems.map((item) => {
              const isSaved = favorites.some(
                (fav) =>
                  (item.type === "restaurant" &&
                    String(fav.restaurant_id) ===
                      String(item.restaurant_id || item.id)) ||
                  (item.type === "attraction" &&
                    String(fav.attraction_id) ===
                      String(item.attraction_id || item.id))
              );
              return (
                <LocationCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  isSaved={isSaved}
                  onToggleSave={() => toggleSave(item)}
                  onClick={() => handleItemClick(item)}
                  renderStars={renderStars}
                />
              );
            })}
          </div>
        ) : (
          <p>No recently viewed items.</p>
        )}
      </div>

      <div className="content-section">
        <h2 className="section-title">You might like these</h2>
        <p className="section-subtitle">More things to do in Da Nang</p>
        <div className="picture-grid">
          {recommendedItems.map((item) => {
            const isSaved = favorites.some(
              (fav) =>
                (item.type === "restaurant" &&
                  String(fav.restaurant_id) ===
                    String(item.restaurant_id || item.id)) ||
                (item.type === "attraction" &&
                  String(fav.attraction_id) ===
                    String(item.attraction_id || item.id))
            );

            return (
              <LocationCard
                key={`${item.type}-${item.id}`}
                item={item}
                isSaved={isSaved}
                onToggleSave={() => toggleSave(item)}
                onClick={() => handleItemClick(item)}
                renderStars={renderStars}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
