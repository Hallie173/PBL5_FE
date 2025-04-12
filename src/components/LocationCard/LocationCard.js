import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import "./LocationCard.scss"; // Import the SCSS file for styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faCircle as solidCircle
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as regularHeart,
  faCircle as regularCircle
} from "@fortawesome/free-regular-svg-icons";

// Helper function moved here as it's specific to this card's display logic
const renderRatingDots = (rating) => {
  const totalDots = 5;
  const roundedRating = Math.round(rating);
  const dots = [];
  for (let i = 0; i < roundedRating; i++) {
    dots.push(<FontAwesomeIcon key={`full-${i}`} icon={solidCircle} />);
  }
  for (let i = roundedRating; i < totalDots; i++) {
    dots.push(<FontAwesomeIcon key={`empty-${i}`} icon={regularCircle} />);
  }
  return <span className="rating-dots">{dots}</span>;
};

const LocationCard = ({ item, isSaved, onToggleSave, onClick }) => {
  // Destructure item properties for easier access (optional)
  const { id, name, image, rating, reviewCount, tags, badge } = item;

  const handleSaveClick = (e) => {
      e.stopPropagation(); // Prevent triggering onClick when clicking save
      onToggleSave(e); // Call the passed function
  };

  return (
    <div className="picture-item" onClick={onClick}> {/* Use the passed onClick handler */}
      <div className="item-image-container">
        <img src={image} alt={name} />
        <div className="save-overlay">
          <button
            className={`save-button-overlay ${isSaved ? "saved" : ""}`}
            onClick={handleSaveClick} // Use the internal handler
            aria-label={isSaved ? "Remove from saved" : "Save to favorites"}
          >
            <FontAwesomeIcon
              icon={isSaved ? solidHeart : regularHeart}
              className="heart-icon-recent" // Keep class name consistent with SCSS
            />
          </button>
        </div>
      </div>
      <div className="item-text-content">
        <p className="item-title">{name}</p>
        {rating !== undefined && reviewCount !== undefined && ( // Check if rating data exists
            <div className="item-rating">
                 <span className="rating-score">{rating.toFixed(1)}</span>
                 {renderRatingDots(rating)}
                 <span className="review-count">({reviewCount.toLocaleString()})</span>
            </div>
        )}
        {tags && ( // Check if tags data exists
            <p className="item-category">{tags}</p>
        )}
      </div>
    </div>
  );
};

LocationCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    tags: PropTypes.string,
  }).isRequired,
  isSaved: PropTypes.bool.isRequired,
  onToggleSave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default LocationCard;