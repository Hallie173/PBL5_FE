import React from "react";
import "./Restaurant.css";

const RestaurantInfo = () => {
    return (
        <div className="restaurant-info">
            <h2>At a glance</h2>
            <p className="open-status">Open until 12:00 AM <span className="see-all">See all hours</span></p>
            <p className="location">📍 100 Thai Phien St., Hai Chau Dist., Da Nang Vietnam</p>
            <p className="contact">🌐 Website | 📞 +84 90 531 26 42</p>

            <h3>About</h3>
            <ul className="features">
                <li>✅ Lunch, Dinner, Brunch</li>
                <li>✅ Takeout</li>
                <li>✅ Outdoor Seating, Seating</li>
            </ul>

            <h3>Location</h3>
            <div className="map-placeholder">[Map will be displayed here]</div>
        </div>
    );
};

export default RestaurantInfo;
