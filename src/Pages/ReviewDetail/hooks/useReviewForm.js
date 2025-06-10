import { useState, useCallback, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";

const baseValidationSchema = {
  rating: Yup.number()
    .required("Please rate your experience")
    .min(1, "Please rate your experience"),
  visitType: Yup.string().required("Please select when you visited"),
  companion: Yup.string().required("Please select who you went with"),
  title: Yup.string()
    .required("Please add a title to your review")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  review: Yup.string()
    .required("Please write your review")
    .min(20, "Your review is too short. Please provide more details.")
    .max(1000, "Your review must be less than 1000 characters"),
};

// Utility function to convert File to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const useReviewForm = ({
  userId,
  attractionId,
  restaurantId,
  type = "attraction",
  onSuccess,
}) => {
  const isRestaurant = type === "restaurant";
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const fileInputRef = useRef(null);

  const validationSchema = Yup.object({
    ...baseValidationSchema,
    ...(isRestaurant
      ? { purpose: Yup.string().required("Please select your visit purpose") }
      : {}),
  });

  // Fetch location data based on type
  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const endpoint = isRestaurant
          ? `${BASE_URL}/restaurants/${restaurantId}`
          : `${BASE_URL}/attractions/${attractionId}`;
        const response = await axios.get(endpoint, {});
        const data = response.data;

        setLocationData({
          name: data.name,
          image_url:
            Array.isArray(data.image_url) && data.image_url.length > 0
              ? data.image_url[0]
              : "https://media.istockphoto.com/id/1308342065/vector/folded-location-map-with-marker-city-map-with-pin-pointer-gps-navigation-map-with-city.jpg?s=612x612&w=0&k=20&c=E9DP4dIwSdwaveNwcYU2LzBeKuBoKLa7nsTxTWDHObw=",
        });
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch location data";
        setFetchError(errorMessage);
        setLocationData({
          name: isRestaurant ? "Sample Restaurant" : "Sample Attraction",
          photo_url: "",
          address: isRestaurant ? "123 Food Street, City" : "Unknown Location",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isRestaurant ? restaurantId : attractionId) {
      fetchLocationData();
    }
  }, [attractionId, restaurantId, isRestaurant]);

  const formik = useFormik({
    initialValues: {
      rating: 5,
      visitType: "",
      companion: "",
      title: "",
      review: "",
      ...(isRestaurant ? { purpose: "" } : {}),
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        // Convert uploaded images to base64 strings
        const photos = await Promise.all(
          uploadedImages.map(async (img) => {
            const base64 = await fileToBase64(img.file);
            return base64; // Send base64 string to backend
          })
        );

        const formData = {
          user_id: userId,
          ...(isRestaurant
            ? { restaurant_id: restaurantId }
            : { attraction_id: attractionId }),
          rating: values.rating,
          title: values.title,
          comment: values.review,
          visit_type: values.visitType,
          companion: values.companion,
          photos, // Array of base64 strings
          ...(isRestaurant ? { purpose: values.purpose } : {}),
        };

        await axios.post(`${BASE_URL}/reviews`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        resetForm();
        setUploadedImages([]);
        onSuccess?.();
      } catch (err) {
        const errorMessage =
          err.response?.data?.error ||
          "An error occurred while submitting your review.";
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileSelect = useCallback(
    (e) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        // Validate file size (e.g., max 5MB) and type
        const validFiles = newFiles.filter((file) => {
          const isImage = file.type.startsWith("image/");
          const isUnderSizeLimit = file.size <= 5 * 1024 * 1024; // 5MB
          if (!isImage) {
            setError(`File ${file.name} is not an image.`);
            return false;
          }
          if (!isUnderSizeLimit) {
            setError(`File ${file.name} exceeds 5MB.`);
            return false;
          }
          return true;
        });

        if (validFiles.length + uploadedImages.length > 6) {
          setError("You can upload a maximum of 6 images.");
          return;
        }

        const newImages = validFiles.map((file) => ({
          id: Math.random().toString(36).substring(2),
          name: file.name,
          url: URL.createObjectURL(file), // For preview
          file, // Store raw file for base64 conversion
        }));
        setUploadedImages((prev) => [...prev, ...newImages]);
      }
    },
    [uploadedImages]
  );

  const removeImage = useCallback((id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    setError(null); // Clear any errors related to previous uploads
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCancel = useCallback(() => {
    formik.resetForm();
    setUploadedImages([]);
    setError(null);
  }, [formik]);

  return {
    formik,
    uploadedImages,
    fileInputRef,
    isSubmitting,
    error,
    handleFileSelect,
    removeImage,
    triggerFileInput,
    handleCancel,
    handleRatingChange: (newRating) =>
      formik.setFieldValue("rating", newRating),
    locationData,
    isLoading,
    fetchError,
  };
};
