import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Attraction.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareShareNodes, faPen } from '@fortawesome/free-solid-svg-icons';
import { faImages, faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import cozy from "../../assets/images/Hotel/cozy.png";
import wink from "../../assets/images/Hotel/wink.png";
import big3 from "../../assets/images/FoodDrink/3big.png";
import tuongtheater from "../../assets/images/Cities/tuongtheater.png";
import { useParams } from "react-router-dom";
import MapComponent from "../../components/GoogleMap/GoogleMap";
import BASE_URL from "../../constants/BASE_URL";

const initialNearbyPlaces = [
    { id: 1, name: "Cozy Danang Boutique Hotel", image: cozy, saved: false },
    { id: 2, name: "Wink Hotel Danang Centre", image: wink, saved: false },
    { id: 3, name: "3 Big - Nuong & Lau", image: big3, saved: false },
    { id: 4, name: "Nguyen Hien Dinh Theatre", image: tuongtheater, saved: false },
];

const Attraction = () => {
    const { id: attractionId } = useParams(); // Lấy restaurantId từ URL
    const [attraction, setAttraction] = useState(null); // Đổi thành null để kiểm tra dễ hơn
    // const [reviews, setReviews] = useState([]); // Comment lại state reviews
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState(initialNearbyPlaces);
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!attractionId) return;
        setLoading(true);

        const fetchAttraction = async () => {
            try {
                // Lấy thông tin nhà hàng
                const attractionResponse = await axios.get(`${BASE_URL}/attractions/${attractionId}`);
                const attractionData = attractionResponse.data; // Dữ liệu nằm trong data.data theo controller
                setAttraction(attractionData);

                // Comment lại phần lấy reviews
                /*
                // Lấy danh sách reviews
                const reviewResponse = await axios.get(`${BASE_URL}/reviews/${restaurantId}`);
                const reviewData = reviewResponse.data; // Giả sử API reviews trả về mảng trực tiếp

                if (!Array.isArray(reviewData)) {
                    console.error("Lỗi: API reviews không trả về mảng", reviewData);
                    setReviews([]);
                    return;
                }

                // Lấy thông tin user cho mỗi review
                const reviewsWithUser = await Promise.all(
                    reviewData.map(async (review) => {
                        const userResponse = await axios.get(`${BASE_URL}/users/${review.user_id}`);
                        return { ...review, userName: userResponse.data.username };
                    })
                );
                setReviews(reviewsWithUser);
                */
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttraction();
    }, [attractionId]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <>
                {"★".repeat(fullStars)}
                {halfStar && "⯨"}
                {"☆".repeat(emptyStars)}
            </>
        );
    };

    const toggleSaveNearby = (id) => {
        const updatedPlaces = nearbyPlaces.map((place) =>
            place.id === id ? { ...place, saved: !place.saved } : place
        );
        setNearbyPlaces(updatedPlaces);
    };

    const toggleSaveAttraction = () => {
        setSaved(!saved);
    };

    const handlenavigate_attraction = async (attraction_id) => {
        try {
            console.log("Attraction_id", attraction_id);
            navigate(`/tripguide/foodpage/${attraction_id}`);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    return (
        <div className="attraction-container">
            <nav className="breadcrumb">
                <span>Asia &gt; Vietnam &gt; Da Nang &gt; Da Nang Attractions &gt; attraction name </span>
            </nav>

            <header className="attraction-header">
                <div className="name-and-action">
                    <h1>Name</h1>
                    <div className="attraction-action">
                        <button className="share-attraction">
                            <FontAwesomeIcon icon={faSquareShareNodes} className="share-icon" />
                            Share
                        </button>
                        <a href="#attraction-reviews">
                            <button className="review-attraction">
                                <FontAwesomeIcon icon={faPen} className="review-icon" />
                                Review
                            </button>
                        </a>
                        <button className={`save-attraction ${saved ? "saved" : ""}`} onClick={toggleSaveAttraction}>
                            <FontAwesomeIcon
                                icon={saved ? solidHeart : regularHeart}
                                className="save-attraction-icon" />
                            {saved ? "Saved" : "Save"}
                        </button>
                    </div>
                </div>
                <div className="attraction-rating">
                    <span className="rate-star">{renderStars(attraction.average_rating)}</span>
                    <span className="rate-reviews">177 reviews</span>
                    <span className="rate-rank">#144 of 1,619 Attractive Places in Da Nang</span>
                </div>
            </header>

            <div className="attraction-images">
                <img src={attraction.image_url[0]} alt="Main Dish" className="main-image" /> {/* Lấy ảnh đầu tiên */}
            </div>

            <div className="attraction-info">
                <div className="location-info">
                    <h2>Overview</h2>
                    <p className="brief-describe">"..."</p>
                    <h2>Location</h2>
                    <div>
                        <MapComponent address={attraction.address} />
                    </div>
                </div>

            </div>

            {/* Comment lại phần Reviews */}
            {/* 
            <div className="reviews">
                <h2 id="restaurant-reviews">Reviews</h2>
                <div className="reviews-div">
                    <div className="review-summary">
                        <span className="rate-star">{renderStars(restaurant.average_rating)}</span>
                        <div className="reviews-score">
                            <p>75 Excellent</p>
                            <p>66 Very Good</p>
                            <p>29 Average</p>
                            <p>8 Poor</p>
                            <p>3 Terrible</p>
                        </div>
                    </div>
                    <div className="review-detail">
                        <div className="new-review"><input type="text" placeholder="Write new review..." /></div><br />
                        <div className="submit-review"><input type="submit" /></div>
                        <div>
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div className="review" key={index}>
                                        <p className="review-title"><b>{review.userName}</b></p>
                                        <p className="review-date"><i>{new Date(review.created_at).toDateString()}</i></p>
                                        <p className="review-content">{review.comment}</p>
                                        <button>Read more</button>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            */}

            <div className="nearby">
                <h2>Best nearby</h2>
                <div className="picture-grid">
                    {nearbyPlaces.map((place) => (
                        <div className="picture-item" key={place.id}>
                            <div className="item-content">
                                <img src={place.image} alt={place.name} onClick={() => handlenavigate_attraction(place.attraction_id)}
                                    style={{ cursor: 'pointer' }} />
                                <div className="save-overlay">
                                    <button
                                        className={`save-button-overlay ${place.saved ? "saved" : ""}`}
                                        onClick={() => toggleSaveNearby(place.id)}>
                                        <FontAwesomeIcon
                                            icon={place.saved ? solidHeart : regularHeart}
                                            className="heart-icon-recent"
                                        />
                                    </button>
                                </div>
                            </div>
                            <p>{place.name}</p>
                            <div className="rating">
                                <span className="rate-star">{place.average_rating}{renderStars(place.average_rating)}</span>
                                <span className="rate-reviews">177 reviews</span>
                                <span className="rate-rank">No.17</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Attraction;