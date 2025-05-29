import React from "react";
import "./Mytrips.scss";
import { Link } from "react-router-dom";

const MyTrips = () => {
    return (
        <div className="my-trips-container">
            <div className="my-trips"><h1>Make your trip unforgettable!</h1></div>
            <div className="trip-actions">
                <Link to="/tripguide/new-trip-form" className="create-trip">+ Create a new trip</Link>
            </div>

            <div className="upcoming-trip">
                <h3 className="upcoming-trip-title">Upcoming trips</h3>
                <div className="trip-content">
                    <img src="https://toquoc.mediacdn.vn/280518851207290880/2024/1/7/dsdgtdy-1704616308047440689926.jpg" alt="Trip" className="trip-image" />
                    <div className="trip-details">
                        <h4>Trip To Da Nang</h4>
                        <p>📅 Mar 28, 2025 📍 Da Nang</p>
                    </div>
                </div>
            </div>

            <div className="completed-trip">
                <h3 className="completed-trip-title">Completed trips</h3>
                <div className="trip-content">
                    <img src="https://toquoc.mediacdn.vn/280518851207290880/2024/1/7/dsdgtdy-1704616308047440689926.jpg" alt="Completed Trip" className="trip-image" />
                    <div className="trip-details">
                        <h4>Hue for 7 days for a group of friends</h4>
                        <p>📅 Jan 17 → Jan 23, 2025 📍 Hue, Vietnam</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MyTrips;