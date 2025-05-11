import React from "react";
import "./Form.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import formPicfrom from "../../assets/images/Cities/halong.png";
import { Link } from "react-router-dom";
import { useState } from 'react'
const Form = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const tagCategories = {
        Nature: ['beach', 'mountain', 'cave'],
        'Culture & History': ['museum', 'historical site', 'church'],
        Activity: ['hiking', 'swimming', 'camping'],
        Restaurant: ['seafood', 'local specialities', 'Buffet'],
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1>Arrange Your Trip Schedule</h1>
                <p>Fill in the details below to create your trip schedule.</p>
            </div>
            <div className="form-body">
                <div className="city-select">
                    <label className="choose-city">Choose your destination:</label>
                    <div>
                        <select id="city-select" name="city-select">
                            <option value="danang">Da Nang</option>
                        </select>
                        <button>Add Destination</button>
                    </div>
                </div>
                <div className="date-group">
                    <label className="date-select">Choose your travel dates:</label>
                    <div className="date-select">
                        <div className="start-date">
                            <label htmlFor="start-date">Start Date: </label>
                            <input
                                type="date"
                                id="start-date"
                                name="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="end-date">
                            <label htmlFor="end-date">End Date: </label>
                            <input
                                type="date"
                                id="end-date"
                                name="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="schedule-group">
                    <label className="schedule">Schedule details:</label>
                    <p className="place-search-recommend">What kind of place would you like to visit?</p>
                    <div className="place-search">
                        {Object.entries(tagCategories).map(([type, tags]) => (
                            <div key={type} className="tag-type-group">
                                <div className="type-title">{type}:</div>
                                <div className="tags">
                                    {tags.map(tag => (
                                        <div
                                            key={tag}
                                            className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="form-footer">
                <div className="next-button">
                    <Link to="/tripguide/newtrip" state={{ selectedTags, startDate, endDate }}>Next</Link>
                </div>
                <div className="selected-tags">
                    <strong>Selected Tags:</strong> {selectedTags}
                </div>
            </div>
        </div>
    );
};

export default Form;