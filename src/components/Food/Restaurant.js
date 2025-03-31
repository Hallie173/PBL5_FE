import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Restaurant.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareShareNodes, faPen } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import comgaAHai1 from "../../assets/images/comgaahai1.png";
import comgaAHai2 from "../../assets/images/comgaahai2.png";
import comgaAHai3 from "../../assets/images/comgaahai3.png";
import comgaAHai4 from "../../assets/images/comgaahai4.png";
import cozy from "../../assets/images/cozy.png";
import wink from "../../assets/images/wink.png";
import big3 from "../../assets/images/3big.png";
import tuongtheater from "../../assets/images/tuongtheater.png";
import vancocktail from "../../assets/images/vancocktail.png";
import { useParams } from "react-router-dom";

const Restaurant = () => {
    const { id: locationId } = useParams(); // Lấy locationId từ URL // Ưu tiên prop, nếu không có thì lấy từ URL
    const [location, setLocation] = useState(false);
    const [review, setReview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log("locationid: ", locationId);
    useEffect(() => {
        console.log("test", locationId);
        if (!locationId) return;
        setLoading(true);
        const fetchLocation = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/location/${locationId}`);
                setLocation(response.data);
                const reviewresponse = await axios.get(`http://localhost:8081/review/${locationId}`);
                console.log("API Response:", reviewresponse.data); // Kiểm tra dữ liệu trả về

                if (!Array.isArray(reviewresponse.data)) {
                    console.error("Lỗi: API không trả về mảng", reviewresponse.data);
                    return;
                }
                const reviewsWithUser = await Promise.all(
                    reviewresponse.data.map(async (review) => {
                        // Gọi API lấy thông tin user từ user_id
                        const userResponse = await axios.get(`http://localhost:8081/users/${review.user_id}`);
                        return { ...review, userName: userResponse.data.username };
                    })
                );
                setReview(reviewsWithUser);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLocation();
    }, []);
    console.log(location.name);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!location) return <p>No location found</p>;

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating); // Số sao đầy
        const halfStar = rating % 1 !== 0; // Kiểm tra có nửa sao không
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Số sao trống
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
                <span>Asia &gt; Vietnam &gt; Da Nang &gt; Da Nang Restaurants &gt; {location.name}</span>
            </nav>

            <header className="restaurant-header">
                <div className="name-and-action">
                    <h1>{location.name} <span className="claim-status">Unclaimed</span></h1>
                    <div className="restaurant-action">
                        <button className="share-restaurant">
                            <FontAwesomeIcon
                                icon={faSquareShareNodes}
                                className="share-icon"
                            ></FontAwesomeIcon>
                            Share
                        </button>
                        <a href="#restaurant-reviews"><button className="review-restaurant">
                            <FontAwesomeIcon
                                icon={faPen}
                                className="review-icon"
                            ></FontAwesomeIcon>
                            Review
                        </button></a>
                        <button className="save-restaurant">
                            <FontAwesomeIcon
                                icon={faHeart}
                                className="heart-icon"
                            ></FontAwesomeIcon>
                            Save
                        </button>
                    </div>
                </div>
                <div className="rating">
                    <span className="rate-star">{renderStars(location.average_rating)}</span>
                    <span className="rate-reviews">177 reviews</span>
                    <span className="rate-rank">#144 of 1,619 Restaurants in Da Nang</span>
                </div>
            </header>

            <div className="restaurant-images">
                <img src={location.image_url} alt="Main Dish" className="main-image" />
                <div className="side-images">
                    <img src={comgaAHai2} alt="Interior" />
                    <img src={comgaAHai3} alt="Food" />
                    <img src={comgaAHai4} alt="Menu" />
                </div>
            </div>

            <div className="restaurant-info">
                <div className="location-info">
                    <h2>Overview</h2>
                    <p className="open-status">Open until 12:00 AM</p>
                    <p className="location">📍 {location.address}</p>
                    <p className="contact">🌐 Website   | 📞 +84 90 531 26 42</p>
                    <h2>Location</h2>
                    <div className="map-placeholder">[Map will be displayed here]</div>
                </div>
                <div className="hours-info">
                    <h2>Hours</h2>
                    <p className="open-status">Open until 12:00 AM</p>
                    <table>
                        <tbody>
                            <tr><td>Sunday</td><td>8:00 AM - 12:00 AM</td></tr>
                            <tr><td>Monday</td><td>8:00 AM - 12:00 AM</td></tr>
                            <tr><td>Tuesday</td><td>8:00 AM - 12:00 AM</td></tr>
                            <tr><td>Wednesday</td><td>8:00 AM - 12:00 AM</td></tr>
                            <tr><td>Thursday</td><td>8:00 AM - 12:00 AM</td></tr>
                            <tr><td>Friday</td><td>8:00 AM - 12:00 AM</td></tr>
                            <tr><td>Saturday</td><td>8:00 AM - 12:00 AM</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="reviews">
                <h2 id="restaurant-reviews">Reviews</h2>
                <div className="reviews-div">
                    <div className="review-summary">
                        <span className="rate-star">{renderStars(location.average_rating)}</span>
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
                            {review.length > 0 ? (
                                review.map((reviews, index) => (
                                    <div className="review" key={index}>
                                        <p className="review-title"><b>{reviews.userName}</b></p>
                                        <p className="review-date"><i>{new Date(reviews.created_at).toDateString()}</i></p>
                                        <p className="review-content">{reviews.comment}</p>
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
                <div className="nearby-list">
                    <div className="nearby-item"><img src={cozy} /><span>Cozy Danang Boutique Hotel</span></div>
                    <div className="nearby-item"><img src={wink} /><span>Wink Hotel Danang Centre</span></div>
                    <div className="nearby-item"><img src={big3} /><span>3 Big - Nuong & Lau</span></div>
                    <div className="nearby-item"><img src={tuongtheater} /><span>Nguyen Hien Dinh Theatre</span></div>
                </div>
            </div>
        </div >
    );
};

export default Restaurant;
