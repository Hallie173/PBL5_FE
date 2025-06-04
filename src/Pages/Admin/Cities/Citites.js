import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CityList from "./components/CityList";
import CityModal from "./components/CityModal";
import { useCityManagement } from "./hooks/useCityManagement";

export default function CityManagement() {
  const theme = useTheme();
  const {
    cities,
    isModalOpen,
    modalMode,
    currentCity,
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
  } = useCityManagement();

  const [searchQuery, setSearchQuery] = useState("");

  const onSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    handleSearch("");
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 4, bgcolor: "grey.50" }}>
      <ToastContainer position="top-right" autoClose={3000} />
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
            <Typography variant="h4" fontWeight={700} color="primary.main">
              City Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mt={1}>
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
          mb: 4,
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search cities by name..."
          value={searchQuery}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch color={theme.palette.text.secondary} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={clearSearch}
                  size="small"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              bgcolor: "white",
              "&:hover": { boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)" },
              "&.Mui-focused": {
                boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.3)",
              },
            },
          }}
          inputProps={{ maxLength: 100 }}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="body2" mt={3}>
              Loading cities...
            </Typography>
          </Box>
        ) : (
          <CityList
            cities={cities}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Paper>

      <CityModal
        isModalOpen={isModalOpen}
        mode={modalMode}
        city={currentCity}
        imagePreviews={imagePreviews}
        fileInputRef={fileInputRef}
        onClose={handleClose}
        onSave={handleSave}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
      />
    </Box>
  );
}
