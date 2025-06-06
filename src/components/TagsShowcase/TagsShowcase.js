import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TagsShowcase.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShip,
  faDice,
  faGraduationCap,
  faTheaterMasks,
  faCalendarAlt,
  faUtensils,
  faGamepad,
  faMuseum,
  faTree,
  faMoon,
  faEllipsisH,
  faHiking,
  faShoppingBag,
  faLandmark,
  faSpa,
  faCompass,
  faBus,
  faInfoCircle,
  faWater,
  faFish,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import BASE_URL from "../../constants/BASE_URL";
import { useAuth } from "../../contexts/AuthContext";

const TAG_ICONS = {
  "Boat Tours & Water Sports": faShip,
  "Casinos & Gambling": faDice,
  "Classes & Workshops": faGraduationCap,
  "Concerts & Shows": faTheaterMasks,
  Events: faCalendarAlt,
  "Food & Drink": faUtensils,
  "Fun & Games": faGamepad,
  Museums: faMuseum,
  "Nature & Parks": faTree,
  Nightlife: faMoon,
  Other: faEllipsisH,
  "Outdoor Activities": faHiking,
  Shopping: faShoppingBag,
  "Sights & Landmarks": faLandmark,
  "Spas & Wellness": faSpa,
  Tours: faCompass,
  Transportation: faBus,
  "Traveler Resources": faInfoCircle,
  "Water & Amusement Parks": faWater,
  "Zoos & Aquariums": faFish,
};

const TagsShowcase = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/tags/attractions`);
        // Filter tags based on user preferences and exclude test tag
        const userPreferences = user?.bio?.location_preferences || [];
        const formattedTags = response.data
          .filter(
            (tag) =>
              tag !== "test tag" && userPreferences.includes(tag)
          )
          .map((tag) => ({
            id: tag,
            name: tag,
            icon: TAG_ICONS[tag] || faEllipsisH,
          }));
        setTags(formattedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, [user]);

  if (loading) {
    return (
      <div className="tags-showcase loading">
        <FontAwesomeIcon icon={faSpinner} spin />
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="tags-showcase empty">
        <h3 className="showcase-title">Travel Preferences</h3>
        <p className="empty-message">
          No travel preferences selected yet.
          Update your profile to add your favorite types of places.
        </p>
      </div>
    );
  }

  return (
    <div className="tags-showcase">
      <div className="showcase-header">
        <h3 className="showcase-title">Your Travel Preferences</h3>
        <p className="showcase-subtitle">Places you're interested in</p>
      </div>

      <div className="tags-grid">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-card">
            <div className="tag-icon">
              <FontAwesomeIcon icon={tag.icon} />
            </div>
            <div className="tag-info">
              <span className="tag-name">{tag.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsShowcase;
