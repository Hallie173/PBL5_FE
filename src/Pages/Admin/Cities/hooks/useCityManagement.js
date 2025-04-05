import { useState, useRef, useCallback } from "react";

export const useCityManagement = (initialCities) => {
  const [cities, setCities] = useState(initialCities || []);
  const [modalState, setModalState] = useState({
    mode: null,
    isOpen: false,
    currentCity: null,
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const MAX_FILES = 10; // Đã cập nhật từ 5 lên 10
  const MAX_SIZE = 10 * 1024 * 1024; // Đã cập nhật từ 5MB lên 10MB
  const VALID_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  // Memoize handlers to prevent unnecessary re-renders
  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (files.length > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} images allowed`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!VALID_TYPES.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Allowed: JPEG, PNG, GIF, WebP`);
        return false;
      }
      if (file.size > MAX_SIZE) {
        alert(`File too large: ${file.name}. Max 10MB`);
        return false;
      }
      return true;
    });

    Promise.all(
      validFiles.map((file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
      )
    )
      .then((results) => {
        setImagePreviews((prev) => [...prev, ...results].slice(0, MAX_FILES));
      })
      .catch((error) => console.error("Image upload failed:", error));
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAdd = useCallback(() => {
    setModalState({
      mode: "add",
      isOpen: true,
      currentCity: {
        name: "",
        description: "",
        images: [],
        created_at: new Date().toISOString(),
      },
    });
    setImagePreviews([]);
  }, []);

  const handleEdit = useCallback((city) => {
    setModalState({
      mode: "edit",
      isOpen: true,
      currentCity: { ...city },
    });
    setImagePreviews(city.images || []);
  }, []);

  const saveCity = useCallback(
    (values) => {
      const cityData = {
        ...values,
        images: imagePreviews.length ? imagePreviews : values.images || [],
      };

      setCities((prevCities) => {
        if (modalState.mode === "add") {
          const newCityId =
            prevCities.length > 0
              ? Math.max(...prevCities.map((c) => c.city_id)) + 1
              : 1;
          return [
            ...prevCities,
            {
              ...cityData,
              city_id: newCityId,
              created_at: new Date().toISOString(),
            },
          ];
        }
        return prevCities.map((c) =>
          c.city_id === modalState.currentCity?.city_id
            ? { ...cityData, updated_at: new Date().toISOString() }
            : c
        );
      });
      handleClose();
    },
    [modalState.mode, modalState.currentCity, imagePreviews]
  );

  const handleDelete = useCallback((city_id) => {
    const cityToDelete = cities.find((c) => c.city_id === city_id);
    if (!cityToDelete) return;

    if (window.confirm(`Are you sure you want to delete ${cityToDelete.name}?`)) {
      setCities((prev) => prev.filter((c) => c.city_id !== city_id));
    }
  }, [cities]);

  const handleClose = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setTimeout(() => {
      setModalState({ mode: null, isOpen: false, currentCity: null });
      setImagePreviews([]);
    }, 300);
  }, []);

  return {
    cities,
    modalMode: modalState.mode,
    currentCity: modalState.currentCity,
    imagePreviews,
    fileInputRef,
    isModalOpen: modalState.isOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    saveCity,
    handleClose,
    handleImageUpload,
    handleRemoveImage,
  };
};