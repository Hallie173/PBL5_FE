import React, { useCallback } from "react";
import PropTypes from "prop-types";
import "./LocationCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useFavorites from "../../hooks/useFavorites";

const LocationCard = ({ item, onClick, renderStars }) => {
  const { id, name, image, rating, reviewCount, tags, type } = item;
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { favorites, createFavorite, deleteFavorite } = useFavorites(
    user?.user_id,
    isLoggedIn
  );

  const isSaved = favorites.some(
    (fav) =>
      (type === "restaurant" && String(fav.restaurant_id) === String(id)) ||
      (type === "attraction" && String(fav.attraction_id) === String(id))
  );

  const handleSaveClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isLoggedIn) {
        navigate("/");
        alert("Please log in to save this location!");
        return;
      }

      if (isSaved) {
        const favorite = favorites.find(
          (fav) =>
            (type === "restaurant" &&
              String(fav.restaurant_id) === String(id)) ||
            (type === "attraction" && String(fav.attraction_id) === String(id))
        );
        if (favorite) {
          deleteFavorite(favorite.favorite_id);
        }
      } else {
        createFavorite({
          userId: user.user_id,
          attractionId: type === "attraction" ? id : undefined,
          restaurantId: type === "restaurant" ? id : undefined,
        });
      }
    },
    [
      isSaved,
      isLoggedIn,
      navigate,
      favorites,
      type,
      id,
      user?.user_id,
      createFavorite,
      deleteFavorite,
    ]
  );

  const formattedRating =
    typeof rating === "number" && !isNaN(rating) ? rating.toFixed(1) : "N/A";

  // Normalize and limit tags
  const normalizeTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.filter((tag) => tag.trim());
    if (typeof tags === "string") {
      try {
        const parsed = tags.split(", ").filter((tag) => tag.trim());
        return parsed.length ? parsed : [];
      } catch (e) {
        console.error("Failed to parse tags:", e);
        return [];
      }
    }
    return [];
  };

  const tagList = normalizeTags(tags);
  const maxTags = 3; // Limit to 3 visible tags
  const displayedTags = tagList.slice(0, maxTags);
  const extraTagsCount = tagList.length - maxTags;

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
          width={280}
          height={210} // 4:3 aspect ratio (280 * 3 / 4)
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
          <ul className="item-tags" role="list" aria-label="Location tags">
            {displayedTags.map((tag, index) => (
              <li key={index} className="tag">
                {tag}
              </li>
            ))}
            {extraTagsCount > 0 && (
              <li className="tag tag-more">+{extraTagsCount}</li>
            )}
          </ul>
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
    type: PropTypes.oneOf(["restaurant", "attraction"]).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  renderStars: PropTypes.func.isRequired,
};

export default React.memo(LocationCard);
