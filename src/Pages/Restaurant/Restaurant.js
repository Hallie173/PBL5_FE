import React, { useCallback, useState, useEffect, useRef, memo } from "react";
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
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import OpenStreetMap from "../../components/OpenStreetMap/OpenStreetMap";
import Loading from "../../components/Loading/Loading";
import useRestaurant from "./hooks/useRestaurant";
import LocationCard from "../../components/LocationCard/LocationCard";
import axios from "axios";
import BASE_URL from "../../constants/BASE_URL";
import { useAuth } from "../../contexts/AuthContext";
import debounce from "lodash/debounce";
import { faTrash } from "@fortawesome/free-solid-svg-icons"; // Thêm dòng này vào đầu file

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

// Memoized Breadcrumb Component
const Breadcrumb = memo(({ city, restaurant, navigate }) => (
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

// Memoized RestaurantHeader Component
const RestaurantHeader = memo(
  ({
    restaurant,
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
          <h1>{restaurant.name}</h1>
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

const RestaurantGallery = React.memo(
  ({ images, activeImageIndex, setActiveImageIndex, restaurantName }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

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
      if (images.length > 1) {
        const timer = setTimeout(() => {
          handleNextImage();
        }, 4000);
        return () => clearTimeout(timer);
      }
    }, [activeImageIndex, handleNextImage, images.length]);

    if (!images || images.length === 0) {
      return (
        <div className="restaurant-gallery no-images">
          <FontAwesomeIcon icon={faImages} className="no-image-icon" />
          <p>No images available</p>
        </div>
      );
    }

    return (
      <div className="restaurant-gallery" aria-label="Image gallery">
        <div
          className="main-image-container"
          role="button"
          tabIndex={0}
          aria-label="View images"
        >
          <img
            src={images[activeImageIndex]}
            alt={`${restaurantName || "Restaurant"} - Image ${
              activeImageIndex + 1
            }`}
            className="main-image"
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            style={{
              opacity: isImageLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          />
          {images.length > 1 && (
            <>
              <div className="image-counter">
                {activeImageIndex + 1}/{images.length}
              </div>
              <div className="gallery-controls">
                <button
                  className="gallery-nav prev"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="gallery-nav next"
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.images === nextProps.images &&
    prevProps.activeImageIndex === nextProps.activeImageIndex
);

// Memoized RestaurantContent Component
const RestaurantContent = memo(
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
          key={`map-${mapCenter[0]}-${mapCenter[1]}`}
          center={mapCenter}
          zoom={15}
          markers={[{ position: mapCenter, title: restaurant.name }]}
          height="400px"
          width="100%"
          showCurrentLocation={true}
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
// Memoized ReviewsSection Component
const ReviewsSection = memo(
  ({
    reviews,
    restaurant,
    renderStars,
    formatDate,
    reviewSort,
    handleSortChange,
    isLoggedIn,
    navigate,
    onEditReview,
    onDeleteReview, // Thêm prop này
  }) => {
    const [displayCount, setDisplayCount] = useState(5);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const modalRef = useRef(null);

    // Handle modal open/close
    const openModal = (photo) => {
      setSelectedImage(photo);
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      setSelectedImage(null);
      document.body.style.overflow = "";
    };

    // Close modal on Escape key
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape" && selectedImage) {
          closeModal();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImage]);

    // Focus trap for modal
    useEffect(() => {
      if (selectedImage && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e) => {
          if (e.key === "Tab") {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        };

        modalRef.current.focus();
        modalRef.current.addEventListener("keydown", handleTab);
        return () =>
          modalRef.current?.removeEventListener("keydown", handleTab);
      }
    }, [selectedImage]);

    // Handle load more reviews
    const handleLoadMore = () => {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayCount(displayCount + 5);
        setIsLoadingMore(false);
      }, 500); // Simulate async loading
    };

    // Handle edit review
    const handleEdit = (review) => {
      if (onEditReview) {
        onEditReview(review);
      }
    };

    // Handle delete review
    const handleDelete = (review) => {
      if (window.confirm("Are you sure you want to delete this review?")) {
        if (onDeleteReview) {
          onDeleteReview(review);
        }
      }
    };

    return (
      <section id="review-section" className="reviews-section">
        <div className="reviews-container">
          <div className="review-stats">
            <div className="average-rating">
              <span className="big-rating">
                {restaurant.average_rating?.toFixed(1) || "0.0"}
              </span>
              <div className="rating-label">
                {renderStars(restaurant.average_rating)}
                <span>({restaurant.rating_total || 0} reviews)</span>
              </div>
            </div>
            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map((score) => (
                <div
                  key={score}
                  className="rating-bar"
                  aria-label={`Rating ${score} stars`}
                >
                  <span className="rating-label">
                    {score === 5
                      ? "Excellent"
                      : score === 4
                      ? "Very Good"
                      : score === 3
                      ? "Average"
                      : score === 2
                      ? "Poor"
                      : "Terrible"}
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
                    />
                  </div>
                  <span className="count">
                    {
                      reviews.filter((r) => Math.floor(r.rating) === score)
                        .length
                    }
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
                  aria-label="Sort reviews"
                >
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                  <option value="mine">Mine</option> {/* Thêm dòng này */}
                </select>
              </div>
              {reviews.length > 0 ? (
                <>
                  {(reviewSort === "mine"
                    ? reviews.filter((review) => review.isCurrentUser)
                    : reviews
                  )
                    .slice(0, displayCount)
                    .map((review, index) => (
                      <div
                        className={`review-card ${
                          review.isCurrentUser ? "current-user" : ""
                        } fade-in`}
                        key={review.review_id || index}
                        aria-labelledby={`review-title-${index}`}
                        style={{ position: "relative" }} // Thêm style này nếu chưa có
                      >
                        {review.isCurrentUser && (
                          <button
                            className="delete-review-icon-button"
                            onClick={() => handleDelete(review)}
                            aria-label="Delete your review"
                            title="Delete"
                            style={{
                              position: "absolute",
                              top: "18px",
                              right: "18px",
                              zIndex: 2,
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                        <div className="review-header">
                          <div className="reviewer-info">
                            <img
                              src={review.profilePic}
                              alt={`Avatar of ${
                                review.userName || "Anonymous"
                              }`}
                              className="reviewer-avatar"
                            />
                            <div className="reviewer-details">
                              <h4
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                {review.userName}
                                <span className="review-rating-inline">
                                  {typeof review.rating === "number" &&
                                  review.rating >= 0 &&
                                  review.rating <= 5 ? (
                                    renderStars(review.rating)
                                  ) : (
                                    <span>Invalid rating</span>
                                  )}
                                </span>
                              </h4>
                              <span className="review-date">
                                {formatDate(review.created_at || new Date())}
                              </span>
                            </div>
                          </div>
                          {/* Xóa phần review-rating ở đây */}
                        </div>
                        <div className="review-body">
                          <h5
                            id={`review-title-${index}`}
                            className="review-title"
                          >
                            {review.title || "Untitled Review"}
                          </h5>
                          <p>{review.comment || "No comment provided."}</p>
                          {review.photos && review.photos.length > 0 && (
                            <div className="review-photos">
                              {review.photos.map((photo, idx) => (
                                <div
                                  key={idx}
                                  className="review-photo"
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => openModal(photo)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      openModal(photo);
                                    }
                                  }}
                                  aria-label={`View review photo ${
                                    idx + 1
                                  } in full size`}
                                >
                                  <img
                                    src={photo}
                                    alt={`Review photo ${idx + 1}`}
                                    loading="lazy"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {reviews.length > displayCount && (
                    <button
                      className="load-more-button"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      aria-label="Load more reviews"
                    >
                      {isLoadingMore ? "Loading..." : "Load More Reviews"}
                    </button>
                  )}
                </>
              ) : (
                <div className="no-reviews">
                  <p>No reviews yet. Be the first to share your experience!</p>
                  {!isLoggedIn && (
                    <button
                      className="login-to-review"
                      onClick={() => navigate("/")}
                      aria-label="Log in to write a review"
                    >
                      Log In to Write a Review
                    </button>
                  )}
                </div>
              )}
            </div>
            {selectedImage && (
              <div
                className="image-modal-overlay"
                onClick={closeModal}
                role="dialog"
                aria-modal="true"
                aria-label="Full-size image viewer"
                ref={modalRef}
                tabIndex={-1}
              >
                <div
                  className="image-modal"
                  onClick={(e) => e.stopPropagation()}
                  role="document"
                >
                  <button
                    className="modal-close-button"
                    onClick={closeModal}
                    aria-label="Close image modal"
                    tabIndex={0}
                  >
                    ×
                  </button>
                  <img
                    src={selectedImage}
                    alt="Full-size review photo"
                    className="modal-image"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);

// Memoized NearbySection Component
const NearbySection = memo(
  ({
    nearbyRestaurants,
    navigate,
    city,
    renderStars,
    handleToggleSave,
    favorites,
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
                  onClick={() =>
                    navigate(`/tripguide/restaurant/${place.restaurant_id}`)
                  }
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
      </section>
    );
  }
);

// Main Restaurant Component
const Restaurant = () => {
  const navigate = useNavigate();
  const {
    restaurant,
    city,
    resRank,
    nearbyRestaurants,
    reviews,
    loading,
    error,
    activeImageIndex,
    // Removed isFullScreen from destructuring since no longer used
    mapCenter,
    mapError,
    showHours,
    reviewSort,
    isLoggedIn,
    setActiveImageIndex,
    // Removed setIsFullScreen from destructuring since no longer used
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
    handleDeleteReview, // <-- destructure từ hook
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
      }
    } catch (err) {
      console.error(
        `Failed to save recently viewed restaurant ${item.id}:`,
        err
      );
    }
  }, [restaurant, isLoggedIn, user]);

  const debouncedSaveRecentlyViewed = useCallback(
    debounce(saveRecentlyViewed, 1000),
    [saveRecentlyViewed]
  );

  useEffect(() => {
    debouncedSaveRecentlyViewed();
  }, [restaurant, isLoggedIn, user, debouncedSaveRecentlyViewed]);

  // Khôi phục logic trì hoãn cho hiệu ứng loading
  useEffect(() => {
    let timeout;
    if (loading) {
      setIsLoadingVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsLoadingVisible(false);
      }, 500); // Trì hoãn 500ms để giữ hiệu ứng
    }
    return () => clearTimeout(timeout);
  }, [loading]);

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
        isLoggedIn={isLoggedIn}
        navigate={navigate}
        onDeleteReview={handleDeleteReview} // <-- truyền vào đây
      />
      <NearbySection
        nearbyRestaurants={nearbyRestaurants}
        navigate={navigate}
        city={city}
        renderStars={renderStars}
        handleToggleSave={handleToggleSave}
        favorites={savedRestaurants}
      />
    </div>
  );
};

export default Restaurant;
