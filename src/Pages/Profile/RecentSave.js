import React, { useState } from "react";

function RecentSave() {
    const [activeTab, setActiveTab] = useState("cities");

    return (
        <div className="recent-save">
            <h3>Recent Saves</h3>
            <div className="tabs">
                <button
                    className={activeTab === "cities" ? "active" : ""}
                    onClick={() => setActiveTab("cities")}
                >
                    Cities
                </button>
                <button
                    className={activeTab === "restaurants" ? "active" : ""}
                    onClick={() => setActiveTab("restaurants")}
                >
                    Restaurants
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "cities" && (
                    <ul>
                        <li>Da Nang</li>
                        <li>Hanoi</li>
                        <li>Ho Chi Minh City</li>
                    </ul>
                )}
                {activeTab === "restaurants" && (
                    <ul>
                        <li>Pizza 4P's</li>
                        <li>Nhà hàng Cá Sông</li>
                        <li>Highlands Coffee</li>
                    </ul>
                )}
            </div>
        </div>
    );
}

export default RecentSave;
