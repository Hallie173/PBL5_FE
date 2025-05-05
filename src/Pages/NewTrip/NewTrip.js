import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Date picker for selecting dates
import "./NewTrip.scss"; // Main styles for the new trip page
import newtrippic from "../../assets/images/Cities/goldenbridge.png";
import marblemountains from "../../assets/images/Cities/marblemountains.png";
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountainSun } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icons for Nature
import { faUtensils } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icons for Restaurant
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icons for else
import MapComponent from '../../components/GoogleMap/GoogleMap';

function NewTrip() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    return (
        <div className="new-trip-container">
            <div className="city-name-container">
                <img src={newtrippic} alt="City" className="city-image" />
                <div className="title-overlay">
                    <h2>Trip to <span className="destination-name">...</span></h2>
                    <div className="date-time">
                        <FontAwesomeIcon icon={faCalendarDay} className="date-icon" />
                        <span className="date-text">Apr 13 - Apr 17</span>
                    </div>
                </div>
            </div>
            <div className="trip-details">
                <div className="trip-info">
                    <div className="trip-itinerary">
                        <h2 className="trip-itinerary-title">Itinerary</h2>
                        <div className="trip-day">
                            <div className="trip-day-header">
                                <h4>Sunday, Apr 13</h4>
                            </div>

                            <div className="trip-day-content">
                                <div className="timeline-line"></div>
                                <div className="trip-timeline">
                                    <div className="location-card">
                                        <img src={marblemountains} alt="The Marble Mountains" className="location-img" />
                                        <div className="location-info">
                                            <div className="location-title">The Marble Mountains</div>
                                            <div className="item-rating">
                                                <span className="rating-dots">🟢🟢🟢🟢</span>
                                                <span className="rating-number">8,124</span>
                                            </div>
                                            <div className="location-type"><FontAwesomeIcon icon={faMountainSun} className="location-type-icon" />Nature</div>
                                        </div>
                                        <div className="location-menu">⋯</div>
                                    </div>

                                    <div className="location-card">
                                        <img src={marblemountains} alt="The Marble Mountains" className="location-img" />
                                        <div className="location-info">
                                            <div className="location-title">The Marble Mountains</div>
                                            <div className="item-rating">
                                                <span className="rating-dots">🟢🟢🟢🟢</span>
                                                <span className="rating-number">8,124</span>
                                            </div>
                                            <div className="location-type"><FontAwesomeIcon icon={faMountainSun} className="location-type-icon" />Nature</div>
                                        </div>
                                        <div className="location-menu">⋯</div>
                                    </div>

                                    <div className="timeline-add-button">
                                        <button>+ Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*add another day*/}
                        <div className="trip-day">
                            <div className="trip-day-header">
                                <h4>Monday, Apr 17</h4>
                            </div>

                            <div className="trip-day-content">
                                <div className="timeline-line"></div>
                                <div className="trip-timeline">
                                    <div className="location-card">
                                        <img src={marblemountains} alt="The Marble Mountains" className="location-img" />
                                        <div className="location-info">
                                            <div className="location-title">The Marble Mountains</div>
                                            <div className="item-rating">
                                                <span className="rating-dots">🟢🟢🟢🟢</span>
                                                <span className="rating-number">8,124</span>
                                            </div>
                                            <div className="location-type"><FontAwesomeIcon icon={faMountainSun} className="location-type-icon" />Nature</div>
                                        </div>
                                        <div className="location-menu">⋯</div>
                                    </div>

                                    <div className="location-card">
                                        <img src={marblemountains} alt="The Marble Mountains" className="location-img" />
                                        <div className="location-info">
                                            <div className="location-title">The Marble Mountains</div>
                                            <div className="item-rating">
                                                <span className="rating-dots">🟢🟢🟢🟢</span>
                                                <span className="rating-number">8,124</span>
                                            </div>
                                            <div className="location-type"><FontAwesomeIcon icon={faMountainSun} className="location-type-icon" />Nature</div>
                                        </div>
                                        <div className="location-menu">⋯</div>
                                    </div>

                                    <div className="timeline-add-button">
                                        <button>+ Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="trip-map">
                    <MapComponent />
                </div>
            </div>
        </div>
    );
}

export default NewTrip;