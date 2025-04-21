import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.scss"; // Main homepage styles
import { FaSearch } from "react-icons/fa";

import LocationCard from "../../components/LocationCard/LocationCard";
// Import images (giữ nguyên)
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

  // Dữ liệu mẫu (giữ nguyên)
  const recentlyViewedItems = [
    {
      id: 1,
      name: "Golem Cafe",
      image: golemcafe,
      rating: 4.5,
      reviewCount: 123,
      tags: "Cafe, Drinks",
      badge: "New",
    },
    {
      id: 2,
      name: "The Marble Mountains",
      image: marblemountains,
      rating: 4.0,
      reviewCount: 5432,
      tags: "Attractions, Nature",
    },
    {
      id: 3,
      name: "Bao Tang Da Nang - Da Nang Museum",
      image: danangmuseum,
      rating: 4.0,
      reviewCount: 876,
      tags: "Museums, History",
      badge: "2024",
    },
    {
      id: 4,
      name: "Dragon Bridge",
      image: dragonbridge,
      rating: 4.5,
      reviewCount: 10987,
      tags: "Landmarks, Bridges",
    },
  ];

  const recommendedItems = [
    {
      id: 5,
      name: "Burger Bros",
      image: burgerbros,
      rating: 4.5,
      reviewCount: 1567,
      tags: "Restaurants, Burgers",
    },
    {
      id: 6,
      name: "Banh Xeo Ba Duong",
      image: banhxeobaduong,
      rating: 4.0,
      reviewCount: 987,
      tags: "Local Food, Restaurants",
    },
    {
      id: 7,
      name: "Madame Lân",
      image: madamelan,
      rating: 4.0,
      reviewCount: 4321,
      tags: "Restaurants, Vietnamese",
    },
    {
      id: 8,
      name: "Quan Com Hue Ngon",
      image: quancomhuengon,
      rating: 3.5,
      reviewCount: 765,
      tags: "Local Food, Budget",
    },
  ];

  useEffect(() => {
    const savedItemsFromStorage = localStorage.getItem("savedItems");
    if (savedItemsFromStorage) {
      setSavedItems(JSON.parse(savedItemsFromStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
  }, [savedItems]);

  // toggleSave function remains here as it manages the state of Homepage
  const toggleSave = (itemId) => {
    // Removed 'e' as it's handled in LocationCard
    setSavedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // handleItemClick remains here for navigation logic
  const handleItemClick = (itemId) => {
    console.log(`Navigating to item ${itemId}`);
    // navigate(`/location/${itemId}`);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:8080/cities/search/${encodeURIComponent(
          searchText
        )}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.city_id) {
        //const firstLocation = data[0];
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

  // --- Removed LocationItem Component Definition ---

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
        <div className="picture-grid">
          {recentlyViewedItems.map((item) => (
            // Use the new LocationCard component and pass props
            <LocationCard
              key={item.id}
              item={item}
              isSaved={!!savedItems[item.id]} // Ensure boolean value
              onToggleSave={() => toggleSave(item.id)} // Pass specific toggle function
              onClick={() => handleItemClick(item.id)} // Pass specific click function
            />
          ))}
        </div>
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
              isSaved={!!savedItems[item.id]} // Ensure boolean value
              onToggleSave={() => toggleSave(item.id)} // Pass specific toggle function
              onClick={() => handleItemClick(item.id)} // Pass specific click function
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
