import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CityDetail.css";
import dragonbridge from "../../assets/images/dragonbridge.png";
import haivanpass from "../../assets/images/haivanpass.png";
import ladybuddha from "../../assets/images/ladybuddha.png";
import marblemountains from "../../assets/images/marblemountains.png";
import asiapark from "../../assets/images/asiapark.png";
import goldenbridge from "../../assets/images/goldenbridge.png";
import tiensa from "../../assets/images/tiensa.png";
import trakieu from "../../assets/images/trakieu.png";
import danang1 from "../../assets/images/danang1.png";
import danang2 from "../../assets/images/danang2.png";
import danang3 from "../../assets/images/danang3.png";
import danang4 from "../../assets/images/danang4.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

const images = [danang1, danang2, danang3, danang4];

const initialPlaces = [
    { id: 1, name: "Hai Van Pass", image: haivanpass, saved: false },
    { id: 2, name: "The Marble Mountains", image: marblemountains, saved: false },
    { id: 3, name: "Lady Buddha", image: ladybuddha, saved: false },
    { id: 4, name: "Dragon Bridge", image: dragonbridge, saved: false },
    { id: 5, name: "Golden Bridge", image: goldenbridge, saved: false },
    { id: 6, name: "Tien Sa", image: tiensa, saved: false },
    { id: 7, name: "The Lady of Tra Kieu's Marian Shrine", image: trakieu, saved: false },
    { id: 8, name: "Asia Park", image: asiapark, saved: false }
];

const CityDetail = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const [places, setPlaces] = useState(initialPlaces);

    const toggleSave = (id) => {
        const updatedPlaces = places.map((place) =>
            place.id === id ? { ...place, saved: !place.saved } : place
        );
        setPlaces(updatedPlaces);
    };

    const [saved, setSaved] = useState(false);
    const toggleSaveCity = () => {
        setSaved(!saved);
    }

    return (
        <div className="city-detail-container">
            <nav className="city-breadcrumb">
                <span>Asia &gt; Vietnam &gt; Da Nang</span>
            </nav>
            <div className="slider">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt="Da Nang"
                        className={`slider-image ${index === currentIndex ? "active" : ""}`}
                    />
                ))}
                <div className="left-btn">
                    <button className="slider-btn-left" onClick={() => setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1)}>◀</button>
                </div>
                <div className="right-btn">
                    <button className="slider-btn-right" onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)}>▶</button>
                </div>
            </div>
            <div className="name-and-action">
                <h1>Da Nang, Viet Nam</h1>
                <div className="city-save-action">
                    <button
                        className={`save-city ${saved ? "saved" : ""}`}
                        onClick={toggleSaveCity}>
                        <FontAwesomeIcon
                            icon={saved ? solidHeart : regularHeart}
                            className="save-city-icon"
                        ></FontAwesomeIcon>
                        {saved ? "Saved" : "Save"}
                    </button>
                </div>
            </div>
            <div className="city-overview">
                Da Nang is a beautiful coastal city in central Vietnam, famous for its pristine beaches, unique bridges, and rich culinary scene.
                This city is an ideal destination for travelers, featuring breathtaking attractions such as Ba Na Hills, Marble Mountains, and Son Tra Peninsula.
                The Dragon Bridge, a symbol of Da Nang, captivates visitors every weekend with its spectacular fire and water performances.
                Beyond its stunning landscapes, Da Nang is known for its modern yet friendly atmosphere and serves as a gateway to the ancient town of Hoi An and the My Son Sanctuary.
                With a perfect blend of nature, culture, and cuisine, Da Nang is a must-visit destination for every traveler.
            </div>
            <div className="where-to-go">
                <div className="where-to-go-firstline">
                    <h2>Where to go?</h2>
                    <button className="see-all">See all</button>
                </div>
                <div className="picture-grid">
                    {places.map((place) => (
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
            <div className="itineraries">
                <h2>Our Recommended Plan for Your Trip</h2>
                <div className="recommended-plan">
                    <div className="itinerary-card">
                        <div className="tags">
                            <span className="tag">Friends</span>
                            <span className="tag">Natural Wonders</span>
                            <span className="tag">Night Markets</span>
                        </div>
                        <h3>4 days in Da Nang for <br /> friend groups</h3>
                        <div className="powered-by">
                            <span role="img" aria-label="ai">🤖</span> Powered by AI
                        </div>
                    </div>

                    <div className="itinerary-card">
                        <div className="tags">
                            <span className="tag">Couples</span>
                            <span className="tag">Wine & Beer</span>
                            <span className="tag">History</span>
                        </div>
                        <h3>5 days in Da Nang for <br /> couples</h3>
                        <div className="powered-by">
                            <span role="img" aria-label="ai">🤖</span> Powered by AI
                        </div>
                    </div>

                    <div className="itinerary-card">
                        <div className="tags">
                            <span className="tag">Family</span>
                            <span className="tag">Natural Wonders</span>
                            <span className="tag">Outdoors</span>
                        </div>
                        <h3>7 days in Da Nang for <br /> families</h3>
                        <div className="powered-by">
                            <span role="img" aria-label="ai">🤖</span> Powered by AI
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CityDetail;