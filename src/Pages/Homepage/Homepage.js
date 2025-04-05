import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import trendcast from "../../views/trendcast.png";
import golemcafe from "../../assets/images/golemcafe.png";
import marblemountains from "../../assets/images/marblemountains.png";
import danangmuseum from "../../assets/images/danangmuseum.png";
import dragonbridge from "../../assets/images/dragonbridge.png";
import burgerbros from "../../assets/images/burgerbros.png";
import banhxeobaduong from "../../assets/images/banhxeobaduong.png";
import madamelan from "../../assets/images/madamelan.png";
import quancomhuengon from "../../assets/images/quancomhuengon.png";

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

    const handleSearch = async () => {
        if (!searchText.trim()) return;
        try {
            const response = await fetch(`http://localhost:8081/location/search?name=${encodeURIComponent(searchText)}`);
            const data = await response.json();
            console.log(data.location_id);


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

    const [places, setPlaces] = useState(initialPlaces);

    const toggleSave = (id) => {
        const updatedPlaces = places.map((place) =>
            place.id === id ? { ...place, saved: !place.saved } : place
        );
        setPlaces(updatedPlaces);
    };

    return (
        <div className="homepage">
            {/* Phần tìm kiếm */}
            <div className="search-container">
                <h1 className="search-title">Ready for a perfect trip?</h1>
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Places to go, things to do, hotels..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
            </div>

            {/* Phần ảnh lớn */}
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

            <div className="recently-viewed">
                <h2>Recently viewed</h2>
                <div className="picture-grid">
                    {places.slice(0, 4).map((place) => (
                        <div className="picture-item" key={place.id}>
                            <div className="item-content">
                                <img src={place.image} alt={place.name} />
                                <div className="save-overlay">
                                    <button
                                        className={`save-button-overlay ${place.saved ? "saved" : ""}`}
                                        onClick={() => toggleSave(place.id)}>
                                        <FontAwesomeIcon
                                            icon={place.saved ? solidHeart : regularHeart}
                                            className="heart-icon-recent"
                                        />
                                    </button>
                                </div>
                            </div>
                            <p>{place.name}</p>
                            <div className="rating">
                                <span className="rate-star">*****</span>
                                <span className="rate-reviews">177 reviews</span>
                                <span className="rate-rank"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* You Might Like These */}
            <div className="you-might-like">
                <h2>You might like these</h2>
                <p className="like-recommend">Make your meals unforgetable!</p>
                <div className="picture-grid">
                    {places.slice(4).map((place) => (
                        <div className="picture-item" key={place.id}>
                            <div className="item-content">
                                <img src={place.image} alt={place.name} />
                                <div className="save-overlay">
                                    <button
                                        className={`save-button-overlay ${place.saved ? "saved" : ""}`}
                                        onClick={() => toggleSave(place.id)}>
                                        <FontAwesomeIcon
                                            icon={place.saved ? solidHeart : regularHeart}
                                            className="heart-icon-recent"
                                        />
                                    </button>
                                </div>
                            </div>
                            <p>{place.name}</p>
                            <div className="rating">
                                <span className="rate-star">*****</span>
                                <span className="rate-reviews">177 reviews</span>
                                <span className="rate-rank"></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
