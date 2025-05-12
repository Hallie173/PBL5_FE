import React, { Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Restaurant.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareShareNodes,
  faPen,
  faHeart as solidHeart,
  faCircleInfo,
  faLocationDot,
  faExpand,
  faImages,
  faStar as solidStar,
  faStarHalfStroke,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as regularStar,
  faHeart as regularHeart,
} from "@fortawesome/free-regular-svg-icons";
import OpenStreetMap from "../../components/OpenStreetMap/OpenStreetMap";
import Loading from "../../components/Loading/Loading";
import useRestaurant from "./hooks/useRestaurant";
import PropTypes from "prop-types";
import LocationCard from "../../components/LocationCard/LocationCard";
import axios from "axios";
import BASE_URL from "../../constants/BASE_URL";
import { useAuth } from "../../contexts/AuthContext";

// Breadcrumb Component (không thay đổi)
const Breadcrumb = React.memo(({ city, restaurant, navigate }) => (
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
          {city?.name || "City"}
        </button>
      </li>
      <li className="breadcrumb-separator" aria-hidden="true">
        <FontAwesomeIcon icon={faChevronRight} />
      </li>
      <li className="breadcrumb-item">
        <button
          onClick={() =>
            navigate(`/tripguide/city/${city?.city_id}/restaurants`)
          }
          aria-label={`Go to restaurants in ${city?.name}`}
        >
          Restaurants in {city?.name || "City"}
        </button>
      </li>
      <li className="breadcrumb-separator" aria-hidden="true">
        <FontAwesomeIcon icon={faChevronRight} />
      </li>
      <li className="breadcrumb-item current" aria-current="page">
        {restaurant.name}
      </li>
    </ol>
  </nav>
));

Breadcrumb.propTypes = {
  city: PropTypes.shape({
    city_id: PropTypes.number,
    name: PropTypes.string,
  }),
  restaurant: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};

// RestaurantHeader Component (không thay đổi)
const RestaurantHeader = React.memo(
  ({
    restaurant,
    isVerified,
    renderStars,
    city,
    resRank,
    handleShareClick,
    handleReviewClick,
    savedRestaurants,
    handleToggleSave,
  }) => (
    <header className="restaurant-header">
      <div className="name-and-action">
        <div className="name-container">
          <h1>
            {restaurant.name}
            {isVerified && <span className="verified-badge">Verified</span>}
          </h1>
        </div>
        <div className="restaurant-action">
          <button
            className="action-button share-restaurant"
            onClick={handleShareClick}
          >
            <FontAwesomeIcon
              icon={faSquareShareNodes}
              className="action-icon"
            />
            <span>Share</span>
          </button>
          <button
            className="action-button review-restaurant"
            onClick={handleReviewClick}
            aria-label="Write a review"
          >
            <FontAwesomeIcon icon={faPen} className="action-icon" />
            <span>Review</span>
          </button>
          <button
            className={`action-button save-restaurant ${
              savedRestaurants[restaurant.restaurant_id] ? "saved" : ""
            }`}
            onClick={() => handleToggleSave(restaurant.restaurant_id)}
            aria-label={
              savedRestaurants[restaurant.restaurant_id]
                ? "Remove from saved"
                : "Save to favorites"
            }
          >
            <FontAwesomeIcon
              icon={
                savedRestaurants[restaurant.restaurant_id]
                  ? solidHeart
                  : regularHeart
              }
              className="action-icon"
            />
            <span>Save</span>
          </button>
        </div>
      </div>
      <div className="restaurant-rating">
        <div className="rating-stars">
          {renderStars(restaurant.average_rating)}
          <span className="rating-value">
            {restaurant.average_rating?.toFixed(1) || "0.0"}
          </span>
        </div>
        <span className="rating-count">
          {restaurant.rating_total}{" "}
          {restaurant.rating_total === 1 ? "review" : "reviews"}
        </span>
        {resRank && (
          <span className="rating-rank">
            #{resRank.rank} among restaurants in {city?.name || "City"}
          </span>
        )}
      </div>
    </header>
  )
);

RestaurantHeader.propTypes = {
  restaurant: PropTypes.object.isRequired,
  isVerified: PropTypes.bool,
  renderStars: PropTypes.func.isRequired,
  city: PropTypes.object,
  resRank: PropTypes.object,
  handleShareClick: PropTypes.func.isRequired,
  handleReviewClick: PropTypes.func.isRequired,
  savedRestaurants: PropTypes.object.isRequired,
  handleToggleSave: PropTypes.func.isRequired,
};

// RestaurantGallery Component (không thay đổi)
const RestaurantGallery = React.memo(
  ({
    images,
    activeImageIndex,
    setActiveImageIndex,
    isFullScreen,
    setIsFullScreen,
    restaurantName,
  }) => {
    const handlePrevImage = useCallback(() => {
      setActiveImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }, [images.length, setActiveImageIndex]);

    const handleNextImage = useCallback(() => {
      setActiveImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, [images.length, setActiveImageIndex]);

    useEffect(() => {
      if (images && images.length > 0) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = images[0];
        document.head.appendChild(link);
        return () => {
          document.head.removeChild(link);
        };
      }
    }, [images]);

    return (
      <div className="restaurant-gallery">
        {images && images.length > 0 ? (
          <>
            <div
              className="main-image-container"
              onClick={() => setIsFullScreen(true)}
            >
              <img
                src={images[activeImageIndex]}
                alt={`${restaurantName} - Image ${activeImageIndex + 1}`}
                className="main-image"
                onError={(e) => (e.target.src = "/assets/fallback-image.jpg")}
                srcSet={`${images[activeImageIndex]} 1x`}
                sizes="100vw"
              />
              <div className="image-counter">
                {activeImageIndex + 1} / {images.length}
              </div>
              <button
                className="fullscreen-button"
                aria-label="View image in fullscreen"
              >
                <FontAwesomeIcon icon={faExpand} />
              </button>
              <div className="gallery-controls">
                <button
                  className="gallery-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="gallery-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
            </div>
            {isFullScreen && (
              <div
                className="fullscreen-gallery"
                onClick={() => setIsFullScreen(false)}
              >
                <img
                  src={images[activeImageIndex]}
                  alt={`${restaurantName} - Fullscreen Image ${
                    activeImageIndex + 1
                  }`}
                  className="fullscreen-image"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsFullScreen(false);
                    if (e.key === "ArrowLeft") handlePrevImage();
                    if (e.key === "ArrowRight") handleNextImage();
                  }}
                />
                <button
                  className="close-fullscreen"
                  aria-label="Close fullscreen"
                >
                  ×
                </button>
                <div className="fullscreen-controls">
                  <button
                    className="gallery-nav prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className="gallery-nav next"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
            {images.length > 1 && (
              <div className="thumbnail-gallery">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail ${
                      activeImageIndex === idx ? "active" : ""
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setActiveImageIndex(idx);
                    }}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${restaurantName} thumbnail ${idx + 1}`}
                      loading="lazy"
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
    );
  }
);

RestaurantGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  activeImageIndex: PropTypes.number.isRequired,
  setActiveImageIndex: PropTypes.func.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  setIsFullScreen: PropTypes.func.isRequired,
  restaurantName: PropTypes.string.isRequired,
};

// RestaurantContent Component (không thay đổi)
const RestaurantContent = React.memo(
  ({
    restaurant,
    city,
    hoursInfo,
    showHours,
    setShowHours,
    mapCenter,
    mapError,
    fetchRestaurant,
  }) => {
    const MapComponent = useCallback(() => {
      if (mapError) {
        return (
          <div className="map-error" role="alert">
            {mapError}
            <button onClick={fetchRestaurant} aria-label="Retry loading map">
              Retry
            </button>
          </div>
        );
      }
      if (!mapCenter || !Array.isArray(mapCenter) || mapCenter.length !== 2) {
        return (
          <div className="map-error" role="alert">
            Loading map...
          </div>
        );
      }
      return (
        <OpenStreetMap
          center={mapCenter}
          zoom={15}
          markers={[{ position: mapCenter, popup: restaurant.name }]}
          height="400px"
          width="100%"
          showCurrentLocation
        />
      );
    }, [mapCenter, mapError, fetchRestaurant, restaurant.name]);

    return (
      <div className="restaurant-content">
        <div className="restaurant-info">
          <section className="info-section">
            <h2>
              <FontAwesomeIcon icon={faCircleInfo} className="section-icon" />
              About
            </h2>
            <div className="info-card">
              <div className="description">
                {restaurant.description ? (
                  <p>{restaurant.description}</p>
                ) : (
                  <p className="no-content">No description available.</p>
                )}
              </div>
              {restaurant.tags?.length > 0 && (
                <div className="tags">
                  {restaurant.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="contact-details">
                {restaurant.email && (
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${restaurant.email}`}>
                      {restaurant.email}
                    </a>
                  </p>
                )}
                {restaurant.website && (
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {restaurant.website}
                    </a>
                  </p>
                )}
                {restaurant.phone_number && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${restaurant.phone_number}`}>
                      {restaurant.phone_number}
                    </a>
                  </p>
                )}
                <p>
                  <strong>Reservation:</strong>{" "}
                  {restaurant.reservation_required
                    ? "Required"
                    : "Not required"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {restaurant.status === "open" ? "Open" : "Closed"}
                </p>
              </div>
            </div>
          </section>
          <section className="info-section">
            <h2>
              <FontAwesomeIcon icon={faLocationDot} className="section-icon" />
              Location
            </h2>
            <p className="location-address">
              {restaurant.address || "Address not available"}
            </p>
            <div className="map-container">
              <MapComponent />
            </div>
          </section>
          <section className="info-section">
            <h2
              className="collapsible-header"
              onClick={() => setShowHours(!showHours)}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setShowHours(!showHours);
              }}
              tabIndex={0}
              role="button"
              aria-expanded={showHours}
              aria-controls="hours-content"
            >
              Opening Hours {showHours ? "▲" : "▼"}
            </h2>
            <div
              id="hours-content"
              className={`hours-content ${showHours ? "open" : ""}`}
            >
              <p className="open-status">{hoursInfo.status}</p>
              <table className="hours-table">
                <tbody>
                  {hoursInfo.formatted.map(({ day, hours }, idx) => (
                    <tr
                      key={idx}
                      className={idx === new Date().getDay() ? "today" : ""}
                    >
                      <td>{day}</td>
                      <td>{hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <div className="restaurant-sidebar">
          <div className="quick-info">
            <h3>Quick Info</h3>
            <ul>
              <li>
                <strong>Location:</strong> {city?.name || "Unknown"}, Vietnam
              </li>
              <li>
                <strong>Rating:</strong>{" "}
                {restaurant.average_rating?.toFixed(1) || "0.0"}/5 (
                {restaurant.rating_total} reviews)
              </li>
              {restaurant.tags?.length > 0 && (
                <li>
                  <strong>Cuisine:</strong> {restaurant.tags.join(", ")}
                </li>
              )}
              <li>
                <strong>Reservation:</strong>{" "}
                {restaurant.reservation_required ? "Required" : "Not required"}
              </li>
              <li>
                <strong>Status:</strong>{" "}
                {restaurant.status === "open" ? "Open" : "Closed"}
              </li>
            </ul>
            {restaurant.reservation_required && (
              <button
                className="book-now-button"
                onClick={() =>
                  window.open(
                    restaurant.website || `mailto:${restaurant.email}`,
                    "_blank"
                  )
                }
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

RestaurantContent.propTypes = {
  restaurant: PropTypes.object.isRequired,
  city: PropTypes.object,
  hoursInfo: PropTypes.object.isRequired,
  showHours: PropTypes.bool.isRequired,
  setShowHours: PropTypes.func.isRequired,
  mapCenter: PropTypes.array,
  mapError: PropTypes.string,
  fetchRestaurant: PropTypes.func.isRequired,
};

// ReviewsSection Component (không thay đổi)
const ReviewsSection = React.memo(
  ({
    reviews,
    restaurant,
    renderStars,
    formatDate,
    reviewSort,
    handleSortChange,
    handleSubmitReview,
    comment,
    setComment,
    rating,
    setRating,
    submitting,
    error,
    isLoggedIn,
    navigate,
  }) => (
    <section id="review-section" className="reviews-section">
      <h2>Reviews</h2>
      <div className="reviews-container">
        <div className="review-stats">
          <div className="average-rating">
            <span className="big-rating">
              {restaurant.average_rating?.toFixed(1) || "0.0"}
            </span>
            <div className="rating-label">
              {renderStars(restaurant.average_rating)}
              <span>({restaurant.rating_total} reviews)</span>
            </div>
          </div>
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((score) => (
              <div key={score} className="rating-bar">
                <span className="rating-label">
                  {score === 5
                    ? "Excellent"
                    : score === 4
                    ? "Very Good"
                    : score === 3
                    ? "Average"
                    : score === 2
                    ? "Poor"
                    : "Very Poor"}
                </span>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      width: `${
                        reviews.filter((r) => Math.floor(r.rating) === score)
                          .length * 10
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="count">
                  {reviews.filter((r) => Math.floor(r.rating) === score).length}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="review-content">
          <div className="reviews-list">
            <div className="review-controls">
              <label htmlFor="sort-reviews">Sort by:</label>
              <select
                id="sort-reviews"
                value={reviewSort}
                onChange={handleSortChange}
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  className={`review-card ${
                    review.isCurrentUser ? "current-user" : ""
                  }`}
                  key={index}
                >
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img
                        src={review.profilePic}
                        alt={`Avatar of ${review.userName}`}
                        className="reviewer-avatar"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/40")
                        }
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
  )
);

ReviewsSection.propTypes = {
  reviews: PropTypes.array.isRequired,
  restaurant: PropTypes.object.isRequired,
  renderStars: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  reviewSort: PropTypes.string.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  handleSubmitReview: PropTypes.func.isRequired,
  comment: PropTypes.string.isRequired,
  setComment: PropTypes.func.isRequired,
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

// NearbySection Component (không thay đổi)
const NearbySection = React.memo(
  ({ nearbyRestaurants, navigate, city, renderStars }) => {
    const [savedRestaurants, setSavedRestaurants] = useState({});

    const handleToggleSave = useCallback((restaurantId) => {
      setSavedRestaurants((prev) => ({
        ...prev,
        [restaurantId]: !prev[restaurantId],
      }));
      axios
        .post(`${BASE_URL}/favorites`, { restaurant_id: restaurantId })
        .catch((err) => console.error("Failed to save restaurant:", err));
    }, []);

    return (
      <section className="nearby-section">
        <h2>Featured Nearby</h2>
        {nearbyRestaurants.length > 0 ? (
          <div className="nearby-grid">
            {nearbyRestaurants.slice(0, 4).map((place) => (
              <LocationCard
                key={place.restaurant_id}
                item={{
                  id: place.restaurant_id,
                  name: place.name,
                  image:
                    place.image_url[0] || "https://via.placeholder.com/150",
                  rating: place.average_rating,
                  reviewCount: place.rating_total,
                  tags:
                    place.tags.length > 0
                      ? place.tags.join(", ")
                      : "No cuisines available",
                }}
                isSaved={!!savedRestaurants[place.restaurant_id]}
                onToggleSave={() => handleToggleSave(place.restaurant_id)}
                onClick={() =>
                  navigate(`/tripguide/restaurant/${place.restaurant_id}`)
                }
                renderStars={renderStars}
              />
            ))}
          </div>
        ) : (
          <div className="no-nearby">
            <p>No nearby restaurants found.</p>
          </div>
        )}
        {nearbyRestaurants.length > 4 && (
          <button
            className="view-more-button"
            onClick={() =>
              navigate(`/tripguide/city/${city?.city_id}/restaurants`)
            }
          >
            View more nearby restaurants
          </button>
        )}
      </section>
    );
  }
);

NearbySection.propTypes = {
  nearbyRestaurants: PropTypes.array.isRequired,
  navigate: PropTypes.func.isRequired,
  city: PropTypes.object,
  renderStars: PropTypes.func.isRequired,
};

// Main Restaurant Component
const Restaurant = () => {
  const navigate = useNavigate();
  const {
    restaurant,
    city,
    resRank,
    nearbyRestaurants,
    reviews,
    isLoadingVisible, // Sử dụng isLoadingVisible thay vì loading
    submitting,
    error,
    comment,
    rating,
    activeImageIndex,
    isFullScreen,
    mapCenter,
    mapError,
    showHours,
    reviewSort,
    isLoggedIn,
    setComment,
    setRating,
    setActiveImageIndex,
    setIsFullScreen,
    setShowHours,
    handleSortChange,
    handleSubmitReview,
    handleShareClick,
    handleReviewClick,
    fetchRestaurant,
    renderStars,
    formatDate,
    hoursInfo,
    savedRestaurants,
    handleToggleSave,
  } = useRestaurant();
  const { user } = useAuth();
  // Hàm lưu recently viewed
  const saveRecentlyViewed = useCallback(async () => {
    if (!restaurant) return;

    const item = {
      id: restaurant.restaurant_id,
      restaurant_id: restaurant.restaurant_id,
      name: restaurant.name,
      image: restaurant.image_url?.[0] || "https://via.placeholder.com/150",
      rating: restaurant.average_rating || 0,
      reviewCount: restaurant.rating_total || 0,
      tags: restaurant.tags || [],
      type: "restaurant",
    };

    try {
      if (isLoggedIn && user?.user_id) {
        // Gửi yêu cầu API để lưu recently viewed
        await axios.post(`${BASE_URL}/recently-viewed`, {
          user_id: user.user_id,
          item,
        });
      } else {
        // Lưu vào localStorage cho người dùng chưa đăng nhập
        let recentItems = JSON.parse(
          localStorage.getItem("recentlyViewedItems") || "[]"
        );

        // Xóa mục trùng lặp (dựa trên id)
        recentItems = recentItems.filter((i) => i.id !== item.id);
        // Thêm mục mới vào đầu danh sách
        recentItems.unshift(item);
        // Giới hạn tối đa 4 mục
        recentItems = recentItems.slice(0, 4);
        // Lưu lại vào localStorage
        localStorage.setItem(
          "recentlyViewedItems",
          JSON.stringify(recentItems)
        );
      }
    } catch (err) {
      console.error("Failed to save recently viewed:", err);
    }
  }, [restaurant, isLoggedIn, user]);

  // Gọi hàm saveRecentlyViewed khi component mount
  useEffect(() => {
    saveRecentlyViewed();
  }, [saveRecentlyViewed]);

  if (isLoadingVisible) {
    return <Loading message="Loading restaurant details..." />;
  }

  if (error || !restaurant) {
    return (
      <div className="error-container">
        <h2>{error ? "An error occurred" : "Restaurant not found"}</h2>
        <p>{error || "The requested restaurant could not be found."}</p>
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="restaurant-container">
      <div className="sticky-action-bar">
        <button
          className="action-button share-restaurant"
          onClick={handleShareClick}
        >
          <FontAwesomeIcon icon={faSquareShareNodes} className="action-icon" />
          <span>Share</span>
        </button>
        <button
          className="action-button review-restaurant"
          onClick={handleReviewClick}
          aria-label="Write a review for this restaurant"
        >
          <FontAwesomeIcon icon={faPen} className="action-icon" />
          <span>Review</span>
        </button>
        <button
          className={`action-button save-restaurant ${
            savedRestaurants[restaurant.restaurant_id] ? "saved" : ""
          }`}
          onClick={() => handleToggleSave(restaurant.restaurant_id)}
          aria-label={
            savedRestaurants[restaurant.restaurant_id]
              ? "Remove from saved"
              : "Save to favorites"
          }
        >
          <FontAwesomeIcon
            icon={
              savedRestaurants[restaurant.restaurant_id]
                ? solidHeart
                : regularHeart
            }
            className="action-icon"
          />
          <span>Save</span>
        </button>
      </div>

      <Breadcrumb city={city} restaurant={restaurant} navigate={navigate} />
      <RestaurantHeader
        restaurant={restaurant}
        renderStars={renderStars}
        city={city}
        resRank={resRank}
        handleShareClick={handleShareClick}
        handleReviewClick={handleReviewClick}
        savedRestaurants={savedRestaurants}
        handleToggleSave={handleToggleSave}
      />
      <RestaurantGallery
        images={restaurant.image_url}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        restaurantName={restaurant.name}
      />
      <RestaurantContent
        restaurant={restaurant}
        city={city}
        hoursInfo={hoursInfo}
        showHours={showHours}
        setShowHours={setShowHours}
        mapCenter={mapCenter}
        mapError={mapError}
        fetchRestaurant={fetchRestaurant}
      />
      <Suspense fallback={<Loading />}>
        <ReviewsSection
          reviews={reviews}
          restaurant={restaurant}
          renderStars={renderStars}
          formatDate={formatDate}
          reviewSort={reviewSort}
          handleSortChange={handleSortChange}
          handleSubmitReview={handleSubmitReview}
          comment={comment}
          setComment={setComment}
          rating={rating}
          setRating={setRating}
          submitting={submitting}
          error={error}
          isLoggedIn={isLoggedIn}
          navigate={navigate}
        />
        <NearbySection
          nearbyRestaurants={nearbyRestaurants}
          navigate={navigate}
          city={city}
          renderStars={renderStars}
        />
      </Suspense>
    </div>
  );
};

export default Restaurant;
