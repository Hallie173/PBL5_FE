import React from "react";
import "./RecentTrips.scss";

function RecentTrips() {
    return (
        <div className="recent-trips">
            <h3>Recent Trips</h3>
            <ul>
                <li>
                    <div className="recent-trip-card">
                        <div className="tags">
                            <span className="tag">Family</span>
                            <span className="tag">Natural Wonders</span>
                            <span className="tag">Outdoors</span>
                        </div>
                        <h3>7 days in Da Nang for families</h3>
                        <div className="trip-date">
                            <span> March 17, 2025</span>
                        </div>
                    </div>
                </li>
                <li>
                    <div className="recent-trip-card">
                        <div className="tags">
                            <span className="tag">Group</span>
                            <span className="tag">Culture</span>
                            <span className="tag">Life Experience</span>
                            <span className="tag">Outdoors</span>
                        </div>
                        <h3>5 days in Ha Noi for 5 people</h3>
                        <div className="trip-date">
                            <span> January 5, 2025</span>
                        </div>
                    </div>
                </li>
                <li>
                    <div className="recent-trip-card">
                        <div className="tags">
                            <span className="tag">Group</span>
                            <span className="tag">Culture</span>
                            <span className="tag">Outdoors</span>
                            <span className="tag">Indoors</span>
                        </div>
                        <h3>One week around an Ancient Hoi An</h3>
                        <div className="trip-date">
                            <span> September 24, 2024</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default RecentTrips;
