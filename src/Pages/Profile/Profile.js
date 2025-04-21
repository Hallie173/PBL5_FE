// src/Pages/Profile/Profile.js
import React, { useState, useEffect, useCallback, useContext } from "react";
import { authService } from "../../services/authService";
import UserService from "../../services/userService";
import "./Profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCalendarDays,
  faPlus,
  faXmark,
  faPen,
  faLocationDot,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import RecentTrips from "./RecentTrips";
import RecentSave from "./RecentSave";
import RecentReviews from "./RecentReviews";
import ProfileEditModal from "./ProfileEditModal";
import formatDate from "../../utils/formatDate";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth hook

// Default images and constants
const DEFAULT_AVATAR = "https://i.imgur.com/MO4pS2K.jpeg";

function Profile() {
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("trips");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout, login } = useAuth(); // Get user from context

  // Fetch user data from API or local storage
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      if (user && user.user_id) {
        try {
          // Try to get fresh data from API
          const freshUserData = await UserService.getUserById(user.user_id);
          // Format and save data
          if (freshUserData) {
            const formattedUserData = {
              ...freshUserData,
              bio: freshUserData.bio || {},
            };
            authService.setCurrentUser(formattedUserData);
            setUserData(formattedUserData);
          } else {
            // If API returns no data, fall back to local storage
            setUserData({ ...user, bio: user.bio || {} });
          }
        } catch (error) {
          console.error("Failed to refresh user data:", error);
          // Fall back to local storage on error
          setUserData({ ...user, bio: user.bio || {} });
        }
      } else if (user) {
        // Use local data
        setUserData({ ...user, bio: user.bio || {} });
      } else {
        // Default guest user
        setUserData(getGuestUserData());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
      setUserData(getGuestUserData());
    } finally {
      setLoading(false);
    }
  }, [user]); // Thêm user vào dependency array

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, user]); // Thêm user vào dependency array

  // Default guest user data
  const getGuestUserData = () => ({
    full_name: "Guest User",
    username: "guest",
    bio: {},
    created_at: new Date(),
    avatar_url: DEFAULT_AVATAR,
  });

  // Update profile handler
  const handleProfileUpdate = async (updatedData) => {
    try {
      if (!userData.user_id) {
        toast.error("You need to be logged in to update your profile");
        return Promise.reject(new Error("Authentication required"));
      }
      // Optimistic UI update
      setUserData((prevData) => ({
        ...prevData,
        full_name: updatedData.full_name,
        username: updatedData.username,
        avatar_url: updatedData.avatar_url || prevData.avatar_url,
        bio: {
          ...prevData.bio,
          ...(updatedData.bio || {}),
        },
      }));
      // Update via API
      await UserService.updateProfile(userData.user_id, updatedData);
      // Refresh data to ensure consistency
      await fetchUserData();
      toast.success("Profile updated successfully!");
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating profile:", error);
      // Revert UI to server state on error
      await fetchUserData();
      const errorMsg = error.message || "Failed to update profile";
      toast.error(errorMsg);
      return Promise.reject(error);
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = async (file) => {
    if (!file || !userData.user_id) {
      toast.error("You need to be logged in to update your avatar");
      return null;
    }
    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar image must be less than 2MB");
      return null;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG or GIF images are allowed");
      return null;
    }
    try {
      // Upload avatar
      const response = await UserService.uploadAvatar(file);
      return response?.url;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar. Please try again.");
      return null;
    }
  };

  // Cover photo upload handler
  const handleCoverPhotoUpload = async (file) => {
    if (!file || !userData.user_id) {
      toast.error("You need to be logged in to upload a cover photo");
      return;
    }
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover photo must be less than 10MB");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG or GIF images are allowed");
      return;
    }
    // Todo: Implement cover photo upload
    toast.success("Cover photo functionality coming soon!");
    toggleUploadBox();
  };

  // Toggle upload box
  const toggleUploadBox = (e) => {
    if (e) e.stopPropagation();
    setShowUploadBox(!showUploadBox);
  };

  // Handle edit profile button click
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div className="profile-page loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="cover-photo">
        <button className="add-cover" onClick={toggleUploadBox}>
          Add cover photo
        </button>
      </div>
      <div className="section-container">
        <div className="profile-section">
          <div className="profile-info">
            <div className="avatar-div">
              <img
                src={userData.avatar_url || DEFAULT_AVATAR}
                alt={`${userData.full_name || "User"}'s avatar`}
                className="avatar"
              />
            </div>
            <div className="user-details">
              <h2 className="display-name">{userData.full_name || "User"}</h2>
              <p className="username">@{userData.username || "guest"}</p>
            </div>
            <button className="edit-button" onClick={handleEditProfile}>
              <FontAwesomeIcon icon={faPenToSquare} className="edit-icon" />
              <span>Edit profile</span>
            </button>
          </div>
        </div>
        <div className="profile-content">
          <aside className="profile-sidebar">
            <div className="bio-card">
              <h3>Bio</h3>
              <ul className="bio-list">
                {userData.bio?.currentCity ? (
                  <li>
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="bio-icon"
                    />
                    {userData.bio.currentCity}
                  </li>
                ) : (
                  <li onClick={handleEditProfile}>
                    <FontAwesomeIcon icon={faPlus} className="bio-icon" />
                    Add your current city
                  </li>
                )}
                <li>
                  <FontAwesomeIcon icon={faCalendarDays} className="bio-icon" />
                  Joined in{" "}
                  {userData.created_at
                    ? formatDate(userData.created_at)
                    : "N/A"}
                </li>
                {userData.bio?.website ? (
                  <li>
                    <FontAwesomeIcon icon={faGlobe} className="bio-icon" />
                    <a
                      href={userData.bio.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {userData.bio.website.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                ) : (
                  <li onClick={handleEditProfile}>
                    <FontAwesomeIcon icon={faPlus} className="bio-icon" />
                    Add a website
                  </li>
                )}
                {userData.bio?.about ? (
                  <li className="bio-text">
                    <FontAwesomeIcon icon={faPen} className="bio-icon" />
                    {userData.bio.about}
                  </li>
                ) : (
                  <li onClick={handleEditProfile}>
                    <FontAwesomeIcon icon={faPlus} className="bio-icon" />
                    Write some details about yourself
                  </li>
                )}
              </ul>
            </div>
            <div className="advice-card">
              <h3>Share your travel advice</h3>
              <div className="advice-buttons">
                <button className="advice-button">
                  <FontAwesomeIcon icon={faPen} className="advice-icon" />
                  Write review
                </button>
              </div>
            </div>
          </aside>
          <div className="recent-activities">
            <h3 className="section-title">Your Recent Travel Experiences</h3>
            <div className="recent-activities-tabs">
              <div className="tabs-navigation">
                <button
                  className={`tab-button ${
                    activeTab === "trips" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("trips")}
                >
                  My Trips
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "saved" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("saved")}
                >
                  Saved
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("reviews")}
                >
                  Reviews
                </button>
              </div>
              <div className="tab-content">
                {activeTab === "trips" && <RecentTrips userData={userData} />}
                {activeTab === "saved" && <RecentSave userData={userData} />}
                {activeTab === "reviews" && (
                  <RecentReviews userData={userData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="section-divider" />
      {showUploadBox && (
        <div className="overlay-upload-box" onClick={toggleUploadBox}>
          <div
            className="upload-image-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="upload-box-title">
              <h4 className="upload-title">Cover photo</h4>
              <button
                className="close-button-wrapper"
                onClick={toggleUploadBox}
              >
                <FontAwesomeIcon icon={faXmark} className="close-button" />
              </button>
            </div>
            <div className="upload-box">
              <div className="upload-content">
                <div className="upload-action">
                  <label htmlFor="file-upload" className="upload-label">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleCoverPhotoUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <p className="instruction">or drag and drop</p>
                </div>
                <p className="upload-note">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {userData && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          userData={userData}
          onSave={handleProfileUpdate}
          onAvatarUpload={handleAvatarUpload}
        />
      )}
    </div>
  );
}

export default Profile;
