import React, { useState } from "react";
import Loading from "../../components/Loading/Loading";
import NotificationMui from "../../components/NotificationMui/NotificationMui";
import {
  Star,
  Camera,
  X,
  Calendar,
  Users,
  Check,
  ChevronDown,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useReviewForm } from "./hooks/useReviewForm";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";

// Constants
const visitTypes = [
  { value: "recent", label: "Last week" },
  { value: "month", label: "Last month" },
  { value: "year", label: "Last year" },
];
const companions = ["Business", "Couples", "Family", "Friends", "Solo"];

// Error Message Component
const ErrorMessage = ({ name, formik }) => {
  return formik.touched[name] && formik.errors[name] ? (
    <div className="text-red-500 text-xs mt-1 flex items-center">
      <AlertCircle size={12} className="mr-1" />
      {formik.errors[name]}
    </div>
  ) : null;
};

export default function AttractionReview() {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.user_id;
  const { attractionId } = useParams();

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Form hook
  const {
    formik,
    uploadedImages,
    fileInputRef,
    isSubmitting,
    error,
    handleFileSelect,
    removeImage,
    triggerFileInput,
    handleCancel,
    handleRatingChange,
    locationData,
    isLoading,
    fetchError,
    refetchLocationData,
  } = useReviewForm({
    userId: userId || 0,
    attractionId,
    type: "attraction",
    onSuccess: () => {
      setNotification({
        show: true,
        message: "Review submitted successfully!",
        type: "success",
      });
      formik.resetForm();
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (err) => {
      setNotification({
        show: true,
        message: err.message || "Failed to submit review. Please try again.",
        type: "error",
      });
    },
  });

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, show: false });
  };

  // Redirect if not logged in
  if (!isLoggedIn || !userId) {
    return (
      <Navigate to="/" replace state={{ from: window.location.pathname }} />
    );
  }

  return (
    <>
      {/* Full-screen loading */}
      {isLoading && <Loading message="Loading attraction details..." />}

      {/* Notification */}
      <NotificationMui
        message={notification.message}
        type={notification.type}
        open={notification.show}
        handleClose={handleCloseNotification}
        position={{ vertical: "top", horizontal: "center" }} // Modern top-center position
      />

      {/* Main content */}
      <div className="max-w-5xl mx-auto my-8 shadow-xl rounded-2xl overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Share your experience
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Loader2
                  className="animate-spin text-gray-500 mb-3"
                  size={28}
                />
                <div className="text-gray-500 text-sm">
                  Loading attraction...
                </div>
                {/* Skeleton Loader */}
                <div className="w-full mt-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="mt-4 h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                </div>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center bg-white rounded-xl shadow-sm border border-red-100 p-6">
                <AlertCircle className="text-red-500 mb-3" size={28} />
                <div className="text-red-500 text-sm text-center mb-4">
                  {fetchError || "Failed to load attraction details."}
                </div>
                <button
                  onClick={refetchLocationData}
                  className="flex items-center text-sm text-[#00a568] hover:text-[#009259] font-medium transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Try Again
                </button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-100 p-6"
                aria-label={`Details for ${locationData?.name || "attraction"}`}
              >
                <div className="mb-4 w-full overflow-hidden rounded-lg shadow-sm relative group">
                  <img
                    src={
                      locationData?.image_url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={locationData?.name || "Attraction"}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x200?text=Image+Error")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-center w-full">
                  <div
                    className="font-semibold text-gray-800 text-lg truncate"
                    title={locationData?.name}
                  >
                    {locationData?.name || "Unknown Attraction"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="md:w-2/3 p-8 bg-white">
            {error && (
              <div className="mb-6 text-red-500 text-sm flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}

            {!isLoading && !fetchError && (
              <form onSubmit={formik.handleSubmit}>
                {/* Rating */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    How would you rate your experience?
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none transition-all duration-200 hover:scale-110"
                        disabled={isSubmitting}
                      >
                        <Star
                          size={32}
                          fill={
                            star <= formik.values.rating ? "#00a568" : "none"
                          }
                          color={
                            star <= formik.values.rating ? "#00a568" : "#D1D5DB"
                          }
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600 mt-2 inline-block bg-gray-100 px-3 py-1 rounded-full">
                    {formik.values.rating === 5 && "Excellent"}
                    {formik.values.rating === 4 && "Good"}
                    {formik.values.rating === 3 && "Average"}
                    {formik.values.rating === 2 && "Fair"}
                    {formik.values.rating === 1 && "Bad"}
                  </span>
                  <ErrorMessage name="rating" formik={formik} />
                </div>

                {/* Visit Type */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    When did you go?
                  </label>
                  <div className="relative">
                    <select
                      className={`w-full px-4 py-3 border rounded-lg text-sm appearance-none focus:ring-2 focus:ring-[#00a568] outline-none bg-white transition-colors ${
                        formik.touched.visitType && formik.errors.visitType
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-[#00a568]"
                      }`}
                      name="visitType"
                      value={formik.values.visitType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>
                        Select when you visited
                      </option>
                      {visitTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <ErrorMessage name="visitType" formik={formik} />
                </div>

                {/* Companion */}
                <div className="mb-8">
                  <label className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                    <Users size={16} className="mr-2 text-gray-500" />
                    Who did you go with?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {companions.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                          formik.values.companion === type.toLowerCase()
                            ? "bg-green-100 text-[#00a568] border border-green-200 font-medium shadow-sm"
                            : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                        onClick={() =>
                          formik.setFieldValue("companion", type.toLowerCase())
                        }
                        disabled={isSubmitting}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <ErrorMessage name="companion" formik={formik} />
                </div>

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Title your review
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00a568] outline-none transition-colors ${
                      formik.touched.title && formik.errors.title
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#00a568]"
                    }`}
                    placeholder="Sum up your experience in a few words"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    <div className="text-xs text-gray-500">
                      Be concise and descriptive
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{
                        color:
                          formik.values.title.length > 80
                            ? "#f43f5e"
                            : "#6b7280",
                      }}
                    >
                      {formik.values.title.length}/100
                    </div>
                  </div>
                  <ErrorMessage name="title" formik={formik} />
                </div>

                {/* Review */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Write your review
                  </label>
                  <textarea
                    name="review"
                    className={`w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-[#00a568] outline-none transition-colors ${
                      formik.touched.review && formik.errors.review
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#00a568]"
                    }`}
                    rows="5"
                    placeholder="Share details about your experience: What did you like or dislike? What stood out to you the most?"
                    value={formik.values.review}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                    maxLength={300}
                  />
                  <div className="flex justify-between mt-1">
                    <div className="text-xs text-gray-500">
                      Be honest and detailed in your feedback
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{
                        color:
                          formik.values.review.length > 250
                            ? "#f43f5e"
                            : "#6b7280",
                      }}
                    >
                      {formik.values.review.length}/300
                    </div>
                  </div>
                  <ErrorMessage name="review" formik={formik} />
                </div>

                {/* Photos */}
                <div className="mb-8">
                  <label className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                    <Camera size={16} className="mr-2 text-gray-500" />
                    Add your photos
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      (Optional, max 6)
                    </span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    disabled={isSubmitting}
                  />
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    {uploadedImages.map((img) => (
                      <div
                        key={img.id}
                        className="relative h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          disabled={isSubmitting}
                        >
                          <X size={14} color="white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {uploadedImages.length === 0 && (
                    <div
                      onClick={triggerFileInput}
                      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-8 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="text-center">
                        <div className="bg-gray-100 rounded-full p-3 inline-block mb-3">
                          <Camera className="text-gray-500" size={24} />
                        </div>
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          Click to add photos
                        </div>
                        <div className="text-xs text-gray-500">
                          or drag and drop images here
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Photos help others understand your experience better (Max 6
                    images)
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#00a568] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#009259] transition-colors duration-200 shadow-md flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Submit your review
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 shadow-md flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
