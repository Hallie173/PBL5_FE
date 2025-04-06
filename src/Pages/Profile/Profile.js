import React from "react";
import "./Profile.css";

function Profile() {
    return (
        <div className="profile-page">
            <div className="cover-photo">
                <button className="add-cover">Add cover photo</button>
            </div>
            <div className="section-container">
                <div className="profile-section">
                    <div className="profile-info">
                        <img
                            src="https://i.imgur.com/MO4pS2K.jpeg"
                            alt="avatar"
                            className="avatar"
                        />
                        <div className="user-details">
                            <h2>Quoc T</h2>
                            <p className="username">@quoct845</p>
                            <div className="follow-stats">
                                <span>👥 Followers<br />0</span>
                                <span>👥 Following<br />0</span>
                            </div>
                        </div>
                        <button className="edit-profile">Edit profile</button>
                    </div>
                </div>

                <div className="profile-content">
                    {/* Bio Section */}
                    <div className="profile-sidebar">
                        <div className="bio-card">
                            <h3>Bio</h3>
                            <ul>
                                <li>+ Add your current city</li>
                                <li>🗓️ Joined in Jan 2025</li>
                                <li>+ Add a website</li>
                                <li>+ Write some details about yourself</li>
                            </ul>
                        </div>
                        <div className="advice-card">
                            <h3>Share your travel advice</h3>
                            <button>📷 Post photos</button>
                            <button>✏️ Write review</button>
                        </div>
                    </div>

                    {/* Posts Section */}
                    <div className="posts">
                        <div className="post">
                            <div className="post-header">
                                <img
                                    src="https://i.imgur.com/MO4pS2K.jpeg"
                                    alt="avatar"
                                    className="avatar small"
                                />
                                <div>
                                    <strong>Quoc T</strong> posted a photo
                                    <p className="timestamp">Yesterday</p>
                                </div>
                                <button className="more-btn">...</button>
                            </div>
                            <img
                                src="https://cdn.tgdd.vn/Files/2021/03/15/1335222/ban-tay-khong-lo-da-nang-1_1280x720-800-resize.jpg"
                                alt="Da Nang"
                                className="post-image"
                            />
                            <div className="location-card">
                                <img
                                    src="https://cdn.tgdd.vn/Files/2021/03/15/1335222/ban-tay-khong-lo-da-nang-1_1280x720-800-resize.jpg"
                                    alt="Da Nang"
                                    className="location-thumb"
                                />
                                <div>
                                    <strong>Da Nang</strong>
                                    <p>Vietnam</p>
                                </div>
                            </div>
                            <div className="post-actions">
                                <button>Save</button>
                                <button>Share</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;