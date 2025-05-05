import React from "react";
import "./Form.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import formPicfrom from "../../assets/images/Cities/halong.png";
import { Link } from "react-router-dom";

const Form = () => {
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
                            <label className="start-date">Start Date:</label>
                            <input type="date" id="start-date" name="start-date" />
                        </div>
                        <div className="end-date">
                            <label className="end-date">End Date:</label>
                            <input type="date" id="end-date" name="end-date" />
                        </div>
                    </div>
                </div>
                <div className="schedule-group">
                    <label className="schedule">Schedule details:</label>
                    <p className="place-search-recommend">What kind of place would you like to visit?</p>
                    <div className="place-search">
                        <div className="nature-type">
                            <div className="type-title">Nature:</div>
                            <div className="tags">
                                <div className="tag">Beach</div>
                                <div className="tag">Mountain</div>
                                <div className="tag">Cave</div>
                            </div>
                        </div>
                        <div className="culture-history-type">
                            <div className="type-title">Culture & History:</div>
                            <div className="tags">
                                <div className="tag">Museum</div>
                                <div className="tag">Historical Site</div>
                                <div className="tag">Church</div>
                            </div>
                        </div>
                        <div className="activity-type">
                            <div className="type-title">Activity:</div>
                            <div className="tags">
                                <div className="tag">Hiking</div>
                                <div className="tag">Swimming</div>
                                <div className="tag">Camping</div>
                            </div>
                        </div>
                        <div className="restaurant-type">
                            <div className="type-title">Activity:</div>
                            <div className="tags">
                                <div className="tag">Seafood</div>
                                <div className="tag">Local Specialities</div>
                                <div className="tag">Rice</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-footer">
                <div className="next-button">
                    <Link to="/tripguide/newtrip">Next</Link>
                </div>
            </div>
        </div>
    )
}

export default Form;