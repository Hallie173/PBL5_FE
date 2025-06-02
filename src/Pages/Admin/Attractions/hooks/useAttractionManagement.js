import { useState, useRef, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import BASE_URL from "../../../../constants/BASE_URL";

axios.defaults.baseURL = BASE_URL;

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Attraction name is required")
    .max(100, "Name is too long"),
  city_id: Yup.number()
    .required("City is required")
    .positive()
    .integer("City ID must be an integer"),
  address: Yup.string()
    .required("Address is required")
    .max(255, "Address is too long"),
  latitude: Yup.number()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .typeError("Latitude must be a number"),
  longitude: Yup.number()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .typeError("Longitude must be a number"),
  description: Yup.string().max(1000, "Description is too long").nullable(),
  tags: Yup.array()
    .of(Yup.string().trim().min(1, "Tag cannot be empty"))
    .max(10, "Too many tags")
    .nullable(),
});

const useAttractionManagement = ({ setAttractions }) => {
  const [state, setState] = useState({
    isModalOpen: false,
    isEdit: false,
    selectedAttraction: null,
    isSubmitting: false,
    submissionError: null,
    image: { urls: [], previewUrls: [], error: null },
    tags: { list: [], error: null },
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("/api/tags/attractions");
        setState((prev) => ({
          ...prev,
          tags: { list: response.data || [], error: null },
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          tags: { list: [], error: "Failed to load suggested tags" },
        }));
      }
    };
    fetchTags();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      city_id: "",
      address: "",
      latitude: "",
      longitude: "",
      description: "",
      tags: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setState((prev) => ({
        ...prev,
        isSubmitting: true,
        submissionError: null,
      }));
      try {
        const formData = {
          ...values,
          city_id: Number(values.city_id),
          latitude: parseFloat(values.latitude) || null,
          longitude: parseFloat(values.longitude) || null,
          tags: values.tags?.map((tag) => tag.trim()).filter(Boolean) || [],
          image_url: state.image.urls || [],
        };

        if (state.isEdit) {
          await axios.put(
            `/attractions/${state.selectedAttraction?.attraction_id}`,
            formData
          );
        } else {
          await axios.post("/attractions", formData);
        }

        // Refresh attractions
        try {
          const response = await axios.get("/attractions");
          const parsedAttractions = response.data.map((attr) => ({
            ...attr,
            image_url:
              typeof attr.image_url === "string"
                ? JSON.parse(attr.image_url)
                : attr.image_url,
          }));
          setAttractions(parsedAttractions);
        } catch {
          console.error("Failed to refresh attractions");
        }

        setState((prev) => ({
          ...prev,
          isModalOpen: false,
          isEdit: false,
          selectedAttraction: null,
          image: { urls: [], previewUrls: [], error: null },
        }));
        resetForm();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          submissionError:
            error.response?.data?.message || "Failed to save attraction",
        }));
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
  });

  const handleOpenModal = useCallback(
    (attraction = null) => {
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
        isEdit: !!attraction,
        selectedAttraction: attraction,
        submissionError: null,
        image: { urls: [], previewUrls: [], error: null },
      }));

      if (attraction) {
        const imageUrls = Array.isArray(attraction.image_url)
          ? attraction.image_url
          : [];
        formik.setValues({
          name: attraction.name || "",
          city_id: Number(attraction.city_id) || "",
          address: attraction.address || "",
          latitude: parseFloat(attraction.latitude) || "",
          longitude: parseFloat(attraction.longitude) || "",
          description: attraction.description || "",
          tags: Array.isArray(attraction.tags)
            ? [...new Set(attraction.tags)]
            : [],
        });
        setState((prev) => ({
          ...prev,
          image: { urls: imageUrls, previewUrls: imageUrls, error: null },
        }));
      } else {
        formik.resetForm();
        setState((prev) => ({
          ...prev,
          image: { urls: [], previewUrls: [], error: null },
        }));
      }
    },
    [formik]
  );

  const handleCloseModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      isEdit: false,
      selectedAttraction: null,
      submissionError: null,
      image: { urls: [], previewUrls: [], error: null },
    }));
    formik.resetForm();
  }, [formik]);

  const handleFileChange = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (files.some((file) => file.size > maxSize)) {
      setState((prev) => ({
        ...prev,
        image: { ...prev.image, error: "Some files exceed 10MB limit" },
      }));
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const response = await axios.post("/attractions/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newUrls = Array.isArray(response.data.imageUrls)
        ? response.data.imageUrls
        : [];
      setState((prev) => ({
        ...prev,
        image: {
          urls: [...prev.image.urls, ...newUrls],
          previewUrls: [...prev.image.previewUrls, ...newUrls],
          error: null,
        },
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        image: { ...prev.image, error: "Failed to upload images" },
      }));
    }
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleTagChange = useCallback(
    (newValue) => {
      formik.setFieldValue("tags", [
        ...new Set(newValue.map((tag) => tag.trim()).filter(Boolean)),
      ]);
    },
    [formik]
  );

  const removeImage = useCallback((index) => {
    setState((prev) => {
      const newUrls = [...prev.image.urls];
      const newPreviewUrls = [...prev.image.previewUrls];
      newUrls.splice(index, 1);
      newPreviewUrls.splice(index, 1);
      return {
        ...prev,
        image: { urls: newUrls, previewUrls: newPreviewUrls, error: null },
      };
    });
  }, []);

  const deleteAttraction = useCallback(
    async (id) => {
      try {
        await axios.delete(`/attractions/${id}`);
        // Refresh attractions
        const response = await axios.get("/attractions");
        const parsedAttractions = response.data.map((attr) => ({
          ...attr,
          image_url:
            typeof attr.image_url === "string"
              ? JSON.parse(attr.image_url)
              : attr.image_url,
        }));
        setAttractions(parsedAttractions);
      } catch {
        console.error("Failed to delete attraction");
      }
    },
    [setAttractions]
  );

  return {
    isModalOpen: state.isModalOpen,
    isEdit: state.isEdit,
    selectedAttraction: state.selectedAttraction,
    handleOpenModal,
    handleCloseModal,
    isSubmitting: state.isSubmitting,
    submissionError: state.submissionError,
    formik,
    imageUrls: state.image.urls,
    previewUrls: state.image.previewUrls,
    imageError: state.image.error,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    setImageError: (error) =>
      setState((prev) => ({ ...prev, image: { ...prev.image, error } })),
    setImageUrls: (urls) =>
      setState((prev) => ({
        ...prev,
        image: { ...prev.image, urls, previewUrls: urls },
      })),
    removeImage,
    tagList: state.tags.list,
    tagError: state.tags.error,
    handleTagChange,
    deleteAttraction,
  };
};

export default useAttractionManagement;
