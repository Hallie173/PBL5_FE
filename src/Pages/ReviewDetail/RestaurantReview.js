import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Star,
  Camera,
  X,
  Plus,
  Calendar,
  Users,
  MapPin,
  Check,
  ChevronDown,
  AlertCircle,
  Utensils,
} from "lucide-react";

export default function RestaurantReview({ id }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    rating: Yup.number()
      .required("Please rate your experience")
      .min(1, "Please rate your experience"),
    visitType: Yup.string().required("Please select when you visited"),
    companion: Yup.string().required("Please select who you went with"),
    purpose: Yup.string().required("Please select your visit purpose"),
    title: Yup.string()
      .required("Please add a title for your review")
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be under 100 characters"),
    review: Yup.string()
      .required("Please write your review")
      .min(20, "Your review is too short. Please provide more details.")
      .max(300, "Review must be under 300 characters"),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      rating: 5,
      visitType: "",
      companion: "",
      purpose: "",
      title: "",
      review: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = {
        ...values,
        uploadedImages,
      };
      try {
        const response = await fetch(`/restaurants/${id}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert("Review submitted successfully!");
        } else {
          throw new Error("Failed to submit review");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("An error occurred while submitting your review.");
      }
    },
  });

  const handleRatingChange = (newRating) => {
    formik.setFieldValue("rating", newRating);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImages = newFiles.map((file) => ({
        id: Math.random().toString(36).substring(2),
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      }));
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const removeImage = (id) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const companions = ["Business", "Couples", "Family", "Friends", "Solo"];
  const visitTypes = [
    { value: "recent", label: "Last week" },
    { value: "month", label: "Last month" },
    { value: "year", label: "Last year" },
  ];
  const purposes = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Brunch",
    "Late Night",
    "Dine-in",
    "Takeout",
    "Business Meeting",
    "Casual Dining",
    "Celebration",
  ];

  // Helper function to show error message
  const ErrorMessage = ({ name }) => {
    return formik.touched[name] && formik.errors[name] ? (
      <div className="text-red-500 text-xs mt-1 flex items-center">
        <AlertCircle size={12} className="mr-1" />
        {formik.errors[name]}
      </div>
    ) : null;
  };

  return (
    <div className="flex max-w-5xl mx-auto my-8 shadow-lg rounded-lg overflow-hidden bg-white">
      {/* Left panel with image and location */}
      <div className="w-1/3 p-6 bg-gray-50 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Share your experience
        </h2>

        <div className="flex flex-col items-center bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="mb-4 overflow-hidden shadow-sm relative group">
            <img
              src="https://via.placeholder.com/150"
              alt="Restaurant"
              className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="mt-2 text-center">
            <div className="font-semibold text-gray-800 text-lg">
              Sample Restaurant
            </div>
            <div className="text-gray-500 text-sm flex items-center justify-center mt-1">
              <MapPin size={16} className="mr-1" />
              123 Food Street, City
            </div>
          </div>
        </div>
      </div>

      {/* Right panel with review form */}
      <div className="w-2/3 p-8 bg-white">
        <div>
          {/* Rating section */}
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
                >
                  <Star
                    size={32}
                    fill={star <= formik.values.rating ? "#00a568" : "none"}
                    color={star <= formik.values.rating ? "#00a568" : "#D1D5DB"}
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
              {formik.values.rating === 1 && "Poor"}
            </span>
            <ErrorMessage name="rating" />
          </div>

          {/* What was your visit purpose? section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
              <Utensils size={16} className="mr-2 text-gray-500" />
              What was your visit purpose?
            </label>
            <div className="relative">
              <select
                className={`w-full px-4 py-3 border rounded-lg text-sm appearance-none focus:ring-2 focus:ring-[#00a568] outline-none bg-white ${
                  formik.touched.purpose && formik.errors.purpose
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#00a568]"
                }`}
                name="purpose"
                value={formik.values.purpose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled>
                  Select your visit purpose
                </option>
                {purposes.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <ErrorMessage name="purpose" />
          </div>

          {/* When did you go section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
              <Calendar size={16} className="mr-2 text-gray-500" />
              When did you visit?
            </label>
            <div className="relative">
              <select
                className={`w-full px-4 py-3 border rounded-lg text-sm appearance-none focus:ring-2 focus:ring-[#00a568] outline-none bg-white ${
                  formik.touched.visitType && formik.errors.visitType
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#00a568]"
                }`}
                name="visitType"
                value={formik.values.visitType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
            <ErrorMessage name="visitType" />
          </div>

          {/* Who did you go with section */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
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
                >
                  {type}
                </button>
              ))}
            </div>
            <ErrorMessage name="companion" />
          </div>

          {/* Title your review section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Title your review
            </label>
            <input
              type="text"
              name="title"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#00a568] outline-none ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#00a568]"
              }`}
              placeholder="Summarize your experience in a few words"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="flex justify-between mt-1">
              <div className="text-xs text-gray-500">
                Keep it short and descriptive
              </div>
              <div
                className="text-xs font-medium"
                style={{
                  color:
                    formik.values.title.length > 80 ? "#f43f5e" : "#6b7280",
                }}
              >
                {formik.values.title.length}/100
              </div>
            </div>
            <ErrorMessage name="title" />
          </div>

          {/* Write your review section */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Write your review
            </label>
            <textarea
              name="review"
              className={`w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-[#00a568] outline-none ${
                formik.touched.review && formik.errors.review
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-[#00a568]"
              }`}
              rows="5"
              placeholder="Share details about your experience: What did you like or dislike? What stood out?"
              value={formik.values.review}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="flex justify-between mt-1">
              <div className="text-xs text-gray-500">
                Be honest and detailed in your feedback
              </div>
              <div
                className="text-xs font-medium"
                style={{
                  color:
                    formik.values.review.length > 250 ? "#f43f5e" : "#6b7280",
                }}
              >
                drinken {formik.values.review.length}/300
              </div>
            </div>
            <ErrorMessage name="review" />
          </div>

          {/* Add photos section */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
              <Camera size={16} className="mr-2 text-gray-500" />
              Add your photos
              <span className="ml-2 text-xs text-gray-500 font-normal">
                (Optional)
              </span>
            </label>

            {/* Image upload area */}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />

            {/* Image preview grid */}
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
                  >
                    <X size={14} color="white" />
                  </button>
                </div>
              ))}

              {/* Add more images button */}
              {uploadedImages.length > 0 && uploadedImages.length < 6 && (
                <div
                  onClick={triggerFileInput}
                  className="flex items-center justify-center h-24 bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                >
                  <Plus size={20} className="text-gray-500" />
                </div>
              )}
            </div>

            {/* Drop area for when no images are uploaded */}
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
                    or drag and drop photos here
                  </div>
                </div>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Photos help others understand your experience better
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-[#00a568] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#009259] transition-colors duration-200 shadow-md flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={formik.isSubmitting}
          >
            <Check className="w-5 h-5 mr-2" />
            Submit your review
          </button>
        </div>
      </div>
    </div>
  );
}
