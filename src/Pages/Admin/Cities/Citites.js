import React from "react";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import CityList from "./components/CityList";
import CityModal from "./components/CityModal";
import { useCityManagement } from "./hooks/useCityManagement";
import initCities from "./constants/initCities";

export default function CityManagement() {
  const theme = useTheme();
  const {
    cities,
    modalMode,
    currentCity,
    imagePreviews,
    fileInputRef,
    handleAdd,
    isModalOpen,
    handleEdit,
    handleDelete,
    saveCity,
    handleClose,
    handleImageUpload,
    handleRemoveImage,
  } = useCityManagement(initCities);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        bgcolor: "grey.50",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          mb: 4,
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="primary.main"
            >
              City Management
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Manage cities across Vietnam
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus />}
            onClick={handleAdd}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 3,
              "&:hover": {
                boxShadow: 5,
                transform: "translateY(-2px)",
                transition: "all 0.3s",
              },
            }}
          >
            Add City
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <CityList cities={cities} onEdit={handleEdit} onDelete={handleDelete} />
      </Paper>

      <CityModal
        isModalOpen={isModalOpen}
        mode={modalMode}
        city={currentCity}
        imagePreviews={imagePreviews}
        fileInputRef={fileInputRef}
        onClose={handleClose}
        onSave={saveCity}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
      />
    </Box>
  );
}
