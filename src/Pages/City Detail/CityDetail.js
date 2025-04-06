import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CityDetail.scss";
import dragonbridge from "../../assets/images/Cities/dragonbridge.png";
import haivanpass from "../../assets/images/Cities/haivanpass.png";
import ladybuddha from "../../assets/images/Cities/ladybuddha.png";
import marblemountains from "../../assets/images/Cities/marblemountains.png";
import asiapark from "../../assets/images/Cities/asiapark.png";
import goldenbridge from "../../assets/images/Cities/goldenbridge.png";
import tiensa from "../../assets/images/Cities/tiensa.png";
import trakieu from "../../assets/images/Cities/trakieu.png";
import danang1 from "../../assets/images/Cities/danang1.png";
import danang2 from "../../assets/images/Cities/danang2.png";
import danang3 from "../../assets/images/Cities/danang3.png";
import danang4 from "../../assets/images/Cities/danang4.png";
import bellemaison from "../../assets/images/Hotel/bellemaison.png";
import furama from "../../assets/images/Hotel/furama.png";
import haian from "../../assets/images/Hotel/haian.png";
import lesands from "../../assets/images/Hotel/lesands.png";
import monarque from "../../assets/images/Hotel/monarque.png";
import risemount from "../../assets/images/Hotel/risemount.png";
import sala from "../../assets/images/Hotel/sala.png";
import cozy from "../../assets/images/Hotel/cozy.png";
import petitbistro from "../../assets/images/FoodDrink/petitbistro.png";
import lecomptoir from "../../assets/images/FoodDrink/lecomptoir.png";
import allseason from "../../assets/images/FoodDrink/allseason.png";
import citron from "../../assets/images/FoodDrink/citron.png";
import missteak from "../../assets/images/FoodDrink/missteak.png";
import rang from "../../assets/images/FoodDrink/rang.png";
import mocseafood from "../../assets/images/FoodDrink/mocseafood.png";
import madamelan from "../../assets/images/FoodDrink/madamelan.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

const images = [danang1, danang2, danang3, danang4];

const initialVisitPlaces = [
    { id: 1, name: "Hai Van Pass", image: haivanpass, saved: false },
    { id: 2, name: "The Marble Mountains", image: marblemountains, saved: false },
    { id: 3, name: "Lady Buddha", image: ladybuddha, saved: false },
    { id: 4, name: "Dragon Bridge", image: dragonbridge, saved: false },
    { id: 5, name: "Golden Bridge", image: goldenbridge, saved: false },
    { id: 6, name: "Tien Sa", image: tiensa, saved: false },
    { id: 7, name: "The Lady of Tra Kieu's Marian Shrine", image: trakieu, saved: false },
    { id: 8, name: "Asia Park", image: asiapark, saved: false }
];

const initialStayPlaces = [
    { id: 1, name: "Furama Resort Danang", image: furama, saved: false },
    { id: 2, name: "Cozy Danang Boutique Hotel", image: cozy, saved: false },
    { id: 3, name: "HAIAN Beach Hotel & Spa", image: haian, saved: false },
    { id: 4, name: "Belle Maison Parosand Danang", image: bellemaison, saved: false },
    { id: 5, name: "Sala Danang Beach Hotel", image: sala, saved: false },
    { id: 6, name: "Monarque Hotel", image: monarque, saved: false },
    { id: 7, name: "Risemount Premier Resort Danang", image: risemount, saved: false },
    { id: 8, name: "Le Sands Oceanfront Danang Hotel", image: lesands, saved: false }
];

const initialEatPlaces = [
    { id: 1, name: "Le Petit Bistro Da Nang", image: petitbistro },
    { id: 2, name: "All Seasons Buffet - Da Nang", image: allseason },
    { id: 3, name: "Le Comptoir Danang", image: lecomptoir },
    { id: 4, name: "Citron Restaurant", image: citron },
    { id: 5, name: "Missteak", image: missteak, saved: false },
    { id: 6, name: "Rang.danang", image: rang, saved: false },
    { id: 7, name: "Mộc Seafood", image: mocseafood, saved: false },
    { id: 8, name: "Madame Lan", image: madamelan, saved: false }
];

const faqData = [
    "What are the best beachfront accommodations in Da Nang?",
    "What are popular dining options in Da Nang?",
    "What are the transportation options from Da Nang airport?",
    "What should I know about visiting Ba Na Hills?",
    "What is the typical weather like in Da Nang?",
    "What are the recommended ways to experience Hai Van Pass?",
    "What are the travel highlights for Bana Hills?",
];

const CityDetail = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const [placesToVisit, setPlacesToVisit] = useState(initialVisitPlaces);
    const [placesToStay, setPlacesToStay] = useState(initialStayPlaces);
    const [placesToEat, setPlacesToEat] = useState(initialEatPlaces);

    const toggleSaveVisitCity = (id) => {
        const updatedPlaces = placesToVisit.map((place) =>
            place.id === id ? { ...place, saved: !place.saved } : place
        );
        setPlacesToVisit(updatedPlaces);
    };

    const toggleSaveStayCity = (id) => {
        const updatedPlaces = placesToStay.map((place) =>
            place.id === id ? { ...place, saved: !place.saved } : place
        );
        setPlacesToStay(updatedPlaces);
    };

    const toggleSaveEatCity = (id) => {
        const updatedPlaces = placesToEat.map((place) =>
            place.id === id ? { ...place, saved: !place.saved } : place
        );
        setPlacesToEat(updatedPlaces);
    };

    const [saved, setSaved] = useState(false);
    const toggleSaveCity = () => {
        setSaved(!saved);
    };

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

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
                    <button className={`save-city ${saved ? "saved" : ""}`} onClick={toggleSaveCity}>
                        <FontAwesomeIcon
                            icon={saved ? solidHeart : regularHeart}
                            className="save-city-icon"
                        />
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
                    {placesToVisit.map((place) => (
                        <div className="picture-item" key={place.id}>
                            <div className="item-content">
                                <img src={place.image} alt={place.name} />
                                <div className="save-overlay">
                                    <button
                                        className={`save-button-overlay ${place.saved ? "saved" : ""}`}
                                        onClick={() => toggleSaveVisitCity(place.id)}>
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

            <div className="where-to-stay">
                <div className="where-to-stay-firstline">
                    <h2>Where to stay?</h2>
                    <button className="see-all">See all</button>
                </div>
                <div className="picture-grid">
                    {placesToStay.map((place) => (
                        <div className="picture-item" key={place.id}>
                            <div className="item-content">
                                <img src={place.image} alt={place.name} />
                                <div className="save-overlay">
                                    <button
                                        className={`save-button-overlay ${place.saved ? "saved" : ""}`}
                                        onClick={() => toggleSaveStayCity(place.id)}>
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

            <div className="food-and-drink">
                <div className="food-and-drink-firstline">
                    <h2>Food & Drink</h2>
                    <button className="see-all">See all</button>
                </div>
                <div className="picture-grid">
                    {placesToEat.map((place) => (
                        <div className="picture-item" key={place.id}>
                            <div className="item-content">
                                <img src={place.image} alt={place.name} />
                                <div className="save-overlay">
                                    <button
                                        className={`save-button-overlay ${place.saved ? "saved" : ""}`}
                                        onClick={() => toggleSaveEatCity(place.id)}
                                    >
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

            <div className="travel-advice-container">
                <h2 className="title"><span className="city-name">Da Nang</span> travel advice</h2>
                <p className="subtitle">
                    These questions and answers were created by AI, using the most common questions travelers ask in the forums.
                </p>
                <div className="faq-list">
                    {faqData.map((question, index) => (
                        <div key={index} className="faq-item">
                            <div
                                className="faq-question"
                                onClick={() => toggleAnswer(index)}
                            >
                                {question}
                                <span className="faq-toggle-icon">{activeIndex === index ? "▴" : "▾"}</span>
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    This is a placeholder answer for: <strong>{question}</strong>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CityDetail;
