import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import BASE_URL from "../../../../constants/BASE_URL";

export const useCityManagement = () => {
  const [cities, setCities] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, mode: null, city: null });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = `${BASE_URL}/cities`;
  const MAX_FILES = 10;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const VALID_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  // Debounced search
  const handleSearch = useCallback(
    debounce((query) => setSearchQuery(query.trim()), 300),
    []
  );

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      if (searchQuery.length > 100) {
        toast.warn("Search query cannot exceed 100 characters");
        setCities([]);
        return;
      }

      setIsLoading(true);
      try {
        const url = searchQuery
          ? `${API_URL}/search/${encodeURIComponent(searchQuery)}`
          : API_URL;
        const { data } = await axios.get(url);
        const cities = Array.isArray(data) ? data : data?.data || [];
        setCities(cities);
        if (!cities.length && searchQuery) toast.info("No cities found");
      } catch (error) {
        setCities([]);
        toast.error(error.response?.data?.message || "Failed to fetch cities");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, [searchQuery]);

  // Image upload
  const handleImageUpload = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;

      if (files.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} images allowed`);
        return;
      }

      const validFiles = files.filter((file) => {
        if (!VALID_TYPES.includes(file.type)) {
          toast.error(`Invalid file type: ${file.name}`);
          return false;
        }
        if (file.size > MAX_SIZE) {
          toast.error(`File ${file.name} too large (max 10MB)`);
          return false;
        }
        return true;
      });

      try {
        const previews = await Promise.all(
          validFiles.map(
            (file) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
              })
          )
        );

        setImagePreviews((prev) => [...prev, ...previews].slice(0, MAX_FILES));

        const formData = new FormData();
        validFiles.forEach((file) => formData.append("images", file));
        const { data } = await axios.post(`${API_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setImagePreviews((prev) =>
          [
            ...prev.filter((url) => !url.startsWith("data:")),
            ...data.imageUrls,
          ].slice(0, MAX_FILES)
        );
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to upload images");
      }
    },
    [API_URL]
  );

  // Remove image
  const handleRemoveImage = useCallback((index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Add city
  const handleAdd = () => {
    setModal({
      isOpen: true,
      mode: "add",
      city: { city_id: null, name: "", description: "", image_url: [] },
    });
    setImagePreviews([]);
  };

  // Edit city
  const handleEdit = useCallback((city) => {
    setModal({
      isOpen: true,
      mode: "edit",
      city: {
        city_id: city.city_id,
        name: city.name || "",
        description: city.description || "",
        image_url: Array.isArray(city.image_url) ? city.image_url : [],
      },
    });
    setImagePreviews(Array.isArray(city.image_url) ? city.image_url : []);
  }, []);

  // Save city
  const handleSave = useCallback(
    async (values) => {
      const cityData = {
        name: values.name?.trim() || "",
        description: values.description?.trim() || "",
        image_url: JSON.stringify(
          imagePreviews.filter((url) => !url.startsWith("data:"))
        ), // Send only Cloudinary URLs
      };

      if (!cityData.name) {
        toast.error("City name is required");
        return;
      }

      setIsLoading(true);
      try {
        if (modal.mode === "add") {
          const { data } = await axios.post(API_URL, cityData);
          setCities((prev) => [...prev, data]);
          toast.success("City added");
        } else {
          const { data } = await axios.put(
            `${API_URL}/${modal.city.city_id}`,
            cityData
          );
          setCities((prev) =>
            prev.map((c) => (c.city_id === modal.city.city_id ? data : c))
          );
          toast.success("City updated");
        }
        handleClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to save city");
      } finally {
        setIsLoading(false);
      }
    },
    [modal.mode, modal.city, imagePreviews, API_URL]
  );

  // Delete city
  const handleDelete = useCallback(
    async (cityId) => {
      const city = cities.find((c) => c.city_id === cityId);
      if (!city) return;

      if (!window.confirm(`Delete ${city.name}?`)) return;

      setIsLoading(true);
      try {
        await axios.delete(`${API_URL}/${cityId}`);
        setCities((prev) => prev.filter((c) => c.city_id !== cityId));
        toast.success("City deleted");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete city");
      } finally {
        setIsLoading(false);
      }
    },
    [cities, API_URL]
  );

  // Close modal
  const handleClose = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      setModal({ isOpen: false, mode: null, city: null });
      setImagePreviews([]);
    }, 300);
  }, []);

  return {
    cities,
    isModalOpen: modal.isOpen,
    modalMode: modal.mode,
    currentCity: modal.city,
    imagePreviews,
    fileInputRef,
    isLoading,
    handleSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleClose,
    handleImageUpload,
    handleRemoveImage,
  };
};
