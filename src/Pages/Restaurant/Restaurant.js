import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Restaurant.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareShareNodes, faPen } from "@fortawesome/free-solid-svg-icons";
import {
  faImages,
  faHeart as regularHeart,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import cozy from "../../assets/images/Hotel/cozy.png";
import wink from "../../assets/images/Hotel/wink.png";
import big3 from "../../assets/images/FoodDrink/3big.png";
import tuongtheater from "../../assets/images/Cities/tuongtheater.png";
import { useParams } from "react-router-dom";
// import MapComponent from "../../components/GoogleMap/GoogleMap";
import BASE_URL from "../../constants/BASE_URL";
import { authService } from "../../services/authService";
const initialNearbyPlaces = [
  { id: 1, name: "Cozy Danang Boutique Hotel", image: cozy, saved: false },
  { id: 2, name: "Wink Hotel Danang Centre", image: wink, saved: false },
  { id: 3, name: "3 Big - Nuong & Lau", image: big3, saved: false },
  {
    id: 4,
    name: "Nguyen Hien Dinh Theatre",
    image: tuongtheater,
    saved: false,
  },
];

const Restaurant = () => {
  const { id: restaurantId } = useParams(); // Lấy restaurantId từ URL
  const [restaurant, setRestaurant] = useState(null); // Đổi thành null để kiểm tra dễ hơn
  const [city, setCity] = useState(null);
  const [resRank, setresRank] = useState(null);
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
    if (!restaurantId) return;
    setLoading(true);
    console.log(restaurantId);
    const fetchRestaurant = async () => {
      try {
        // Lấy thông tin nhà hàng
        const restaurantResponse = await axios.get(
          `${BASE_URL}/restaurants/${restaurantId}`
        );
        const restaurantData = restaurantResponse.data; // Dữ liệu nằm trong data.data theo controller
        setRestaurant(restaurantData);

        const cityRespone = await axios.get(
          `${BASE_URL}/cities/${restaurantData.city_id}`
        );
        const cityData = cityRespone.data;
        setCity(cityData);

        const restaurantRankRespone = await axios.get(
          `${BASE_URL}/restaurants/rank/${restaurantId}`
        );
        const restaurantRankData = restaurantRankRespone.data;
        setresRank(restaurantRankData);

        const nearByRespone = await axios.get(
          `${BASE_URL}/restaurants/topnearby/${restaurantId}`
        );
        const nearByData = nearByRespone.data.nearbyTopRestaurant;
        setnearBy(nearByData);

        console.log("nearByData:", nearByData);

        const reviewResponse = await axios.get(
          `${BASE_URL}/reviews/restaurant/${restaurantId}`
        );
        const reviewData = reviewResponse.data;
        if (!Array.isArray(reviewData)) {
          console.error("Lỗi: API reviews không trả về mảng", reviewData);
          setReviews([]);
          return;
        }
        const reviewsWithUser = await Promise.all(
          reviewData.map(async (review) => {
            const userResponse = await axios.get(
              `${BASE_URL}/users/${review.user_id}`
            );
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
        // console.log(user.user.username)
        const userIdRespone = await axios.get(
          `${BASE_URL}/users/email/${user.user.email}`
        );
        const userIdData = userIdRespone.data;
        setUser_id(userIdData);
        console.log(userIdData.user_id);

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
        {halfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  const handlenavigate_attraction = async (attraction_id) => {
    try {
      console.log("Attraction_id", attraction_id);
      navigate(`/tripguide/foodpage/${attraction_id}`);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id?.user_id,
          attraction_id: null,
          restaurant_id: restaurant?.restaurant_id,
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
    } catch (error) {
      console.error("Lỗi khi gửi review:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const toggleSaveNearby = (id) => {
    const updatedPlaces = nearbyPlaces.map((place) =>
      place.id === id ? { ...place, saved: !place.saved } : place
    );
    setNearbyPlaces(updatedPlaces);
  };

  const toggleSaveRestaurant = () => {
    setSaved(!saved);
  };

  return (
    <div className="restaurant-container">
      <nav className="breadcrumb">
        <span>
          Vietnam &gt; {city?.name} &gt; {city?.name} Restaurants &gt;{" "}
          {restaurant.name}
        </span>
      </nav>

      <header className="restaurant-header">
        <div className="name-and-action">
          <h1>{restaurant.name}</h1>
          <div className="restaurant-action">
            <button className="share-restaurant">
              <FontAwesomeIcon
                icon={faSquareShareNodes}
                className="share-icon"
              />
              Share
            </button>
            <a href="#restaurant-reviews">
              <button className="review-restaurant">
                <FontAwesomeIcon icon={faPen} className="review-icon" />
                Review
              </button>
            </a>
            <button
              className={`save-restaurant ${saved ? "saved" : ""}`}
              onClick={toggleSaveRestaurant}
            >
              <FontAwesomeIcon
                icon={saved ? solidHeart : regularHeart}
                className="save-restaurant-icon"
              />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        <div className="restaurant-rating">
          <span className="rate-star">
            {restaurant.average_rating} &gt;
            {renderStars(restaurant.average_rating)}
          </span>
          <span className="rate-reviews">
            {restaurant.rating_total} reviews
          </span>
          <span className="rate-rank">
            #{resRank?.rank} of {city?.name}'s restaurant.
          </span>
        </div>
      </header>

      <div className="restaurant-images">
        <img
          src={restaurant.image_url[0]}
          alt="Main Dish"
          className="main-image"
        />{" "}
        {/* Lấy ảnh đầu tiên */}
      </div>

      <div className="restaurant-info">
        <div className="location-info">
          <h2>Overview</h2>
          <p className="open-status">Open until {restaurant.close_time}</p>
          <p className="location">📍 {restaurant.address}</p>

          <h2>Location</h2>
          {/* <div>
                    <h2>Location</h2>
                    {/* <div>
                        <MapComponent address={restaurant.address} />
                    </div> */}
        </div>
        <div className="hours-info">
          <h2>Hours</h2>
          <p className="open-status">Open until {restaurant.close_time}</p>
          <table>
            <tbody>
              <tr>
                <td>Sunday</td>
                <td>
                  {restaurant.open_time} - {restaurant.close_time}
                </td>
              </tr>
              <tr>
                <td>Monday</td>
                <td>
                  {restaurant.open_time} - {restaurant.close_time}
                </td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>
                  {restaurant.open_time} - {restaurant.close_time}
                </td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>
                  {restaurant.open_time} - {restaurant.close_time}
                </td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>
                  {restaurant.open_time} - {restaurant.close_time}
                </td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>
                  {restaurant.open_time} - {restaurant.close_time}
                </td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>
                  {restaurant.open_time} - {restaurant.close_time}
                </td>
              </tr>
            </tbody>
          </table>
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

      {/* Comment lại phần Reviews */}

      < div className="reviews" >
        <h2 id="restaurant-reviews">Reviews</h2>
        <div className="reviews-div">
          <div className="review-summary">
            <span className="rate-star">
              {renderStars(restaurant.average_rating)}
            </span>
            <div className="reviews-score">
              <p>75 Excellent</p>
              <p>66 Very Good</p>
              <p>29 Average</p>
              <p>8 Poor</p>
              <p>3 Terrible</p>
            </div>
          </div>
          <div className="review-detail">
            <div className="new-review">
              <textarea
                placeholder="Write new review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <br />
            <div className="submit-review">
              <button onClick={handleSubmit}>Submit</button>
            </div>
            <div>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div className="review" key={index}>
                    <p className="review-title">
                      <b>{review.userName}</b>
                    </p>
                    <p className="review-date">
                      <i>{new Date(review.created_at).toDateString()}</i>
                    </p>
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
      </div >

      <div className="nearby">
        <h2>Best nearby</h2>
        <div className="picture-grid">
          {nearBy?.map((place) => (
            <div className="picture-item" key={place.id}>
              <div className="item-image-container">
                <img
                  src={place.image_url}
                  alt={place.name}
                  onClick={() => handlenavigate_attraction(place.restaurant_id)}
                  style={{ cursor: "pointer" }}
                />
                <div className="save-overlay">
                  <button
                    className={`save-button-overlay ${place.saved ? "saved" : ""
                      }`}
                    onClick={() => toggleSaveNearby(place.id)}
                  >
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
                  <span className="rating-score">{place.average_rating} </span>
                  <span className="rating-dots">
                    {renderStars(place.average_rating)}{" "}
                  </span>
                  <span className="review-count">{place.rating_total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export default Restaurant;