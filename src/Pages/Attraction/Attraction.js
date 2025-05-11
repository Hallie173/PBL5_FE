import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Attraction.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareShareNodes,
  faPen,
  faLocationDot,
  faStar as solidStar,
  faStarHalfStroke,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import {
  faImages,
  faHeart as regularHeart,
  faStar as regularStar,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as solidHeart,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import BASE_URL from "../../constants/BASE_URL";
import { useAuth } from "../../contexts/AuthContext";
import OpenStreetMap from "../../components/OpenStreetMap/OpenStreetMap";

const Attraction = () => {
  const { id: attractionId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const [attraction, setAttraction] = useState(null);
  const [city, setCity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [user_id, setUser_id] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapError, setMapError] = useState(null);
  const navigate = useNavigate();

  // Fetch attraction data and geocode address
  const fetchAttraction = useCallback(async () => {
    if (!attractionId) return;
    setLoading(true);
    setMapError(null);
    try {
      // Fetch attraction data
      const attractionResponse = await axios.get(
        `${BASE_URL}/attractions/${attractionId}`
      );
      const attractionData = attractionResponse.data;
      const processedAttraction = {
        ...attractionData,
        average_rating: parseFloat(attractionData.average_rating) || 0,
      };
      setAttraction(processedAttraction);

      // Fetch city data
      const cityResponse = await axios.get(
        `${BASE_URL}/cities/${attractionData.city_id}`
      );
      setCity(cityResponse.data);

      // Fetch reviews
      const reviewResponse = await axios.get(
        `${BASE_URL}/reviews/attraction/${attractionId}`
      );
      const reviewData = Array.isArray(reviewResponse.data)
        ? reviewResponse.data
        : [];
      const reviewsWithUser = await Promise.all(
        reviewData.map(async (review) => {
          const userResponse = await axios.get(
            `${BASE_URL}/users/${review.user_id}`
          );
          return {
            ...review,
            userName: userResponse.data.username,
            profilePic:
              userResponse.data.profile_image ||
              "https://via.placeholder.com/40",
          };
        })
      );
      setReviews(reviewsWithUser);

      // Geocode address
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        attractionData.address
      )}`;
      const geocodeResponse = await axios.get(geocodeUrl, {
        headers: { Accept: "application/json" },
      });

      if (geocodeResponse.data && geocodeResponse.data.length > 0) {
        const { lat, lon } = geocodeResponse.data[0];
        const coords = [parseFloat(lat), parseFloat(lon)];
        if (!isNaN(coords[0]) && !isNaN(coords[1])) {
          setMapCenter(coords);
        } else {
          setMapError("Tọa độ không hợp lệ từ địa chỉ.");
        }
      } else {
        setMapError("Không thể tìm thấy vị trí trên bản đồ.");
      }
    } catch (err) {
      setError(err.message);
      setMapError("Lỗi khi tải vị trí: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [attractionId]);

  useEffect(() => {
    fetchAttraction();
  }, [fetchAttraction]);

  // Render rating stars
  const renderStars = (rating) => {
    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      return <div className="stars-container">Invalid rating</div>;
    }

    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= Math.floor(numRating)) {
            return (
              <FontAwesomeIcon
                key={star}
                icon={solidStar}
                className="star-icon filled"
              />
            );
          } else if (
            star === Math.ceil(numRating) &&
            !Number.isInteger(numRating)
          ) {
            return (
              <FontAwesomeIcon
                key={star}
                icon={faStarHalfStroke}
                className="star-icon half"
              />
            );
          } else {
            return (
              <FontAwesomeIcon
                key={star}
                icon={regularStar}
                className="star-icon empty"
              />
            );
          }
        })}
      </div>
    );
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment before submitting.");
      return;
    }
    if (!isLoggedIn) {
      alert("Please log in to submit a review.");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/reviews`, {
        user_id: user_id?.user_id,
        attraction_id: attraction?.attraction_id,
        restaurant_id: null,
        comment: comment.trim(),
        rating,
        photos: null,
      });
      alert("Your review has been submitted!");
      setComment("");
      setRating(5);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle sharing
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: attraction?.name,
        text: `Discover ${attraction?.name} in ${city?.name}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Liên kết đã được sao chép vào clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading attraction information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>An error occurred</h2>
        <p>{error}</p>
        <p>{mapError}</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  return (
    <div className="attraction-container">
      {/* Header and breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <button
              onClick={() => navigate("/tripguide")}
              aria-label="Go to Vietnam"
            >
              Vietnam
            </button>
          </li>
          <li className="breadcrumb-separator" aria-hidden="true">
            <FontAwesomeIcon icon={faChevronRight} />
          </li>
          <li className="breadcrumb-item">
            <button
              onClick={() => navigate(`/tripguide/city/${city?.city_id}`)}
              aria-label={`Go to ${city?.name}`}
            >
              {city?.name}
            </button>
          </li>
          <li className="breadcrumb-separator" aria-hidden="true">
            <FontAwesomeIcon icon={faChevronRight} />
          </li>
          <li className="breadcrumb-item">
            <button
              onClick={() =>
                navigate(`/tripguide/city/${city?.city_id}/attractions`)
              }
              aria-label={`Go to ${city?.name} attractions`}
            >
              {city?.name} Attractions
            </button>
          </li>
          <li className="breadcrumb-separator" aria-hidden="true">
            <FontAwesomeIcon icon={faChevronRight} />
          </li>
          <li className="breadcrumb-item current" aria-current="page">
            {attraction?.name}
          </li>
        </ol>
      </nav>

      <header className="attraction-header">
        <div className="name-and-action">
          <h1>{attraction?.name}</h1>
          <div className="attraction-action">
            <button
              className="action-button share-attraction"
              onClick={handleShareClick}
            >
              <FontAwesomeIcon
                icon={faSquareShareNodes}
                className="action-icon"
              />
              <span>Share</span>
            </button>
            <a href="#review-section">
              <button className="action-button review-attraction">
                <FontAwesomeIcon icon={faPen} className="action-icon" />
                <span>Review</span>
              </button>
            </a>
            <button
              className={`action-button save-attraction ${
                saved ? "saved" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={saved ? solidHeart : regularHeart}
                className="action-icon"
              />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
        <div className="attraction-rating">
          <div className="rating-stars">
            {renderStars(attraction?.average_rating)}
            <span className="rating-value">
              {attraction?.average_rating !== null &&
              !isNaN(attraction?.average_rating)
                ? attraction.average_rating.toFixed(1)
                : "0.0"}
            </span>
          </div>
          <span className="rating-count">
            {attraction?.rating_total}{" "}
            {attraction?.rating_total === 1 ? "đánh giá" : "đánh giá"}
          </span>
        </div>
      </header>

      {/* Attraction images */}
      <div className="attraction-gallery">
        {attraction?.image_url && attraction.image_url.length > 0 ? (
          <>
            <div className="main-image-container">
              <img
                src={attraction.image_url[activeImageIndex]}
                alt={attraction.name}
                className="main-image"
              />
              {attraction.image_url.length > 1 && (
                <div className="gallery-controls">
                  <button
                    className="gallery-nav prev"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? attraction.image_url.length - 1 : prev - 1
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    className="gallery-nav next"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === attraction.image_url.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
            {attraction.image_url.length > 1 && (
              <div className="thumbnail-gallery">
                {attraction.image_url.map((img, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail ${
                      activeImageIndex === idx ? "active" : ""
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`${attraction.name} thumbnail ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="no-image">
            <FontAwesomeIcon icon={faImages} className="no-image-icon" />
            <p>No images available</p>
          </div>
        )}
      </div>

      {/* Attraction content */}
      <div className="attraction-content">
        <div className="attraction-info">
          <section className="info-section">
            <h2>
              <FontAwesomeIcon icon={faCircleInfo} className="section-icon" />
              Overview
            </h2>
            <div className="description">
              {attraction?.description ? (
                <p>{attraction.description}</p>
              ) : (
                <p className="no-content">No description available.</p>
              )}
            </div>
            {attraction?.tags && attraction.tags.length > 0 && (
              <div className="tags">
                {attraction.tags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Map section */}
          <section className="info-section">
            <h2>
              <FontAwesomeIcon icon={faLocationDot} className="section-icon" />
              Location
            </h2>
            <p className="location-address">{attraction?.address}</p>
            <div className="map-container">
              {mapError ? (
                <div className="map-error" role="alert">
                  {mapError}
                  <button
                    onClick={() => fetchAttraction()}
                    style={{
                      marginTop: "10px",
                      padding: "5px 10px",
                      background: "#2d7a61",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : mapCenter &&
                Array.isArray(mapCenter) &&
                mapCenter.length === 2 &&
                !isNaN(mapCenter[0]) &&
                !isNaN(mapCenter[1]) ? (
                <OpenStreetMap
                  center={mapCenter}
                  zoom={15}
                  markers={[
                    {
                      position: mapCenter,
                      popup: attraction?.name || "Địa điểm này",
                    },
                  ]}
                  height="400px"
                  width="100%"
                  showCurrentLocation
                />
              ) : (
                <div className="map-error" role="alert">
                  Loading map...
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar quick info */}
        <div className="attraction-sidebar">
          <div className="quick-info">
            <h3>Quick Info</h3>
            <ul>
              <li>
                <strong>Location:</strong> {city?.name}, Vietnam
              </li>
              <li>
                <strong>Rating:</strong>{" "}
                {attraction?.average_rating !== null &&
                !isNaN(attraction?.average_rating)
                  ? `${attraction.average_rating.toFixed(1)}/5`
                  : `0.0/5`}{" "}
                ({attraction?.rating_total} reviews)
              </li>
              {attraction?.tags && attraction.tags.length > 0 && (
                <li>
                  <strong>Type:</strong> {attraction.tags.join(", ")}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section id="review-section" className="reviews-section">
        <h2>Reviews</h2>
        <div className="reviews-container">
          <div className="review-stats">
            <div className="average-rating">
              <span className="big-rating">
                {attraction?.average_rating !== null &&
                !isNaN(attraction?.average_rating)
                  ? attraction.average_rating.toFixed(1)
                  : "0.0"}
              </span>
              <div className="rating-label">
                {renderStars(attraction?.average_rating)}
                <span>({attraction?.rating_total} reviews)</span>
              </div>
            </div>
            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map((score) => (
                <div key={score} className="rating-bar">
                  <span className="rating-label">
                    {score === 5
                      ? "Excellent"
                      : score === 4
                      ? "Very good"
                      : score === 3
                      ? "Average"
                      : score === 2
                      ? "Poor"
                      : "Very poor"}
                  </span>
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{ width: `${score * 15}%` }}
                    ></div>
                  </div>
                  <span className="count">{score * 10}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="review-content">
            <div className="write-review">
              <h3>Write a Review</h3>
              {isLoggedIn ? (
                <>
                  <div className="rating-input">
                    <label>Your Rating:</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <FontAwesomeIcon
                          key={value}
                          icon={value <= rating ? solidStar : regularStar}
                          className={`star-input ${
                            value <= rating ? "active" : ""
                          }`}
                          onClick={() => setRating(value)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="review-input">
                    <textarea
                      placeholder="Share your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="submit-review"
                      onClick={handleSubmitReview}
                    >
                      Submit Review
                    </button>
                  </div>
                </>
              ) : (
                <div className="login-prompt">
                  <p>Please log in to write a review.</p>
                  <button onClick={() => navigate("/login")}>Log in</button>
                </div>
              )}
            </div>

            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div className="review-card" key={index}>
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img
                          src={review.profilePic}
                          alt={review.userName}
                          className="reviewer-avatar"
                        />
                        <div>
                          <h4>{review.userName}</h4>
                          <span className="review-date">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="review-body">
                      <p>{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  <p>No reviews yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Attraction;
