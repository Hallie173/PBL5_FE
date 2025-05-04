import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
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

const DEFAULT_AVATAR = "https://i.imgur.com/MO4pS2K.jpeg";
const DEFAULT_USER = {
  full_name: "User",
  username: "user",
  bio: {},
  avatar_url: DEFAULT_AVATAR,
  created_at: new Date(),
};

function Profile() {
  const { user, isLoggedIn } = useAuth();
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("trips");
  const [userData, setUserData] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(true);
  console.log(user);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Auth user:", user);
      if (!isLoggedIn || (!user?.user_id && !user?.id)) {
        setUserData(DEFAULT_USER);
        toast.warn("Please log in to view your profile");
        return;
      }
      const userId = user.user_id || user.id; // Sử dụng id nếu user_id không có
      const freshUserData = await UserService.getUserById(userId);
      if (freshUserData) {
        const formattedUserData = {
          ...freshUserData,
          bio: freshUserData.bio || {},
        };
        setUserData(formattedUserData);
      } else {
        throw new Error("No user data returned from API");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
      setUserData(
        user
          ? { ...user, bio: user.bio || {}, user_id: user.id || user.user_id }
          : DEFAULT_USER
      );
    } finally {
      setLoading(false);
    }
  }, [user, isLoggedIn]);

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Update profile handler
  const handleProfileUpdate = async (updatedData) => {
    try {
      if (!user?.user_id) {
        toast.error("You need to be logged in to update your profile");
        return Promise.reject(new Error("Authentication required"));
      }
      console.log("Updating profile with:", updatedData); // Debug
      // Optimistic UI update
      setUserData((prevData) => ({
        ...prevData,
        full_name: updatedData.full_name,
        username: updatedData.username,
        avatar_url: updatedData.avatar_url || prevData.avatar_url,
        bio: updatedData.bio || prevData.bio,
      }));
      // Update via API
      await UserService.updateProfile(user.user_id, updatedData);
      // Refresh data
      await fetchUserData();
      toast.success("Profile updated successfully!");
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating profile:", error.message);
      await fetchUserData(); // Revert to latest data
      toast.error(error.message || "Failed to update profile");
      return Promise.reject(error);
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = async (file) => {
    if (!file || !user?.user_id) {
      toast.error("You need to be logged in to update your avatar");
      return null;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar image must be less than 2MB");
      return null;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or GIF images are allowed");
      return null;
    }
    try {
      const response = await UserService.uploadAvatar(file);
      return response; // Trả về { avatarUrl: "url" }
    } catch (error) {
      console.error("Error uploading avatar:", error.message);
      toast.error(error.message || "Failed to upload avatar");
      return null;
    }
  };

  // Cover photo upload handler (placeholder)
  const handleCoverPhotoUpload = async (file) => {
    if (!file || !user?.user_id) {
      toast.error("You need to be logged in to upload a cover photo");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover photo must be less than 10MB");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or GIF images are allowed");
      return;
    }
    toast.success("Cover photo functionality coming soon!");
    setShowUploadBox(false);
  };

  // Toggle upload box
  const toggleUploadBox = (e) => {
    if (e) e.stopPropagation();
    setShowUploadBox(!showUploadBox);
  };

  // Handle edit profile
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
              <p className="username">@{userData.username || "user"}</p>
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
