import React, { useCallback } from "react";
import PropTypes from "prop-types";
import "./LocationCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const LocationCard = ({
  item,
  isSaved,
  onToggleSave,
  onClick,
  renderStars,
}) => {
  const { id, name, image, rating, reviewCount, tags } = item;

  const handleSaveClick = useCallback(
    (e) => {
      e.stopPropagation();
      onToggleSave(id);
    },
    [id, onToggleSave]
  );

  // Safely format rating
  const formattedRating =
    typeof rating === "number" && !isNaN(rating) ? rating.toFixed(1) : "N/A";

  // Split tags string into array, handle empty or invalid cases
  const tagList = tags
    ? typeof tags === "string"
      ? tags.split(", ").filter((tag) => tag.trim())
      : Array.isArray(tags)
      ? tags
      : []
    : [];

  return (
    <div
      className="picture-item"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div className="item-image-container">
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
        />
        <div className="save-overlay">
          <button
            className={`save-button-overlay ${isSaved ? "saved" : ""}`}
            onClick={handleSaveClick}
            aria-label={isSaved ? "Remove from saved" : "Save to favorites"}
          >
            <FontAwesomeIcon
              icon={isSaved ? solidHeart : regularHeart}
              className="heart-icon"
            />
          </button>
        </div>
      </div>
      <div className="item-text-content">
        <h3 className="item-title">{name}</h3>
        {rating !== undefined && reviewCount !== undefined && (
          <div className="item-rating">
            <span className="rating-score">{formattedRating}</span>
            <div className="stars-wrapper">{renderStars(rating)}</div>
            <span className="review-count">
              ({reviewCount.toLocaleString()})
            </span>
          </div>
        )}
        {tagList.length > 0 && (
          <div className="item-tags">
            {tagList.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
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
    tags: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }).isRequired,
  isSaved: PropTypes.bool.isRequired,
  onToggleSave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  renderStars: PropTypes.func.isRequired,
};

export default React.memo(LocationCard);
