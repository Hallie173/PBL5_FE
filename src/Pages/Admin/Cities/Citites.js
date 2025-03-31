import React from "react";
import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import CityTable from "./components/CityTable";
import CityModal from "./components/CityModal";
import { useCityManagement } from "./hooks/useCityManagement";
import initCities from "./constants/initCities";
export default function CityManagement() {
  const {
    cities,
    modalMode,
    currentCity,
    errors,
    imagePreview,
    fileInputRef,
    handleAdd,
    isModalOpen,
    handleEdit,
    handleDelete,
    saveCity,
    handleClose,
    handleChange,
    handleImageUpload,
    handleRemoveImage,
  } = useCityManagement(initCities);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">City Management</h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus />}
            onClick={handleAdd}
            sx={{
              minWidth: '150px'
            }}
          >
            Add City
          </Button>
        </div>
        <CityTable 
          cities={cities} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
      <CityModal
        isModalOpen={isModalOpen}
        mode={modalMode}
        city={currentCity}
        errors={errors}
        imagePreview={imagePreview}
        fileInputRef={fileInputRef}
        onClose={handleClose}
        onSave={saveCity}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
      />
    </div>
  );
}