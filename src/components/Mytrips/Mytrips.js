import React from "react";
import "./Mytrips.scss";

const MyTrips = () => {
    return (
        <div className="my-trips-container">
            <h2 className="my-trips">My trips</h2>
            <div className="trip-actions">
                <button className="create-trip">+ Create a new trip</button>
                <button className="ai-trip">🧠 Build a trip with AI</button>
            </div>

            <div className="upcoming-trip">
                <img src="https://toquoc.mediacdn.vn/280518851207290880/2024/1/7/dsdgtdy-1704616308047440689926.jpg" alt="Trip" className="trip-image" />
                <div className="trip-details">
                    <h3>Trip To Da Nang</h3>
                    <p>📅 Mar 28, 2025 📍 Da Nang</p>
                </div>
                <span className="trip-badge">In 26 days</span>
            </div>

            <h3>Completed trips</h3>
            <div className="completed-trip">
                <img src="https://toquoc.mediacdn.vn/280518851207290880/2024/1/7/dsdgtdy-1704616308047440689926.jpg" alt="Completed Trip" className="trip-image" />
                <div className="trip-details">
                    <h4>Hue for 7 days for a group of friends</h4>
                    <p>📅 Jan 17 → Jan 23, 2025 📍 Hue, Vietnam</p>
                </div>
            </div>
        </div>
    );
};

export default MyTrips;