import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const useAttractionManagement = () => {
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const fileInputRef = useRef(null);

  const isEdit = !!selectedAttraction?.attraction_id;

  const validationSchema = Yup.object({
    name: Yup.string().required("Attraction name is required"),
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
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      city_id: "",
      address: "",
      tags: "",
      image_url: "",
    },
    validationSchema,
    onSubmit: () => {}, // To be overridden by parent component
  });

  // Update form values when selectedAttraction changes
  useEffect(() => {
    if (selectedAttraction) {
      formik.setValues({
        name: selectedAttraction.name || "",
        description: selectedAttraction.description || "",
        latitude: selectedAttraction.latitude || "",
        longitude: selectedAttraction.longitude || "",
        city_id: selectedAttraction.city_id || "",
        address: selectedAttraction.address || "",
        tags: selectedAttraction.tags?.join(", ") || "",
        image_url: selectedAttraction.image_url || "",
      });

      // Set preview image if it exists
      if (selectedAttraction.image_url) {
        setPreviewImage(selectedAttraction.image_url);
      } else {
        setPreviewImage("");
      }
    }
  }, [selectedAttraction]);

  const handleOpenModal = (attraction = null) => {
    setSelectedAttraction(attraction);
    setIsModalOpen(true);
    setImageError("");
    setUploadedFile(null);
    setPreviewImage("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAttraction(null);
    formik.resetForm();
    setImageError("");
    setUploadedFile(null);
    setPreviewImage("");
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    formik.setFieldValue("image_url", url);
    setPreviewImage(url);
    setUploadedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setImageError("File size exceeds 10MB limit");
        e.target.value = null;
        return;
      }

      setUploadedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      formik.setFieldValue("image_url", ""); // Clear URL when file is uploaded
      setImageError("");
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const prepareFormData = (values, images) => {
    const formData = new FormData();

    // Add basic form values
    Object.keys(values).forEach((key) => {
      // Skip image_url as we'll handle it separately
      if (key !== "image_url") {
        formData.append(key, values[key]);
      }
    });

    // Process tags
    if (values.tags) {
      const tagsArray = values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      formData.append("tags", JSON.stringify(tagsArray));
    }

    // Process images
    if (images) {
      // Handle image URLs
      if (images.imageUrls && images.imageUrls.length > 0) {
        // First URL is primary
        formData.append("image_url", images.imageUrls[0]);

        // Additional URLs
        if (images.imageUrls.length > 1) {
          formData.append(
            "additional_image_urls",
            JSON.stringify(images.imageUrls.slice(1))
          );
        }
      }

      // Handle uploaded files
      if (images.uploadedFiles && images.uploadedFiles.length > 0) {
        images.uploadedFiles.forEach((file, index) => {
          if (index === 0 && !images.imageUrls.length) {
            // First file is primary if no URLs
            formData.append("image_file", file);
          } else {
            // Additional files
            formData.append(`additional_image_files`, file);
          }
        });
      }
    }

    return formData;
  };

  return {
    // Modal state
    isModalOpen,
    selectedAttraction,
    handleOpenModal,
    handleCloseModal,

    // Form state
    isEdit,
    isSubmitting,
    setIsSubmitting,
    formik,

    // Image handling
    previewImage,
    imageError,
    uploadedFile,
    fileInputRef,
    handleImageUrlChange,
    handleFileChange,
    triggerFileInput,
    setImageError,

    // Submission helper
    prepareFormData,
  };
};

export default useAttractionManagement;
