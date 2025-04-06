import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.scss";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import trendcast from "../../views/trendcast.png";
import golemcafe from "../../assets/images/FoodDrink/golemcafe.png";
import marblemountains from "../../assets/images/Cities/marblemountains.png";
import danangmuseum from "../../assets/images/Cities/danangmuseum.png";
import dragonbridge from "../../assets/images/Cities/dragonbridge.png";
import burgerbros from "../../assets/images/FoodDrink/burgerbros.png";
import banhxeobaduong from "../../assets/images/FoodDrink/banhxeobaduong.png";
import madamelan from "../../assets/images/FoodDrink/madamelan.png";
import quancomhuengon from "../../assets/images/FoodDrink/quancomhuengon.png";

const HomePage = () => {
  const [searchText, setSearchText] = useState("");
  const [savedItems, setSavedItems] = useState({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Define location data
  const recentlyViewedItems = [
    {
      id: 1,
      name: "Golem Cafe",
      image: golemcafe,
      category: "Cafe"
    },
    {
      id: 2,
      name: "The Marble Mountains",
      image: marblemountains,
      category: "Attraction"
    },
    {
      id: 3,
      name: "Bao Tang Da Nang - Da Nang Museum",
      image: danangmuseum,
      category: "Museum"
    },
    {
      id: 4,
      name: "Dragon Bridge",
      image: dragonbridge,
      category: "Landmark"
    },
  ];

  const recommendedItems = [
    {
      id: 5,
      name: "Burger Bros",
      image: burgerbros,
      category: "Restaurant"
    },
    {
      id: 6,
      name: "Banh Xeo Ba Duong",
      image: banhxeobaduong,
      category: "Local Food"
    },
    {
      id: 7,
      name: "Madame Lân",
      image: madamelan,
      category: "Restaurant"
    },
    {
      id: 8,
      name: "Quan Com Hue Ngon",
      image: quancomhuengon,
      category: "Local Food"
    },
  ];

  // Load saved items from localStorage on component mount
  useEffect(() => {
    const savedItemsFromStorage = localStorage.getItem('savedItems');
    if (savedItemsFromStorage) {
      setSavedItems(JSON.parse(savedItemsFromStorage));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  const toggleSave = (itemId, e) => {
    e.stopPropagation();

    setSavedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleItemClick = (itemId) => {
    // Navigate to item detail page
    console.log(`Navigating to item ${itemId}`);
    // Uncomment this when you have item detail pages
    // navigate(`/location/${itemId}`);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8081/location/search?name=${encodeURIComponent(searchText)}`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const firstLocation = data[0];
        navigate(`/tripguide/foodpage/${firstLocation.location_id}`);
      } else {
        // Use a more subtle notification instead of alert
        showNotification("Không tìm thấy địa điểm!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      showNotification("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  // A more subtle notification function (can be implemented with a state)
  const showNotification = (message) => {
    // For now we'll use alert, but you could replace this with a toast component
    alert(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Location Item component 
  const LocationItem = ({ item }) => (
    <div className="picture-item" onClick={() => handleItemClick(item.id)}>
      <div className="item-content">
        <img src={item.image} alt={item.name} />
        <div className="save-overlay">
          <button
            className={`save-button-overlay ${savedItems[item.id] ? "saved" : ""}`}
            onClick={(e) => toggleSave(item.id, e)}
            aria-label={savedItems[item.id] ? "Remove from saved" : "Save to favorites"}
          >
            <FontAwesomeIcon
              icon={savedItems[item.id] ? solidHeart : regularHeart}
              className="heart-icon-recent"
            />
          </button>
        </div>
        <div className="item-details">
          <p className="item-title">{item.name}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="homepage">
      {/* Search Section */}
      <div className="search-container">
        <h1 className="search-title">Ready for a perfect trip?</h1>
        <div className={`search-box ${isSearchFocused ? 'focused' : ''}`}>
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
        <div className="picture-grid">
          {recentlyViewedItems.map((item) => (
            <LocationItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Recommended Section */}
      <div className="content-section">
        <h2 className="section-title">You might like these</h2>
        <p className="section-subtitle">Make your meals unforgettable!</p>
        <div className="picture-grid">
          {recommendedItems.map((item) => (
            <LocationItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;