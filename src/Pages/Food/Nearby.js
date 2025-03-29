import React from "react";
import "./Restaurant.css";

const Nearby = () => {
    return (
        <div className="nearby">
            <h2>Best cheap eats</h2>
            <div className="nearby-list">
                <div className="nearby-item">🍽️ Thia Go Restaurant Da Nang</div>
                <div className="nearby-item">🍽️ Lan Gio Restaurant</div>
                <div className="nearby-item">🍽️ Van May Restaurant</div>
                <div className="nearby-item">🍽️ Du Muc Quan</div>
            </div>

            <h2>Best nearby</h2>
            <div className="map-placeholder">[Map will be displayed here]</div>
            <div className="nearby-list">
                <div className="nearby-item">🏨 Cozy Danang Boutique Hotel</div>
                <div className="nearby-item">🏨 Wink Hotel Danang Centre</div>
                <div className="nearby-item">🍽️ 3 Big - Nuong & Lau</div>
                <div className="nearby-item">🎭 Nguyen Hien Dinh Theatre</div>
            </div>
        </div>
    );
};

export default Nearby;
