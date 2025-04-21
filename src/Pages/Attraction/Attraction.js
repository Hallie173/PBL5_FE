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
import { authService } from "../../services/authService";

const initialNearbyPlaces = [
    { id: 1, name: "Cozy Danang Boutique Hotel", image: cozy, saved: false },
    { id: 2, name: "Wink Hotel Danang Centre", image: wink, saved: false },
    { id: 3, name: "3 Big - Nuong & Lau", image: big3, saved: false },
    { id: 4, name: "Nguyen Hien Dinh Theatre", image: tuongtheater, saved: false },
];

const Attraction = () => {
    const { id: attractionId } = useParams(); // Lấy restaurantId từ URL
    const [attraction, setAttraction] = useState(null); // Đổi thành null để kiểm tra dễ hơn
    const [city, setCity] = useState(null);
    const [attractionRank, setattractionRank] = useState(null);
    const [nearBy, setnearBy] = useState([]);
    const [reviews, setReviews] = useState([]); // Comment lại state reviews
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState(initialNearbyPlaces);
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [comment, setComment] = useState("");
    const [user_id, setUser_id] = useState(null);
    useEffect(() => {
        if (!attractionId) return;
        setLoading(true);

        const fetchAttraction = async () => {
            try {
                // Lấy thông tin địa điểm
                const attractionResponse = await axios.get(`${BASE_URL}/attractions/${attractionId}`);
                const attractionData = attractionResponse.data; // Dữ liệu nằm trong data.data theo controller
                setAttraction(attractionData);

                const cityRespone = await axios.get(`${BASE_URL}/cities/${attractionData.city_id}`);
                const cityData = cityRespone.data;
                setCity(cityData);
                console.log(city.city_id);
                const attractionRankRespone = await axios.get(`${BASE_URL}/attractions/rank/${attractionId}`);
                const attractionRankData = attractionRankRespone.data;
                setattractionRank(attractionRankData);


                const nearByRespone = await axios.get(`${BASE_URL}/attractions/topnearby/${attractionId}`);
                const nearByData = nearByRespone.data.nearby;
                setnearBy(nearByData);
                
                const reviewResponse = await axios.get(`${BASE_URL}/reviews/attraction/${attractionId}`);
                const reviewData = reviewResponse.data;
                if (!Array.isArray(reviewData)) {
                    console.error("Lỗi: API reviews không trả về mảng", reviewData);
                    setReviews([]);
                    return;
                }
                const reviewsWithUser = await Promise.all(
                    reviewData.map(async (review) => {
                        const userResponse = await axios.get(`${BASE_URL}/users/${review.user_id}`);
                        //console.log(userResponse.data.username);
                        return { ...review, userName: userResponse.data.username };
                    })
                );

                setReviews(reviewsWithUser);
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    setIsLoggedIn(true);
                    setUser(currentUser);
                }
                console.log(user.user.username);
                // console.log(user.user.username)
                const userIdRespone = await axios.get(`${BASE_URL}/users/email/${user.user.email}`);
                const userIdData = userIdRespone.data;
                setUser_id(userIdData);
                console.log(userIdData.user_id);
                // Comment lại phần lấy reviews
                /*
                // Lấy danh sách reviews
                const reviewResponse = await axios.get(`${BASE_URL}/reviews/${restaurantId}`);
                const reviewData = reviewResponse.data; // Giả sử API reviews trả về mảng trực tiếp

                

                // Lấy thông tin user cho mỗi review
                
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
                {halfStar && "☆"}
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
            navigate(`/tripguide/attraction/${attraction_id}`);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    const handleSubmit = async () => {
        if (!comment.trim()) return;

        try {
            const response = await fetch('http://localhost:8080/reviews', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user_id?.user_id,
                    attraction_id: attraction?.attraction_id,
                    restaurant_id: null,
                    comment: comment.trim(),
                    rating: 5,
                    photos: null,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(response.json);
            console.log("Đã tạo review:", data);
            alert("Đánh giá đã được gửi!");
            setComment(""); // Reset form
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi gửi review:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <div className="attraction-container">
            <nav className="breadcrumb">
                <span>Vietnam &gt; {city?.name} &gt; {city?.name} Attractions &gt; {attraction?.name} </span>
            </nav>

            <header className="attraction-header">
                <div className="name-and-action">
                    <h1>{attraction?.name}</h1>
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
                    <span className="rate-star">{renderStars(attraction?.average_rating)}</span>
                    <span className="rate-reviews">{attraction?.rating_total} reviews </span>
                    <span className="rate-rank">#{attractionRank?.rank} of {city?.name}'s attraction.</span>
                </div>
            </header>

            <div className="attraction-images">
                <img src={attraction?.image_url[0]} alt="Main Dish" className="main-image" /> {/* Lấy ảnh đầu tiên */}
            </div>

            <div className="attraction-info">
                <div className="location-info">
                    <h2>Overview</h2>
                    <p className="location">📍 {attraction?.address}</p>
                    <h2>Location</h2>
                    <div>
                        <MapComponent address={attraction?.address} />
                    </div>
                </div>

            </div>

            {/* Comment lại phần Reviews */}

            <div className="reviews">
                <h2 id="restaurant-reviews">Reviews</h2>
                <div className="reviews-div">
                    <div className="review-summary">
                        <span className="rate-star">{renderStars(attraction?.average_rating)} {attraction?.average_rating}</span>
                        <div className="reviews-score">
                            <p>75 Excellent</p>
                            <p>66 Very Good</p>
                            <p>29 Average</p>
                            <p>8 Poor</p>
                            <p>3 Terrible</p>
                        </div>
                    </div>
                    <div className="review-detail">
                        <div className="new-review"><textarea
                            placeholder="Write new review..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        /></div><br />
                        <div className="submit-review"><button onClick={handleSubmit}>Submit</button></div>
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


            <div className="nearby">
                <h2>Best nearby</h2>
                <div className="picture-grid">
                    {nearBy?.map((place) => (
                        <div className="picture-item" key={place.id}>
                            <div className="item-image-container">
                                <img src={place.image_url} alt={place.name} onClick={() => handlenavigate_attraction(place.attraction_id)}
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
                            <div className="item-text-content">
                                <p className="item-title">{place.name}</p>
                                <div className="item-rating">
                                    <span className="rating-score">{place.average_rating}  </span>
                                    <span className="rating-dots">{renderStars(place.average_rating)}  </span>
                                    <span className="review-count">{place.rating_total}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Attraction;