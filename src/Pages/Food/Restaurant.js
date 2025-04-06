import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Restaurant.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareShareNodes, faPen } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import comgaAHai1 from "../../assets/images/FoodDrink/comgaahai1.png";
import comgaAHai2 from "../../assets/images/FoodDrink/comgaahai2.png";
import comgaAHai3 from "../../assets/images/FoodDrink/comgaahai3.png";
import comgaAHai4 from "../../assets/images/FoodDrink/comgaahai4.png";
import cozy from "../../assets/images/Hotel/cozy.png";
import wink from "../../assets/images/Hotel/wink.png";
import big3 from "../../assets/images/FoodDrink/3big.png";
import tuongtheater from "../../assets/images/Cities/tuongtheater.png";
import vancocktail from "../../assets/images/FoodDrink/vancocktail.png";
import { useParams } from "react-router-dom";
import MapComponent from "../../components/GoogleMap/GoogleMap";
import BASE_URL from "../../constants/BASE_URL";

const Restaurant = () => {
    const { id: restaurantId } = useParams(); // Lấy restaurantId từ URL
    const [restaurant, setRestaurant] = useState(null); // Đổi thành null để kiểm tra dễ hơn
    // const [reviews, setReviews] = useState([]); // Comment lại state reviews
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!restaurantId) return;
        setLoading(true);

        const fetchRestaurant = async () => {
            try {
                // Lấy thông tin nhà hàng
                const restaurantResponse = await axios.get(`${BASE_URL}/restaurants/${restaurantId}`);
                const restaurantData = restaurantResponse.data.data; // Dữ liệu nằm trong data.data theo controller
                setRestaurant(restaurantData);

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

        fetchRestaurant();
    }, [restaurantId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!restaurant) return <p>No restaurant found</p>;

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

    return (
        <div className="restaurant-container">
            <nav className="breadcrumb">
                <span>Asia &gt; Vietnam &gt; Da Nang &gt; Da Nang Restaurants &gt; {restaurant.name}</span>
            </nav>

            <header className="restaurant-header">
                <div className="name-and-action">
                    <h1>{restaurant.name} <span className="claim-status">Unclaimed</span></h1>
                    <div className="restaurant-action">
                        <button className="share-restaurant">
                            <FontAwesomeIcon icon={faSquareShareNodes} className="share-icon" />
                            Share
                        </button>
                        <a href="#restaurant-reviews">
                            <button className="review-restaurant">
                                <FontAwesomeIcon icon={faPen} className="review-icon" />
                                Review
                            </button>
                        </a>
                        <button className="save-restaurant">
                            <FontAwesomeIcon icon={faHeart} className="heart-icon" />
                            Save
                        </button>
                    </div>
                </div>
                <div className="rating">
                    <span className="rate-star">{renderStars(restaurant.average_rating)}</span>
                    <span className="rate-reviews">177 reviews</span>
                    <span className="rate-rank">#144 of 1,619 Restaurants in Da Nang</span>
                </div>
            </header>

            <div className="restaurant-images">
                <img src={restaurant.image_url[0]} alt="Main Dish" className="main-image" /> {/* Lấy ảnh đầu tiên */}
                <div className="side-images">
                    <img src={comgaAHai2} alt="Interior" />
                    <img src={comgaAHai3} alt="Food" />
                    <img src={comgaAHai4} alt="Menu" />
                </div>
            </div>

            <div className="restaurant-info">
                <div className="location-info">
                    <h2>Overview</h2>
                    <p className="open-status">Open until {restaurant.close_time}</p>
                    <p className="location">📍 {restaurant.address}</p>
                    <p className="contact">🌐 Website | 📞 {restaurant.phone_number}</p>
                    <h2>Location</h2>
                    <div>
                        <MapComponent address={restaurant.address} />
                    </div>
                </div>
                <div className="hours-info">
                    <h2>Hours</h2>
                    <p className="open-status">Open until {restaurant.close_time}</p>
                    <table>
                        <tbody>
                            <tr><td>Sunday</td><td>{restaurant.open_time} - {restaurant.close_time}</td></tr>
                            <tr><td>Monday</td><td>{restaurant.open_time} - {restaurant.close_time}</td></tr>
                            <tr><td>Tuesday</td><td>{restaurant.open_time} - {restaurant.close_time}</td></tr>
                            <tr><td>Wednesday</td><td>{restaurant.open_time} - {restaurant.close_time}</td></tr>
                            <tr><td>Thursday</td><td>{restaurant.open_time} - {restaurant.close_time}</td></tr>
                            <tr><td>Friday</td><td>{restaurant.open_time} - {restaurant.close_time}</td></tr>
                            <tr><td>Saturday</td><td>{restaurant.open_time} - {restaurant.close_time}</td></tr>
                        </tbody>
                    </table>
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
                <div className="nearby-list">
                    <div className="nearby-item"><img src={cozy} /><span>Cozy Danang Boutique Hotel</span></div>
                    <div className="nearby-item"><img src={wink} /><span>Wink Hotel Danang Centre</span></div>
                    <div className="nearby-item"><img src={big3} /><span>3 Big - Nuong & Lau</span></div>
                    <div className="nearby-item"><img src={tuongtheater} /><span>Nguyen Hien Dinh Theatre</span></div>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;