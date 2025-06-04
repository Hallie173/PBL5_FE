import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "./Attraction.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareShareNodes,
  faPen,
  faLocationDot,
  faCircleInfo,
  faChevronRight,
  faHeart,
  faImages,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import OpenStreetMap from "../../components/OpenStreetMap/OpenStreetMap";
import useAttraction from "./hooks/useAttraction";
import LocationCard from "../../components/LocationCard/LocationCard";
import Loading from "../../components/Loading/Loading";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import BASE_URL from "../../constants/BASE_URL";

const ErrorMessage = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="error-container">
      <h2>{error ? "Error" : "Not Found"}</h2>
      <p>{error || "Attraction not found."}</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

const AttractionHeader = ({
  attraction,
  city,
  isFavorite,
  handleToggleSave,
  handleShareClick,
  handleReviewClick,
  renderStars,
  ratingBreakdown,
}) => {
  const navigate = useNavigate();
  return (
    <header className="attraction-header">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <button onClick={() => navigate("/tripguide")}>Vietnam</button>
          </li>
          <li className="breadcrumb-separator" aria-hidden="true">
            <FontAwesomeIcon icon={faChevronRight} />
          </li>
          <li className="breadcrumb-item">
            <button
              onClick={() => navigate(`/tripguide/city/${city?.city_id}`)}
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
                navigate(`/tripguide/city/${city?.city_id}/attractions`)
              }
            >
              {city?.name ? `${city.name} Attractions` : "Attractions"}
            </button>
          </li>
          <li className="breadcrumb-separator" aria-hidden="true">
            <FontAwesomeIcon icon={faChevronRight} />
          </li>
          <li className="breadcrumb-item current" aria-current="page">
            {attraction.name}
          </li>
        </ol>
      </nav>
      <div className="name-and-action">
        <div className="name-container">
          <h1>{attraction.name}</h1>
        </div>
        <div className="attraction-action">
          <button
            className="action-button share-attraction"
            onClick={handleShareClick}
            aria-label="Share this attraction"
          >
            <FontAwesomeIcon
              icon={faSquareShareNodes}
              className="action-icon"
            />
            <span>Share</span>
          </button>
          <button
            className="action-button review-attraction"
            aria-label="Write a review for this attraction"
            onClick={handleReviewClick}
          >
            <FontAwesomeIcon icon={faPen} className="action-icon" />
            <span>Review</span>
          </button>
          <button
            className={`action-button save-attraction ${
              isFavorite ? "saved" : ""
            }`}
            onClick={handleToggleSave}
            aria-label={isFavorite ? "Remove from saved" : "Save attraction"}
          >
            <FontAwesomeIcon icon={faHeart} className="action-icon" />
            <span>{isFavorite ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
      <div className="attraction-rating">
        <div className="rating-stars">
          {renderStars(ratingBreakdown.average)}
          <span className="rating-value">
            {Number(ratingBreakdown.average).toFixed(1)}
          </span>
        </div>
        <span className="rating-count">
          ({ratingBreakdown.totalReviews}{" "}
          {ratingBreakdown.totalReviews === 1 ? "review" : "reviews"})
        </span>
      </div>
    </header>
  );
};

const AttractionGallery = React.memo(
  ({
    images,
    activeImageIndex,
    setActiveImageIndex,
    isFullScreen,
    setIsFullScreen,
    handlePrevImage,
    handleNextImage,
    attractionName,
  }) => {
    const thumbnailContainerRef = useRef(null);
    const galleryRef = useRef(null);
    const touchStartX = useRef(null);
    const [imageError, setImageError] = useState(null);
    const [thumbnailErrors, setThumbnailErrors] = useState({});
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
      if (!images?.length) {
        setImageError("No images available");
      } else if (!Array.isArray(images)) {
        setImageError("Invalid image data");
      } else {
        images.forEach((url, idx) => {
          if (typeof url !== "string" || !url.trim()) {
            setThumbnailErrors((prev) => ({ ...prev, [idx]: "Invalid URL" }));
          }
        });
      }
    }, [images]);

    useEffect(() => {
      if (thumbnailContainerRef.current) {
        const thumbnails =
          thumbnailContainerRef.current.querySelectorAll(".thumbnail img");
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                  img.src = img.dataset.src;
                }
                observer.unobserve(img);
              }
            });
          },
          { rootMargin: "0px" }
        );
        thumbnails.forEach((img) => observer.observe(img));
        return () => observer.disconnect();
      }
    }, [images]);

    useEffect(() => {
      const activeThumbnail = thumbnailContainerRef.current?.querySelector(
        `.thumbnail:nth-child(${activeImageIndex + 1})`
      );
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    }, [activeImageIndex]);

    useEffect(() => {
      if (isFullScreen) {
        galleryRef.current?.focus();
      }
    }, [isFullScreen]);

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (touchStartX.current === null) return;
      const touchEndX = e.touches[0].clientX;
      const diffX = touchStartX.current - touchEndX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) handleNextImage();
        else handlePrevImage();
        touchStartX.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartX.current = null;
    };

    const handleThumbnailClick = useCallback(
      (index) => setActiveImageIndex(index),
      [setActiveImageIndex]
    );

    const handleThumbnailKeyDown = useCallback(
      (e, index) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActiveImageIndex(index);
        }
      },
      [setActiveImageIndex]
    );

    const handleImageError = (e, index) => {
      e.target.src = "https://via.placeholder.com/120x80?text=Image+Not+Found";
      setThumbnailErrors((prev) => ({ ...prev, [index]: "Failed to load" }));
    };

    if (imageError) {
      return (
        <div className="attraction-gallery error">
          <div className="image-error">
            <FontAwesomeIcon icon={faImages} className="no-image-icon" />
            <p>{imageError}</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="attraction-gallery"
        role="region"
        aria-label="Image gallery"
        ref={galleryRef}
        tabIndex={isFullScreen ? 0 : -1}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images?.length > 0 && Array.isArray(images) ? (
          <>
            <div
              className="main-image-container"
              onClick={() => setIsFullScreen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && setIsFullScreen(true)
              }
              aria-label="View images in fullscreen"
            >
              <img
                src={images[activeImageIndex]}
                alt={`${attractionName || "Attraction"} - Image ${
                  activeImageIndex + 1
                }`}
                className="main-image"
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
                onError={(e) => {
                  handleImageError(e, activeImageIndex);
                  setIsImageLoaded(true);
                }}
                style={{ opacity: isImageLoaded ? 1 : 0 }}
              />
              {images.length > 1 && (
                <>
                  <div className="image-counter">
                    {activeImageIndex + 1}/{images.length}
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
            {isFullScreen && (
              <div
                className="fullscreen-gallery"
                onClick={() => setIsFullScreen(false)}
                role="dialog"
                aria-label="Fullscreen image gallery"
                tabIndex={0}
              >
                <img
                  src={images[activeImageIndex]}
                  alt={`${attractionName || "Attraction"} - Image ${
                    activeImageIndex + 1
                  }`}
                  className="fullscreen-image"
                  onError={(e) => handleImageError(e, activeImageIndex)}
                />
                <div className="image-caption">
                  {attractionName} - Image {activeImageIndex + 1}
                </div>
                <div className="image-counter">
                  {activeImageIndex + 1}/{images.length}
                </div>
                <button
                  className="close-fullscreen"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullScreen(false);
                  }}
                  aria-label="Close fullscreen gallery"
                >
                  ×
                </button>
                {images.length > 1 && (
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
                )}
              </div>
            )}
            {images.length > 1 && (
              <div
                className="thumbnail-gallery"
                role="tablist"
                ref={thumbnailContainerRef}
              >
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`thumbnail ${
                      activeImageIndex === idx ? "active" : ""
                    } ${thumbnailErrors[idx] ? "error" : ""}`}
                    role="tab"
                    tabIndex={0}
                    onClick={() => handleThumbnailClick(idx)}
                    onKeyDown={(e) => handleThumbnailKeyDown(e, idx)}
                    aria-label={`View image ${idx + 1}`}
                    aria-selected={activeImageIndex === idx}
                  >
                    {thumbnailErrors[idx] ? (
                      <div className="thumbnail-error">
                        <FontAwesomeIcon
                          icon={faImages}
                          className="error-icon"
                        />
                        <span>{thumbnailErrors[idx]}</span>
                      </div>
                    ) : (
                      <img
                        data-src={img}
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        loading="lazy"
                        onError={(e) => handleImageError(e, idx)}
                      />
                    )}
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
  },
  (prevProps, nextProps) =>
    prevProps.images === nextProps.images &&
    prevProps.activeImageIndex === nextProps.activeImageIndex &&
    prevProps.isFullScreen === nextProps.isFullScreen
);

const AttractionInfo = React.memo(
  ({ attraction, city, mapCenter, mapError, fetchAttraction }) => {
    return (
      <div className="attraction-content">
        <div className="attraction-info">
          <section className="info-section">
            <h2>
              <FontAwesomeIcon icon={faCircleInfo} className="section-icon" />{" "}
              About
            </h2>
            <div className="info-card">
              <div className="description">
                {attraction.description || (
                  <p className="no-content">No description.</p>
                )}
              </div>
              {attraction.tags?.length > 0 && (
                <div className="tags">
                  {attraction.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="contact-details">
                {attraction.website && (
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={attraction.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {attraction.website}
                    </a>
                  </p>
                )}
                {attraction.phone_number && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${attraction.phone_number}`}>
                      {attraction.phone_number}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </section>
          <section className="info-section">
            <h2>
              <FontAwesomeIcon icon={faLocationDot} className="section-icon" />{" "}
              Location
            </h2>
            <p className="location-address">
              {attraction.address || "No address."}
            </p>
            <div className="map-container">
              {mapError ? (
                <div className="map-error" role="alert">
                  {mapError}
                  <button onClick={fetchAttraction}>Retry</button>
                </div>
              ) : mapCenter &&
                Array.isArray(mapCenter) &&
                mapCenter.length === 2 ? (
                <OpenStreetMap
                  key={`map-${mapCenter[0]}-${mapCenter[1]}`}
                  center={mapCenter}
                  zoom={15}
                  markers={[
                    {
                      position: mapCenter,
                      title: attraction.name,
                    },
                  ]}
                  height="400px"
                  width="100%"
                  showCurrentLocation={true}
                />
              ) : (
                <div className="map-loading" role="alert">
                  Loading map...
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="attraction-sidebar">
          <div className="quick-info">
            <h3>Quick Info</h3>
            <ul>
              <li>
                <strong>Location:</strong> {city?.name || "Unknown"}, Vietnam
              </li>
            </ul>
            {attraction.website && (
              <button
                className="book-now-button"
                onClick={() => window.open(attraction.website, "_blank")}
                aria-label="Visit attraction website"
              >
                Visit Website
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.attraction?.id === nextProps.attraction?.id &&
    prevProps.city?.id === nextProps.city?.id &&
    prevProps.mapCenter === nextProps.mapCenter &&
    prevProps.mapError === nextProps.mapError
);

const AttractionReviews = React.memo(
  ({
    reviews,
    reviewSort,
    handleSortChange,
    isLoggedIn,
    ratingBreakdown,
    renderStars,
    formatDate,
    navigate,
  }) => {
    const [displayCount, setDisplayCount] = useState(5);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const modalRef = useRef(null);

    const openModal = (photo) => {
      setSelectedImage(photo);
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      setSelectedImage(null);
      document.body.style.overflow = "";
    };

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape" && selectedImage) {
          closeModal();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImage]);

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

    const handleLoadMore = () => {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayCount(displayCount + 5);
        setIsLoadingMore(false);
      }, 500);
    };

    return (
      <section id="review-section" className="reviews-section">
        <div className="reviews-container">
          <div className="review-stats">
            <div className="average-rating">
              <span className="big-rating">
                {Number(ratingBreakdown.average).toFixed(1)}
              </span>
              <div className="rating-label">
                {renderStars(ratingBreakdown.average)}
                <span>({ratingBreakdown.totalReviews} reviews)</span>
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
                </select>
              </div>
              {reviews.length > 0 ? (
                <>
                  {reviews.slice(0, displayCount).map((review, index) => (
                    <div
                      className={`review-card ${
                        review.isCurrentUser ? "current-user" : ""
                      } fade-in`}
                      key={review.review_id || index}
                      aria-labelledby={`review-title-${index}`}
                    >
                      <div className="review-header">
                        <div className="reviewer-info">
                          <img
                            src={review.profilePic}
                            alt={`Avatar of ${review.userName || "Anonymous"}`}
                            className="reviewer-avatar"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/50")
                            }
                          />
                          <div className="reviewer-details">
                            <h4>{review.userName}</h4>
                            <span className="review-date">
                              {formatDate(review.created_at || new Date())}
                            </span>
                          </div>
                        </div>
                        <div className="review-rating">
                          {renderStars(review.rating || 0)}
                        </div>
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
  },
  (prevProps, nextProps) =>
    prevProps.reviews === nextProps.reviews &&
    prevProps.reviewSort === nextProps.reviewSort &&
    prevProps.isLoggedIn === nextProps.isLoggedIn
);

const NearbyAttractions = React.memo(
  ({ nearbyAttractions, city, renderStars, handleToggleSave, favorites }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

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
        {nearbyAttractions.length > 0 ? (
          <div className="nearby-grid">
            {nearbyAttractions.slice(0, 4).map((place) => {
              const isPlaceFavorite = favorites?.some(
                (fav) =>
                  String(fav.attraction_id) === String(place.attraction_id)
              );
              return (
                <LocationCard
                  key={`attraction-${place.attraction_id}`}
                  item={{
                    id: place.attraction_id,
                    name: place.name,
                    image: getValidImageUrl(place.image_url),
                    rating: parseFloat(place.average_rating) || 0,
                    reviewCount: place.rating_total || 0,
                    tags: place.tags || [],
                    type: "attraction",
                  }}
                  onClick={() =>
                    navigate(`/tripguide/attraction/${place.attraction_id}`)
                  }
                  renderStars={renderStars}
                  isSaved={isPlaceFavorite}
                  onToggleSave={() => handleToggleSave(place.attraction_id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="no-nearby">
            <p>No nearby attractions found.</p>
          </div>
        )}
        {nearbyAttractions.length > 4 && (
          <button
            className="view-more-button"
            onClick={() =>
              navigate(`/tripguide/city/${city?.city_id}/attractions`)
            }
          >
            View more nearby attractions
          </button>
        )}
      </section>
    );
  }
);

const Attraction = () => {
  const {
    attraction,
    city,
    reviews,
    nearbyAttractions,
    loading,
    error,
    isFavorite,
    favorites,
    handleShareClick,
    handleReviewClick,
    handleToggleSave,
    isLoggedIn,
    fetchAttraction,
    renderStars,
    formatDate,
  } = useAttraction();

  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [reviewSort, setReviewSort] = React.useState("newest");
  const [isLoadingVisible, setIsLoadingVisible] = React.useState(false);
  const { user } = useAuth();

  const saveRecentlyViewed = useCallback(async () => {
    
    if (!attraction || !attraction.attraction_id || !attraction.name) {
      console.warn("Invalid attraction data, skipping saveRecentlyViewed");
      return;
    }

    const item = {
      id: attraction.attraction_id,
      name: attraction.name,
      image:
        Array.isArray(attraction.image_url) && attraction.image_url.length > 0
          ? attraction.image_url[0]
          : attraction.image_url,
      rating: parseFloat(attraction.average_rating) || 0,
      reviewCount: attraction.rating_total || 0,
      tags: Array.isArray(attraction.tags) ? attraction.tags : [],
      type: "attraction",
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
        recentItems = recentItems.filter((i) => i.id !== item.id);
        recentItems.unshift(item);
        recentItems = recentItems.slice(0, 4);
        localStorage.setItem(
          "recentlyViewedItems",
          JSON.stringify(recentItems)
        );
      }
    } catch (err) {
      console.error(
        `Failed to save recently viewed attraction ${item.id}:`,
        err.message || err
      );
    }
  }, [attraction, isLoggedIn, user]);

  useEffect(() => {
    saveRecentlyViewed();
  }, [saveRecentlyViewed]);

  const images = useMemo(() => {
    const imageUrls = attraction?.image_url;
    if (!imageUrls) {
      console.warn("No image_url provided in attraction data");
      return [];
    }
    if (!Array.isArray(imageUrls)) {
      console.warn("image_url is not an array:", imageUrls);
      return typeof imageUrls === "string" ? [imageUrls] : [];
    }
    return imageUrls.filter(
      (url) => typeof url === "string" && url.trim() !== ""
    );
  }, [attraction?.image_url]);

  const mapCenter = useMemo(
    () =>
      attraction?.latitude && attraction?.longitude
        ? [attraction.latitude, attraction.longitude]
        : null,
    [attraction?.latitude, attraction?.longitude]
  );

  const ratingBreakdown = useMemo(
    () => ({
      average: Number(attraction?.average_rating) || 0,
      totalReviews: attraction?.rating_total || 0,
    }),
    [attraction?.average_rating, attraction?.rating_total]
  );

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const preloadNextImage = useCallback(
    (index) => {
      if (images.length > 1 && Array.isArray(images)) {
        const nextIndex = index === images.length - 1 ? 0 : index + 1;
        const img = new Image();
        img.src = images[nextIndex];
      }
    },
    [images]
  );

  useEffect(() => {
    preloadNextImage(activeImageIndex);
  }, [activeImageIndex, preloadNextImage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") handlePrevImage();
      else if (e.key === "ArrowRight") handleNextImage();
      else if (e.key === "Escape") setIsFullScreen(false);
    },
    [handlePrevImage, handleNextImage]
  );

  useEffect(() => {
    if (isFullScreen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isFullScreen, handleKeyDown]);

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

  if (isLoadingVisible) {
    return <Loading message="Loading attraction details..." />;
  }

  if (error || !attraction) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="attraction-container">
      <div className="sticky-action-bar">
        <button
          className="action-button share-attraction"
          onClick={handleShareClick}
          aria-label="Share this attraction"
        >
          <FontAwesomeIcon icon={faSquareShareNodes} className="action-icon" />
          <span>Share</span>
        </button>
        <button
          className="action-button review-attraction"
          onClick={handleReviewClick}
          aria-label="Write a review for this attraction"
        >
          <FontAwesomeIcon icon={faPen} className="action-icon" />
          <span>Review</span>
        </button>
        <button
          className={`action-button save-attraction ${
            isFavorite ? "saved" : ""
          }`}
          onClick={handleToggleSave}
          aria-label={isFavorite ? "Remove from saved" : "Save attraction"}
        >
          <FontAwesomeIcon icon={faHeart} className="action-icon" />
          <span>{isFavorite ? "Saved" : "Save"}</span>
        </button>
      </div>
      <AttractionHeader
        attraction={attraction}
        city={city}
        isFavorite={isFavorite}
        handleToggleSave={handleToggleSave}
        handleShareClick={handleShareClick}
        handleReviewClick={handleReviewClick}
        renderStars={renderStars}
        ratingBreakdown={ratingBreakdown}
      />
      <AttractionGallery
        images={images}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
        handlePrevImage={handlePrevImage}
        handleNextImage={handleNextImage}
        attractionName={attraction.name}
      />
      <AttractionInfo
        attraction={attraction}
        city={city}
        mapCenter={mapCenter}
        mapError={error}
        fetchAttraction={fetchAttraction}
      />
      <AttractionReviews
        reviews={reviews}
        reviewSort={reviewSort}
        setReviewSort={setReviewSort}
        isLoggedIn={isLoggedIn}
        ratingBreakdown={ratingBreakdown}
        renderStars={renderStars}
        formatDate={formatDate}
        navigate={navigate}
      />
      <NearbyAttractions
        nearbyAttractions={nearbyAttractions}
        city={city}
        renderStars={renderStars}
        handleToggleSave={handleToggleSave}
        favorites={favorites}
      />
    </div>
  );
};

export default Attraction;
