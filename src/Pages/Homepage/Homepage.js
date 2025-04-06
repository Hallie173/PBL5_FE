import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import trendcast from "../../views/trendcast.png";
import golemcafe from "../../assets/images/FoodDrink/golemcafe.png";
import marblemountains from "../../assets/images/Cities/marblemountains.png";
import danangmuseum from "../../assets/images/Cities/danangmuseum.png";
import dragonbridge from "../../assets/images/Cities/dragonbridge.png";
import burgerbros from "../../assets/images/FoodDrink/burgerbros.png";
import banhxeobaduong from "../../assets/images/FoodDrink/banhxeobaduong.png";
import madamelan from "../../assets/images/FoodDrink/madamelan.png";
import quancomhuengon from "../../assets/images/FoodDrink/quancomhuengon.png";

const initialPlaces = [
    { id: 1, name: "Golem Cafe", image: golemcafe, saved: false },
    { id: 2, name: "The Marble Mountains", image: marblemountains, saved: false },
    { id: 3, name: "Da Nang Museum", image: danangmuseum, saved: false },
    { id: 4, name: "Dragon Bridge", image: dragonbridge, saved: false },
    { id: 5, name: "Burger Bros", image: burgerbros, saved: false },
    { id: 6, name: "Banh Xeo Ba Duong", image: banhxeobaduong, saved: false },
    { id: 7, name: "Madame Lân", image: madamelan, saved: false },
    { id: 8, name: "Quan Com Hue Ngon", image: quancomhuengon, saved: false },
];

const Homepage = () => {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    // Define location data for better maintainability
    const recentlyViewedItems = [
        { id: 1, name: "Golem Cafe", image: golemcafe },
        { id: 2, name: "The Marble Mountains", image: marblemountains },
        { id: 3, name: "Bao Tang Da Nang - Da Nang Museum", image: danangmuseum },
        { id: 4, name: "Dragon Bridge", image: dragonbridge }
    ];

    const recommendedItems = [
        { id: 5, name: "Burger Bros", image: burgerbros },
        { id: 6, name: "Banh Xeo Ba Duong", image: banhxeobaduong },
        { id: 7, name: "Madame Lân", image: madamelan },
        { id: 8, name: "Quan Com Hue Ngon", image: quancomhuengon }
    ];

    // Track saved state for each item individually
    const [savedItems, setSavedItems] = useState({});

    const toggleSave = (itemId) => {
        setSavedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleSearch = async () => {
        if (!searchText.trim()) return;
        try {
            const response = await fetch(`http://localhost:8081/location/search?name=${encodeURIComponent(searchText)}`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                const firstLocation = data[0];
                navigate(`/tripguide/foodpage/${firstLocation.location_id}`);
            } else {
                alert("Không tìm thấy địa điểm!");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Location Item component for DRY code
    const LocationItem = ({ item }) => (
        <div className="picture-item">
            <div className="item-content">
                <img src={item.image} alt={item.name} />
                <div className="save-overlay">
                    <button
                        className={`save-button-overlay ${savedItems[item.id] ? "saved" : ""}`}
                        onClick={() => toggleSave(item.id)}>
                        <FontAwesomeIcon
                            icon={savedItems[item.id] ? solidHeart : regularHeart}
                            className="heart-icon-recent"
                        />
                    </button>
                </div>
            </div>
            <p>{item.name}</p>
        </div>
    );

    return (
        <div className="homepage">
            {/* Search Section */}
            <div className="search-container">
                <h1 className="search-title">Ready for a perfect trip?</h1>
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Places to go, things to do, hotels..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
            </div>

            {/* Featured Image */}
            <div className="featured-container">
                <img
                    src={trendcast}
                    alt="Featured"
                    className="featured-image"
                />
                <div className="featured-overlay">
                    <h2>The 2025 Tripadvisor Trendcast</h2>
                    <p>Forecasting the future of travel—now.</p>
                    <button className="featured-button">Check it out</button>
                </div>
            </div>

            <hr />

            {/* Recently Viewed Section */}
            <div className="recently-viewed">
                <h2>Recently viewed</h2>
                <div className="picture-grid">
                    {recentlyViewedItems.map(item => (
                        <LocationItem key={item.id} item={item} />
                    ))}
                </div>
            </div>

            {/* Recommended Section */}
            <div className="you-might-like">
                <h2>You might like these</h2>
                <p className="like-recommend">Make your meals unforgetable!</p>
                <div className="picture-grid">
                    {recommendedItems.map(item => (
                        <LocationItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Homepage;