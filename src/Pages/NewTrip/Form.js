import React, { useState, useEffect } from "react";
import "./Form.scss";
import { Link } from "react-router-dom";
import BASE_URL from "../../constants/BASE_URL";
import axios from "axios";
import {
  FaCity,
  FaCalendarAlt,
  FaTags,
  FaSearchLocation,
  FaCheck,
} from "react-icons/fa";

const Form = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedResTags, setSelectedResTags] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [tagCategories, setTagCategories] = useState({
    Attractions: [],
    Activities: [],
    Entertainment: [],
    Services: [],
    Other: [],
    Restaurant: [],
  });
  const [activeTab, setActiveTab] = useState("Attractions");
  const [tagSearch, setTagSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cityResponse = await axios.get(`${BASE_URL}/cities`);
        const tagsResponse = await axios.get(`${BASE_URL}/api/tags`);
        setCity(cityResponse.data);
        setTagCategories(tagsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleTag = (tag, category) => {
    if (category === "Restaurant") {
      setSelectedResTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    } else {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    }
  };

  // Filter tags based on search
  const filteredTags = (tags) =>
    tags.filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()));

  // Only show non-empty categories
  const nonEmptyCategories = Object.entries(tagCategories).filter(
    ([_, tags]) => tags.length > 0
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trip-planner-form">
      <div className="form-header">
        <h1>
          <FaSearchLocation className="header-icon" /> Plan Your Perfect Trip
        </h1>
      </div>

      <div className="form-body">
        <div className="form-section destination-section">
          <div className="section-header">
            <FaCity className="section-icon" />
            <h2>Destination</h2>
          </div>
          <select
            className="destination-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(Number(e.target.value))}
          >
            <option value="">Select a destination</option>
            {city.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section dates-section">
          <div className="section-header">
            <FaCalendarAlt className="section-icon" />
            <h2>Travel Dates</h2>
          </div>
          <div className="date-inputs">
            <div className="date-input">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section interests-section">
          <div className="section-header">
            <FaTags className="section-icon" />
            <h2>Your Interests</h2>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search interests..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
            />
          </div>

          <div className="category-tabs">
            {nonEmptyCategories.map(([type]) => (
              <button
                key={type}
                className={`tab-button ${activeTab === type ? "active" : ""}`}
                onClick={() => setActiveTab(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="tags-container">
            {nonEmptyCategories.map(
              ([type, tags]) =>
                activeTab === type && (
                  <div key={type} className="tags-grid">
                    {filteredTags(tags).length > 0 ? (
                      filteredTags(tags).map((tag) => (
                        <div
                          key={tag}
                          className={`tag ${(type === "Restaurant"
                              ? selectedResTags
                              : selectedTags
                            ).includes(tag)
                              ? "selected"
                              : ""
                            }`}
                          onClick={() => toggleTag(tag, type)}
                        >
                          {tag}
                          {(type === "Restaurant"
                            ? selectedResTags
                            : selectedTags
                          ).includes(tag) && (
                              <FaCheck className="selected-icon" />
                            )}
                        </div>
                      ))
                    ) : (
                      <p className="no-tags">No matching interests found</p>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      <div className="form-footer">
        <Link
          to="/tripguide/newtrip"
          className="continue-button"
          state={{
            selectedTags,
            startDate,
            endDate,
            selectedCity,
            selectedResTags,
          }}
        >
          Continue Planning <FaCheck />
        </Link>
      </div>
    </div>
  );
};

export default Form;