import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useQueryClient } from "react-query";

// Error Message Component
const ErrorMessage = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="error-container">
      <h2>{error ? "Error" : "Not Found"}</h2>
      <p>{error || "Restaurant not found."}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

// Breadcrumb Component
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

// RestaurantHeader Component
const RestaurantHeader = React.memo(
  ({
    restaurant,
    isVerified,
    renderStars,
    city,
    resRank,
    handleShareClick,
    handleReviewClick,
    isFavorite,
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
              isFavorite ? "saved" : ""
            }`}
            onClick={() => handleToggleSave(restaurant.restaurant_id)}
            aria-label={isFavorite ? "Remove from saved" : "Save to favorites"}
          >
            <FontAwesomeIcon
              icon={isFavorite ? solidHeart : regularHeart}
              className="action-icon"
            />
            <span>{isFavorite ? "Saved" : "Save"}</span>
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
  isFavorite: PropTypes.bool.isRequired,
  handleToggleSave: PropTypes.func.isRequired,
};

// RestaurantGallery Component
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

// RestaurantContent Component
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
    isRetryingMap,
    setIsRetryingMap,
  }) => {
    const MapComponent = useCallback(() => {
      if (mapError) {
        return (
          <div className="map-error" role="alert">
            {isRetryingMap ? (
              <Loading message="Retrying map..." />
            ) : (
              <>
                {mapError}
                <button
                  onClick={async () => {
                    setIsRetryingMap(true);
                    try {
                      await fetchRestaurant();
                    } finally {
                      setIsRetryingMap(false);
                    }
                  }}
                  aria-label="Retry loading map"
                >
                  Retry
                </button>
              </>
            )}
          </div>
        );
      }
      if (!mapCenter || !Array.isArray(mapCenter) || mapCenter.length !== 2) {
        return (
          <div className="map-error" role="alert">
            <Loading message="Loading map..." />
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
    }, [
      mapCenter,
      mapError,
      fetchRestaurant,
      restaurant.name,
      isRetryingMap,
      setIsRetryingMap,
    ]);

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
  isRetryingMap: PropTypes.bool.isRequired,
  setIsRetryingMap: PropTypes.func.isRequired,
};

// ReviewsSection Component
const ReviewsSection = React.memo(
  ({
    reviews,
    restaurant,
    renderStars,
    formatDate,
    reviewSort,
    handleSortChange,
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
  error: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

// NearbySection Component
const NearbySection = React.memo(
  ({
    nearbyRestaurants,
    navigate,
    city,
    renderStars,
    handleToggleSave,
    favorites,
    onNavigate,
  }) => {
    const getValidImageUrl = (imageUrl) => {
      if (Array.isArray(imageUrl) && imageUrl.length > 0) {
        return imageUrl[0];
      }
      if (typeof imageUrl === "string" && imageUrl.trim()) {
        return imageUrl;
      }
      return "https://via.placeholder.com/280x200?text=Image+Not+Found";
    };

    return (
      <section className="nearby-section">
        <h2>Featured Nearby</h2>
        {nearbyRestaurants.length > 0 ? (
          <div className="nearby-grid">
            {nearbyRestaurants.slice(0, 4).map((place) => {
              const isPlaceFavorite = favorites?.some(
                (fav) =>
                  String(fav.restaurant_id) === String(place.restaurant_id)
              );
              return (
                <LocationCard
                  key={place.restaurant_id}
                  item={{
                    id: place.restaurant_id,
                    name: place.name,
                    image: getValidImageUrl(place.image_url),
                    rating: parseFloat(place.average_rating) || 0,
                    reviewCount: place.rating_total || 0,
                    tags: place.tags || [],
                    type: "restaurant",
                  }}
                  onClick={() => onNavigate(place.restaurant_id)}
                  renderStars={renderStars}
                  isSaved={isPlaceFavorite}
                  onToggleSave={() => handleToggleSave(place.restaurant_id)}
                />
              );
            })}
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
  handleToggleSave: PropTypes.func.isRequired,
  favorites: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

// Main Restaurant Component
const Restaurant = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    restaurant,
    city,
    resRank,
    nearbyRestaurants,
    reviews,
    loading,
    error,
    activeImageIndex,
    isFullScreen,
    mapCenter,
    mapError,
    showHours,
    reviewSort,
    isLoggedIn,
    setActiveImageIndex,
    setIsFullScreen,
    setShowHours,
    handleSortChange,
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
  const [isLoadingVisible, setIsLoadingVisible] = useState(false);
  const [isRetryingMap, setIsRetryingMap] = useState(false);

  const isFavorite = savedRestaurants.some(
    (fav) => String(fav.restaurant_id) === String(restaurant?.restaurant_id)
  );

  const saveRecentlyViewed = useCallback(async () => {
    if (!restaurant || !restaurant.restaurant_id || !restaurant.name) {
      console.warn("Invalid restaurant data, skipping saveRecentlyViewed");
      return;
    }

    const item = {
      id: restaurant.restaurant_id,
      name: restaurant.name,
      image:
        Array.isArray(restaurant.image_url) && restaurant.image_url.length > 0
          ? restaurant.image_url[0]
          : restaurant.image_url || "https://via.placeholder.com/150",
      rating: parseFloat(restaurant.average_rating) || 0,
      reviewCount: restaurant.rating_total || 0,
      tags: Array.isArray(restaurant.tags) ? restaurant.tags : [],
      type: "restaurant",
    };

    try {
      if (isLoggedIn && user?.user_id) {
        await axios.post(`${BASE_URL}/recently-viewed`, {
          user_id: user.user_id,
          item,
        });
        console.log(`Successfully saved restaurant ${item.id} to API`);
      } else {
        let recentItems = JSON.parse(
          localStorage.getItem("recentlyViewedItems") || "[]"
        );
        recentItems = recentItems.filter(
          (i) => i.id !== item.id || i.type !== item.type
        );
        recentItems.unshift(item);
        recentItems = recentItems.slice(0, 4);
        localStorage.setItem(
          "recentlyViewedItems",
          JSON.stringify(recentItems)
        );
        console.log(`Successfully saved restaurant ${item.id} to localStorage`);
      }
    } catch (err) {
      console.error(
        `Failed to save recently viewed restaurant ${item.id}:`,
        err
      );
    }
  }, [restaurant, isLoggedIn, user]);

  useEffect(() => {
    saveRecentlyViewed();
  }, [saveRecentlyViewed]);

  useEffect(() => {
    let timeout;
    if (loading) {
      setIsLoadingVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsLoadingVisible(false);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

  const handleNavigate = useCallback(
    (restaurantId) => {
      setIsLoadingVisible(true);
      queryClient.invalidateQueries(["restaurant", restaurantId]);
      navigate(`/tripguide/restaurant/${restaurantId}`);
    },
    [navigate, queryClient]
  );

  if (isLoadingVisible) {
    return <Loading message="Loading restaurant details..." />;
  }

  if (error || !restaurant) {
    return <ErrorMessage error={error} />;
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
            isFavorite ? "saved" : ""
          }`}
          onClick={() => handleToggleSave(restaurant.restaurant_id)}
          aria-label={isFavorite ? "Remove from saved" : "Save to favorites"}
        >
          <FontAwesomeIcon
            icon={isFavorite ? solidHeart : regularHeart}
            className="action-icon"
          />
          <span>{isFavorite ? "Saved" : "Save"}</span>
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
        isFavorite={isFavorite}
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
        isRetryingMap={isRetryingMap}
        setIsRetryingMap={setIsRetryingMap}
      />
      <ReviewsSection
        reviews={reviews}
        restaurant={restaurant}
        renderStars={renderStars}
        formatDate={formatDate}
        reviewSort={reviewSort}
        handleSortChange={handleSortChange}
        error={error}
        isLoggedIn={isLoggedIn}
        navigate={navigate}
      />
      <NearbySection
        nearbyRestaurants={nearbyRestaurants}
        navigate={navigate}
        city={city}
        renderStars={renderStars}
        handleToggleSave={handleToggleSave}
        favorites={savedRestaurants}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default Restaurant;
