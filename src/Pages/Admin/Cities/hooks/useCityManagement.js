import { useState, useRef } from "react";

export const useCityManagement = (initialCities) => {
  const [cities, setCities] = useState(initialCities);
  const [modalMode, setModalMode] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const validateForm = (city) => {
    const newErrors = {};
    if (!city.name || city.name.trim() === "")
      newErrors.name = "City name is required";
    else if (city.name.length > 100)
      newErrors.name = "City name must be less than 100 characters";
    
    const isDuplicateName = cities.some(
      (c) => 
        c.name.toLowerCase() === city.name.toLowerCase() && 
        c.city_id !== city.city_id
    );
    if (isDuplicateName) newErrors.name = "City name already exists";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    setErrors((prev) => ({ ...prev, image: undefined }));
    
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP",
      }));
      return;
    }
    
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, image: "File too large. Max 5MB" }));
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setCurrentCity((prev) => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setCurrentCity((prev) => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAdd = () => {
    setCurrentCity({
      name: "",
      description: "",
      image_url: "",
      created_at: new Date().toISOString(),
    });
    setModalMode("add");
    setIsModalOpen(true);
    setImagePreview(null);
    setErrors({});
  };

  const handleEdit = (city) => {
    setCurrentCity({ ...city });
    setModalMode("edit");
    setIsModalOpen(true);
    setImagePreview(city.image_url);
    setErrors({});
  };

  const saveCity = () => {
    if (!validateForm(currentCity)) return;

    if (modalMode === "add") {
      const newCity = {
        ...currentCity,
        city_id: Math.max(...cities.map((c) => c.city_id), 0) + 1,
        created_at: new Date().toISOString(),
        image_url: imagePreview || ""
      };
      setCities([...cities, newCity]);
    } else {
      setCities(
        cities.map((c) =>
          c.city_id === currentCity.city_id
            ? { 
                ...currentCity, 
                updated_at: new Date().toISOString(),
                image_url: imagePreview || currentCity.image_url
              }
            : c
        )
      );
    }
    handleClose();
  };

  const handleDelete = (city_id) => {
    const cityToDelete = cities.find((c) => c.city_id === city_id);
    if (
      window.confirm(
        `Are you sure you want to delete ${cityToDelete.name}?`
      )
    ) {
      setCities(cities.filter((c) => c.city_id !== city_id));
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalMode(null);
      setCurrentCity(null);
      setErrors({});
      setImagePreview(null);
    }, 300);
  };

  const handleChange = (field, value) => {
    setCurrentCity((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    cities,
    modalMode,
    currentCity,
    errors,
    imagePreview,
    fileInputRef,
    isModalOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    saveCity,
    handleClose,
    handleChange,
    handleImageUpload,
    handleRemoveImage,
  };
};