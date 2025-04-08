import React, { useState } from "react";
import "./Profile.scss";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import RecentTrips from "./RecentTrips";
import RecentSave from "./RecentSave";
import RecentReviews from "./RecentReviews";

function Profile() {
    const [showUploadBox, setShowUpLoadBox] = useState(false);
    const [activeTab, setActiveTab] = useState("trips");


    return (
        <div className="profile-page">
            <div className="cover-photo">
                <button className="add-cover" onClick={() => setShowUpLoadBox(true)}>Add cover photo</button>
            </div>
            <div className="section-container">
                <div className="profile-section">
                    <div className="profile-info">
                        <div className="avatar-div"><img
                            src="https://i.imgur.com/MO4pS2K.jpeg"
                            alt="avatar"
                            className="avatar"
                        />
                        </div>
                        <div className="user-details">
                            <p className="display-name">Quoc T</p>
                            <p className="username">@quoct845</p>
                            <div className="follow-stats">
                                <div>
                                    <span className="follow-label"><PersonAddAlt1Icon />Followers</span>
                                    <span className="follow-number">53</span>
                                </div>
                                <div>
                                    <span className="follow-label"><PersonAddAltIcon />Following</span>
                                    <span className="follow-number">16</span>
                                </div>
                            </div>
                        </div>
                        <div className="edit-button">
                            <span className="edit-icon"><FontAwesomeIcon icon={faPenToSquare} /></span>
                            <button className="edit-profile">Edit profile</button>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-sidebar">
                        <div className="bio-card">
                            <h3>Bio</h3>
                            <ul>
                                <li><FontAwesomeIcon icon={faPlus} className="bio-icon" />Add your current city</li>
                                <li><FontAwesomeIcon icon={faCalendarDays} className="bio-icon" />Joined in Jan 2025</li>
                                <li><FontAwesomeIcon icon={faPlus} className="bio-icon" />Add a website</li>
                                <li><FontAwesomeIcon icon={faPlus} className="bio-icon" />Write some details about yourself</li>
                            </ul>
                        </div>
                        <div className="advice-card">
                            <h3>Share your travel advice</h3>
                            <div className="advice-buttons">
                                <button><FontAwesomeIcon icon={faPen} className="advice-icon" />Write review</button>
                            </div>
                        </div>
                    </div>

                    <div className="recent-activities">
                        <h3 className="section-title">Your Recent Travel Experiences</h3>
                        <div className="recent-activities-tab">
                            <div className="tabs-name">
                                <button
                                    className={activeTab === "trips" ? "active" : ""}
                                    onClick={() => setActiveTab("trips")}
                                >
                                    My Trips
                                </button>
                                <button
                                    className={activeTab === "saved" ? "active" : ""}
                                    onClick={() => setActiveTab("saved")}
                                >
                                    Saved
                                </button>
                                <button
                                    className={activeTab === "reviews" ? "active" : ""}
                                    onClick={() => setActiveTab("reviews")}
                                >
                                    Reviews
                                </button>
                            </div>
                            <div className="tab-content">
                                {activeTab === "trips" && (
                                    <RecentTrips />
                                )}
                                {activeTab === "saved" && (
                                    <RecentSave />
                                )}
                                {activeTab === "reviews" && (
                                    <RecentReviews />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr />

            {showUploadBox && (
                <div className="overlay-upload-box" onClick={() => setShowUpLoadBox(false)}>
                    <div class="col-span-full upload-image-container" onClick={(e) => e.stopPropagation()}>
                        <div className="upload-box-title">
                            <label for="cover-photo" class="label">Cover photo</label>
                            <div onClick={() => setShowUpLoadBox(false)} className="close-button-wrapper">
                                <FontAwesomeIcon icon={faXmark} className="close-button" />
                            </div>
                        </div>
                        <div class="upload-box">
                            <div class="text-center">
                                <div class="upload-action">
                                    <label for="file-upload">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                                    </label>
                                    <p class="instruction">or drag and drop</p>
                                </div>
                                <p class="upload-note">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div >
    );
}

export default Profile;