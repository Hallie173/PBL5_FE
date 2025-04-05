import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const useRestaurantManagement = (onSubmit) => {
  const fileInputRef = useRef(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(null);

  const isEdit = !!selectedRestaurant?.restaurant_id;

  const validationSchema = Yup.object({
    name: Yup.string().required("Restaurant name is required"),
    city_id: Yup.string().required("Please select a city"),
    latitude: Yup.number()
      .required("Latitude is required")
      .min(-90, "Invalid latitude value (min -90)")
      .max(90, "Invalid latitude value (max 90)"),
    longitude: Yup.number()
      .required("Longitude is required")
      .min(-180, "Invalid longitude value (min -180)")
      .max(180, "Invalid longitude value (max 180)"),
    address: Yup.string().required("Address is required"),
    phone_number: Yup.string().required("Phone number is required"),
    open_time: Yup.string().required("Open time is required"),
    close_time: Yup.string().required("Close time is required"),
    reservation_required: Yup.boolean().required(
      "Reservation required is required"
    ),
    image_urls: Yup.array()
      .max(10, "Maximum 10 images allowed")
      .test("is-valid-url", "Invalid URL", (values) => {
        // Allow data URLs (for file uploads) or valid http/https URLs
        return values.every(
          (url) =>
            url.startsWith("data:") ||
            url.match(/^(ftp|http|https):\/\/[^ "]+$/)
        );
      }),
    tags: Yup.string(),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      city_id: "",
      address: "",
      phone_number: "",
      open_time: "",
      close_time: "",
      image_urls: [],
      tags: "",
      reservation_required: false,
    },
    validationSchema,
    onSubmit: (values) => {
      const processedValues = {
        ...values,
        image_urls: values.image_urls.filter((url) => url.trim() !== ""),
        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      };
      onSubmit(processedValues);
    },
  });

  const handleFileChange = (e) => {
    // Clear previous errors
    setImageError(null);

    // Get files from event (support both input change and drop events)
    const files = Array.from(
      e.target.files || (e.dataTransfer && e.dataTransfer.files) || []
    );

    // Check if adding these files would exceed the limit
    if (files.length + formik.values.image_urls.length > 10) {
      setImageError(
        `Cannot add ${files.length} images. Maximum 10 images allowed (currently ${formik.values.image_urls.length})`
      );
      return;
    }

    // Validate file types
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setImageError(
        `Invalid file type(s): ${invalidFiles
          .map((f) => f.name)
          .join(", ")}. Only images are allowed.`
      );
      return;
    }

    // Process valid files
    const promises = files.map(
      (file) =>
        new Promise((resolve) => {
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            setImageError(
              `File ${file.name} is too large. Maximum size is 5MB.`
            );
            resolve(null);
            return;
          }

          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => {
            setImageError(`Error reading file: ${file.name}`);
            resolve(null);
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises).then((newImages) => {
      const validImages = newImages.filter((url) => url);
      formik.setFieldValue("image_urls", [
        ...formik.values.image_urls,
        ...validImages,
      ]);
    });
  };

  const triggerFileInput = () => {
    if (formik.values.image_urls.length >= 10) {
      setImageError("Maximum 10 images allowed");
      return;
    }
    fileInputRef.current?.click();
  };

  // Function to open modal for adding new restaurant
  const handleOpenModal = (restaurant = null) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
    
    // Reset form values
    if (restaurant) {
      // Edit mode: Populate form with restaurant data
      formik.setValues({
        name: restaurant.name || "",
        description: restaurant.description || "",
        latitude: restaurant.latitude || "",
        longitude: restaurant.longitude || "",
        city_id: restaurant.city_id || "",
        address: restaurant.address || "",
        phone_number: restaurant.phone_number || "",
        open_time: restaurant.open_time || "",
        close_time: restaurant.close_time || "",
        image_urls: restaurant.image_urls || [],
        tags: Array.isArray(restaurant.tags) ? restaurant.tags.join(", ") : "",
        reservation_required: restaurant.reservation_required || false,
      });
    } else {
      // Create mode: Reset form to initial values
      formik.resetForm();
    }
    
    // Clear any previous errors
    setImageError(null);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
    formik.resetForm();
    setImageError(null);
  };

  return {
    isModalOpen,
    selectedRestaurant,
    handleOpenModal,
    handleCloseModal,
    isEdit,
    formik,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    imageError,
    setImageError,
  };
};

export default useRestaurantManagement;