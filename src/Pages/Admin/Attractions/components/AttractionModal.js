import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Typography,
  IconButton,
  Grid,
  Divider,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Close,
  LocationOn,
  Info,
  Language,
  Check,
  LocalOffer,
  Delete,
  Image as ImageIcon,
} from "@mui/icons-material";
import ImageUpload from "./ImageUpload";

const AttractionModal = ({
  open,
  onClose,
  onSubmit,
  cities,
  initialData,
  isEdit,
  isSubmitting,
  formik,
  previewImage,
  imageError,
  uploadedFile,
  fileInputRef,
  handleFileChange,
  triggerFileInput,
  setImageError,
}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const imageFileInputRef = useRef(null);

  // Initialize images when modal opens with initial data
  useEffect(() => {
    if (initialData) {
      // Set primary image URL if exists
      if (initialData.image_url) {
        setImageUrls([initialData.image_url]);
      } else {
        setImageUrls([]);
      }

      // Add additional images if they exist
      if (
        initialData.additional_images &&
        Array.isArray(initialData.additional_images)
      ) {
        setImageUrls((prev) => [...prev, ...initialData.additional_images]);
      }
    } else {
      setImageUrls([]);
    }

    // Reset uploaded files when modal opens/closes
    setUploadedImages([]);
  }, [initialData, open]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file sizes (max 10MB)
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);

    if (validFiles.length < files.length) {
      setImageError(
        "Some files exceeded the 10MB size limit and were excluded"
      );
    }

    // Update state with new files
    setUploadedImages((prev) => [...prev, ...validFiles]);

    // Create object URLs for preview
    const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...newImageUrls]);

    // Reset file input
    e.target.value = null;
  };

  const removeImage = (index) => {
    // Remove from URLs array
    setImageUrls((prev) => prev.filter((_, i) => i !== index));

    // If it's an uploaded file, remove from uploadedImages too
    if (index < uploadedImages.length) {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit(e);

    if (formik.isValid) {
      // Prepare image data for submission
      const imageData = {
        imageUrls: imageUrls.filter((url) => !url.startsWith("blob:")), // Filter out blob URLs
        uploadedFiles: uploadedImages,
      };

      onSubmit({
        ...formik.values,
        images: imageData,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          overflow: "visible",
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid #eee", py: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="600">
            {isEdit ? "Update Attraction" : "Add New Attraction"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ overflowY: "auto", maxHeight: "70vh" }}>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="600">
                  <Info sx={{ color: "primary.main", mr: 1 }} />
                  Basic Information
                </Typography>

                <TextField
                  fullWidth
                  label="Attraction Name *"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>City *</InputLabel>
                  <Select
                    name="city_id"
                    value={formik.values.city_id}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.city_id && Boolean(formik.errors.city_id)
                    }
                    label="City *"
                  >
                    <MenuItem value="">Select a city</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city.city_id} value={city.city_id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.city_id && formik.errors.city_id && (
                    <Typography variant="caption" color="error">
                      {formik.errors.city_id}
                    </Typography>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="Address *"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                  InputProps={{
                    startAdornment: (
                      <LocationOn sx={{ color: "action.active", mr: 1 }} />
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Latitude *"
                      name="latitude"
                      type="number"
                      inputProps={{ step: "0.0001" }}
                      value={formik.values.latitude}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.latitude &&
                        Boolean(formik.errors.latitude)
                      }
                      helperText={
                        formik.touched.latitude && formik.errors.latitude
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Longitude *"
                      name="longitude"
                      type="number"
                      inputProps={{ step: "0.0001" }}
                      value={formik.values.longitude}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.longitude &&
                        Boolean(formik.errors.longitude)
                      }
                      helperText={
                        formik.touched.longitude && formik.errors.longitude
                      }
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="600">
                  <LocalOffer sx={{ color: "primary.main", mr: 1 }} />
                  Tags
                </Typography>
                <TextField
                  fullWidth
                  label="Enter tags (comma separated)"
                  name="tags"
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                  helperText="Example: tourism, food, history"
                />
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="600">
                  <Language sx={{ color: "primary.main", mr: 1 }} />
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  placeholder="Enter detailed description about the attraction..."
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Image Upload Section */}
              <Box mb={3}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  fontWeight="600"
                  sx={{ mb: 2 }}
                >
                  <ImageIcon sx={{ color: "primary.main", mr: 1 }} />
                  Images
                </Typography>

                <ImageUpload
                  multiple={true}
                  fileInputRef={imageFileInputRef}
                  onImageUpload={handleImageUpload}
                  disabled={isSubmitting}
                />

                {imageError && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {imageError}
                  </Typography>
                )}

                {/* Image Previews */}
                {imageUrls.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {imageUrls.length === 1
                        ? "1 Image Selected"
                        : `${imageUrls.length} Images Selected`}
                      {imageUrls.length > 0 && imageUrls.length <= 10 && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1, color: "text.secondary" }}
                        >
                          (First image will be used as the main image)
                        </Typography>
                      )}
                    </Typography>

                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      {imageUrls.map((url, index) => (
                        <Grid item xs={4} sm={3} key={index}>
                          <Box
                            sx={{
                              position: "relative",
                              borderRadius: 1,
                              overflow: "hidden",
                              height: 100,
                              border: "1px solid #eee",
                              "&:hover .delete-btn": {
                                opacity: 1,
                              },
                            }}
                          >
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/150?text=Error";
                              }}
                            />
                            {index === 0 && (
                              <Chip
                                label="Main"
                                size="small"
                                color="primary"
                                sx={{
                                  position: "absolute",
                                  top: 5,
                                  left: 5,
                                  fontSize: "0.7rem",
                                }}
                              />
                            )}
                            <IconButton
                              className="delete-btn"
                              onClick={() => removeImage(index)}
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                bgcolor: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                p: 0.5,
                                opacity: 0,
                                transition: "opacity 0.2s",
                                "&:hover": {
                                  bgcolor: "rgba(0, 0, 0, 0.7)",
                                },
                              }}
                              size="small"
                              disabled={isSubmitting}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          <DialogActions sx={{ borderTop: "1px solid #eee", mt: 3, py: 2 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <Check />
              }
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AttractionModal;
