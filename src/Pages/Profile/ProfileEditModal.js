import React, { useState, useRef, useEffect, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faImage,
  faUser,
  faAt,
  faLocationDot,
  faGlobe,
  faPen,
  faCircleCheck,
  faMapMarkerAlt,
  faTimesCircle,
  faInfoCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./ProfileEditModal.scss";

const validationSchema = Yup.object({
  full_name: Yup.string()
    .required("Display name is required")
    .max(30, "Display name must be 30 characters or less"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscore"
    ),
  currentCity: Yup.string().max(50, "City must be 50 characters or less"),
  website: Yup.string()
    .url("Website must start with http:// or https://")
    .nullable(),
  about: Yup.string().max(250, "Bio must be 250 characters or less"),
});

const POPULAR_DESTINATIONS = [
  "Beach",
  "Mountains",
  "City",
  "Countryside",
  "Desert",
  "Forest",
  "Island",
  "Historic Sites",
  "Theme Parks",
  "Culinary",
  "Wildlife",
  "Adventure",
];

function ProfileEditModal({
  isOpen,
  onClose,
  userData,
  onSave,
  onAvatarUpload,
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const [avatarPreview, setAvatarPreview] = useState(
    userData?.avatar_url || "https://i.imgur.com/MO4pS2K.jpeg"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  const initialValues = {
    full_name: userData?.full_name || "",
    username: userData?.username || "",
    currentCity: userData?.bio?.currentCity || "",
    website: userData?.bio?.website || "",
    about: userData?.bio?.about || "",
    location_preferences: userData?.bio?.location_preferences || [],
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && userData) {
      setAvatarPreview(
        userData.avatar_url || "https://i.imgur.com/MO4pS2K.jpeg"
      );
      setSelectedFile(null);
      setUploadError("");
      setActiveTab("basic");
    }
  }, [isOpen, userData]);

  const handleAvatarChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be less than 2MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG or GIF images are allowed");
      return;
    }

    setSelectedFile(file);
    setUploadError("");

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleLocationPreferenceToggle = useCallback(
    (preference, setFieldValue, values) => {
      const currentPreferences = [...values.location_preferences];

      if (currentPreferences.includes(preference)) {
        setFieldValue(
          "location_preferences",
          currentPreferences.filter((p) => p !== preference)
        );
      } else if (currentPreferences.length < 5) {
        setFieldValue("location_preferences", [
          ...currentPreferences,
          preference,
        ]);
      }
    },
    []
  );

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      setIsUploading(true);
      setUploadError("");

      try {
        let finalAvatarUrl = userData?.avatar_url;

        if (selectedFile) {
          const response = await onAvatarUpload(selectedFile);
          if (response && response.avatarUrl) {
            finalAvatarUrl = response.avatarUrl;
            console.log("Avatar uploaded, URL:", finalAvatarUrl);
          } else {
            throw new Error("Invalid avatar upload response");
          }
        }

        const updatedUserData = {
          full_name: values.full_name.trim(),
          username: values.username.trim(),
          bio: {
            currentCity: values.currentCity?.trim() || "",
            website: values.website?.trim() || "",
            about: values.about?.trim() || "",
            location_preferences: values.location_preferences || [],
          },
          avatar_url: finalAvatarUrl,
        };

        console.log("Submitting profile data:", updatedUserData);
        await onSave(updatedUserData);
        onClose();
      } catch (error) {
        console.error("Error saving profile:", error.message);
        setUploadError(error.message || "Failed to save profile");
      } finally {
        setIsUploading(false);
        setSubmitting(false);
      }
    },
    [selectedFile, userData, onAvatarUpload, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div
        className="edit-modal-container"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="edit-modal-header">
          <h2>Edit Profile</h2>
          <button
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="edit-modal-tabs">
          <button
            className={`tab-btn ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
            aria-selected={activeTab === "basic"}
            role="tab"
          >
            <FontAwesomeIcon icon={faUser} className="tab-icon" />
            Basic Info
          </button>
          <button
            className={`tab-btn ${activeTab === "bio" ? "active" : ""}`}
            onClick={() => setActiveTab("bio")}
            aria-selected={activeTab === "bio"}
            role="tab"
          >
            <FontAwesomeIcon icon={faPen} className="tab-icon" />
            Bio & Details
          </button>
          <button
            className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
            aria-selected={activeTab === "preferences"}
            role="tab"
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="tab-icon" />
            Travel Preferences
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
            isSubmitting,
          }) => (
            <Form className="edit-form">
              {activeTab === "basic" && (
                <div className="form-tab-content">
                  <div className="avatar-edit-section">
                    <div className="current-avatar">
                      <img
                        src={avatarPreview}
                        alt={`${values.full_name || "User"}'s avatar`}
                        className="avatar-preview"
                      />
                      <div className="avatar-actions">
                        <button
                          type="button"
                          className="change-avatar-btn"
                          onClick={triggerFileInput}
                          disabled={isUploading}
                        >
                          <FontAwesomeIcon icon={faImage} /> Change Photo
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          accept="image/jpeg,image/png,image/gif"
                          onChange={handleAvatarChange}
                          aria-label="Upload profile photo"
                        />
                      </div>
                      {uploadError && (
                        <div className="upload-error">
                          <FontAwesomeIcon icon={faTimesCircle} /> {uploadError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="full_name">
                      <FontAwesomeIcon icon={faUser} className="field-icon" />
                      Display Name
                    </label>
                    <Field
                      type="text"
                      id="full_name"
                      name="full_name"
                      placeholder="Your display name"
                      maxLength="30"
                      className={
                        errors.full_name && touched.full_name
                          ? "input-error"
                          : ""
                      }
                    />
                    <div className="char-count">
                      {values.full_name.length}/30
                    </div>
                    <ErrorMessage
                      name="full_name"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">
                      <FontAwesomeIcon icon={faAt} className="field-icon" />
                      Username
                    </label>
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Your username"
                      maxLength="20"
                      className={
                        errors.username && touched.username ? "input-error" : ""
                      }
                    />
                    <div className="char-count">
                      {values.username.length}/20
                    </div>
                    <div className="field-hint">
                      <FontAwesomeIcon icon={faInfoCircle} /> Username can only
                      contain letters, numbers and underscore (_)
                    </div>
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
              )}

              {activeTab === "bio" && (
                <div className="form-tab-content">
                  <div className="form-group">
                    <label htmlFor="currentCity">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="field-icon"
                      />
                      Current City
                    </label>
                    <Field
                      type="text"
                      id="currentCity"
                      name="currentCity"
                      placeholder="Where are you based?"
                      maxLength="50"
                      className={
                        errors.currentCity && touched.currentCity
                          ? "input-error"
                          : ""
                      }
                    />
                    <ErrorMessage
                      name="currentCity"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="website">
                      <FontAwesomeIcon icon={faGlobe} className="field-icon" />
                      Website
                    </label>
                    <Field
                      type="url"
                      id="website"
                      name="website"
                      placeholder="Your website or social profile"
                      className={
                        errors.website && touched.website ? "input-error" : ""
                      }
                    />
                    <div className="field-hint">
                      <FontAwesomeIcon icon={faInfoCircle} /> Must include
                      http:// or https://
                    </div>
                    <ErrorMessage
                      name="website"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="about">
                      <FontAwesomeIcon icon={faPen} className="field-icon" />
                      About Yourself
                    </label>
                    <Field
                      as="textarea"
                      id="about"
                      name="about"
                      placeholder="Tell others about yourself and your travels..."
                      rows="4"
                      maxLength="250"
                      className={
                        errors.about && touched.about ? "input-error" : ""
                      }
                    />
                    <div className="char-count">{values.about.length}/250</div>
                    <ErrorMessage
                      name="about"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="form-tab-content">
                  <div className="form-group">
                    <label className="preferences-label">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="field-icon"
                      />
                      Travel Preferences (Select up to 5)
                    </label>
                    <div className="field-hint">
                      <FontAwesomeIcon icon={faInfoCircle} /> These help
                      personalize your experience and connect with similar
                      travelers
                    </div>

                    <div className="preferences-container">
                      {POPULAR_DESTINATIONS.map((destination) => (
                        <button
                          key={destination}
                          type="button"
                          className={`preference-tag ${
                            values.location_preferences.includes(destination)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleLocationPreferenceToggle(
                              destination,
                              setFieldValue,
                              values
                            )
                          }
                          disabled={
                            !values.location_preferences.includes(
                              destination
                            ) && values.location_preferences.length >= 5
                          }
                        >
                          {destination}
                          {values.location_preferences.includes(
                            destination
                          ) && (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="check-icon"
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="selected-count">
                      {values.location_preferences.length}/5 selected
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                  disabled={isSubmitting || isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={isSubmitting || !isValid || isUploading}
                >
                  {isUploading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ProfileEditModal;
