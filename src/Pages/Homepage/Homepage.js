import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.scss";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import LocationCard from "../../components/LocationCard/LocationCard";
import { useAuth } from "../../contexts/AuthContext";
import BASE_URL from "../../constants/BASE_URL";
import trendcast from "../../views/trendcast.png";

// Hình ảnh tĩnh (giữ nguyên hoặc thay bằng URL từ API)
import golemcafe from "../../assets/images/FoodDrink/golemcafe.png";
import marblemountains from "../../assets/images/Cities/marblemountains.png";
import danangmuseum from "../../assets/images/Cities/danangmuseum.png";
import dragonbridge from "../../assets/images/Cities/dragonbridge.png";
import burgerbros from "../../assets/images/FoodDrink/burgerbros.png";
import banhxeobaduong from "../../assets/images/FoodDrink/banhxeobaduong.png";
import madamelan from "../../assets/images/FoodDrink/madamelan.png";
import quancomhuengon from "../../assets/images/FoodDrink/quancomhuengon.png";

// Mapping ID với hình ảnh (nếu không lấy từ API)
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
  const [savedRestaurants, setSavedRestaurants] = useState({});
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [city, setCity] = useState([]);

  // Lấy danh sách Recently Viewed
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        let recentItems = [];

        // Nếu đã đăng nhập, lấy từ API
        if (isLoggedIn && user?.user_id) {
          const response = await axios.get(
            `${BASE_URL}/recently-viewed?user_id=${user.user_id}`
          );
          recentItems = response.data.slice(0, 4); // Giới hạn 4 mục
        } else {
          // Nếu chưa đăng nhập, lấy từ localStorage
          recentItems = JSON.parse(
            localStorage.getItem("recentlyViewedItems") || "[]"
          );
        }

        // Đảm bảo dữ liệu hợp lệ
        recentItems = recentItems.filter(
          (item) =>
            item.id &&
            item.name &&
            item.type &&
            (item.type === "restaurant" || item.type === "attraction")
        );

        // Ánh xạ hình ảnh nếu cần (tùy thuộc vào API của bạn)
        recentItems = recentItems.map((item) => ({
          ...item,
          image:
            item.image ||
            imageMap[item.id] ||
            "https://via.placeholder.com/150",
        }));

        setRecentlyViewedItems(recentItems);
      } catch (err) {
        console.error("Failed to fetch recently viewed items:", err);
        setError("Failed to load recently viewed items.");
      }
    };

    fetchRecentlyViewed();
  }, [isLoggedIn, user]);

  // Giữ nguyên recommendedItems (mảng tĩnh)
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
      id: 7,
      restaurant_id: 7,
      name: "Madame Lân",
      image: madamelan,
      rating: 4.0,
      reviewCount: 4321,
      tags: ["Restaurants", "Vietnamese"],
      type: "restaurant",
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

  useEffect(() => {
    const fetchData = async () => {
      const cityResponse = await axios.get(`${BASE_URL}/cities`);
      setCity(cityResponse.data);
    };
    fetchData();
    // if (isLoggedIn && user?.user_id) {
    //   axios
    //     .get(`${BASE_URL}/favorites?user_id=${user.user_id}`)
    //     .then((response) => {
    //       const saved = response.data.reduce((acc, item) => {
    //         acc[item.restaurant_id] = true;
    //         return acc;
    //       }, {});
    //       setSavedRestaurants(saved);
    //     })
    //     .catch((err) => {
    //       console.error("Failed to fetch favorites:", err);
    //       setError("Failed to load saved restaurants.");
    //     });
    // }
  }, [isLoggedIn, user]);

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

  // Toggle save state (giữ nguyên)
  const toggleSave = useCallback(
    async (restaurantId) => {
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
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
        showNotification("Failed to save restaurant. Please try again.");
      }
    },
    [isLoggedIn, navigate, savedRestaurants, user]
  );

  // Handle item click with type-based routing (cập nhật để hỗ trợ attraction)
  const handleItemClick = useCallback(
    (item) => {
      if (item.type === "restaurant") {
        navigate(`/tripguide/restaurant/${item.restaurant_id || item.id}`);
      } else if (item.type === "attraction") {
        navigate(`/tripguide/attraction/${item.id}`);
      }
    },
    [navigate]
  );
  // Giữ nguyên handleSearch, showNotification, handleKeyPress
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
      {/* Search Section */}
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
      </div>

      {/* Featured Image */}
      <div className="featured-container">
        <img src={trendcast} alt="Featured" className="featured-image" />
        <div className="featured-overlay">
          <h2>The 2025 Tripadvisor Trendcast</h2>
          <p>Forecasting the future of travel—now.</p>
          <button className="featured-button">Check it out</button>
        </div>
      </div>

      <hr />

      {/* Recently Viewed Section */}
      <div className="content-section">
        <h2 className="section-title">Recently viewed</h2>
        <p className="section-subtitle">Places you explored</p>
        {recentlyViewedItems.length > 0 ? (
          <div className="picture-grid">
            {recentlyViewedItems.map((item) => (
              <LocationCard
                key={item.id}
                item={item}
                isSaved={!!savedRestaurants[item.restaurant_id]}
                onToggleSave={() => toggleSave(item.restaurant_id)}
                onClick={() => handleItemClick(item)}
                renderStars={renderStars}
              />
            ))}
          </div>
        ) : (
          <p>No recently viewed items.</p>
        )}
      </div>

      {/* Recommended Section */}
      <div className="content-section">
        <h2 className="section-title">You might like these</h2>
        <p className="section-subtitle">More things to do in Da Nang</p>
        <div className="picture-grid">
          {recommendedItems.map((item) => (
            <LocationCard
              key={item.id}
              item={item}
              isSaved={!!savedRestaurants[item.restaurant_id]}
              onToggleSave={() => toggleSave(item.restaurant_id)}
              onClick={() => handleItemClick(item)}
              renderStars={renderStars}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
