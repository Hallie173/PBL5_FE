import React, { useState } from "react";

function RecentSave() {
    const [activeTab, setActiveTab] = useState("cities");

    return (
        <div className="recent-save">
            <h3>Recent Saves</h3>
            <div className="saved-card">
                <div className="saved-item-img">

                </div>
                <div className="saved-item-content">

                </div>
            </div>
        </div>
    );
}

export default RecentSave;
