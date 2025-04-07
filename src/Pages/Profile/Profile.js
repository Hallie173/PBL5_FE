import React from "react";
import "./Profile.scss";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RecentTrips from "./RecentTrips";
import RecentSave from "./RecentSave";
import RecentReviews from "./RecentReviews";

function Profile() {
    return (
        <div className="profile-page">
            <div className="cover-photo">
                <button className="add-cover">Add cover photo</button>
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
                            <button>📷 Post photos</button>
                            <button>✏️ Write review</button>
                        </div>
                    </div>

                    <div className="recent-activities">
                        <h2 className="section-title">Recent Activities</h2>
                        <RecentTrips />
                        <RecentSave />
                        <RecentReviews />
                    </div>
                </div>
            </div>

            <hr />

            <div class="col-span-full">
                <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900">Cover photo</label>
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div class="text-center">
                        <svg class="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                            <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                        </svg>
                        <div class="mt-4 flex text-sm/6 text-gray-600">
                            <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                            </label>
                            <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;