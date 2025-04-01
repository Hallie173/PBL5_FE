import React from "react";
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
} from "@mui/material";
import {
  Close,
  LocationOn,
  Image as ImageIcon,
  LocalOffer,
  Info,
  Language,
  Check,
  Error,
  CloudUpload,
} from "@mui/icons-material";
import useAttractionManagement from "../hooks/useAttractionManagement";

const AttractionModal = ({ open, onClose, onSubmit, cities, initialData }) => {
  const {
    isEdit,
    isSubmitting,
    previewImage,
    imageError,
    uploadedFile,
    fileInputRef,
    formik,
    handleImageUrlChange,
    handleFileChange,
    triggerFileInput,
    setImageError,
  } = useAttractionManagement({ initialData, onSubmit, onClose });

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
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
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
                  <ImageIcon sx={{ color: "primary.main", mr: 1 }} />
                  Image
                </Typography>

                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: imageError ? "error.main" : "divider",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    position: "relative",
                    minHeight: 200,
                    backgroundImage: `url(${previewImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={triggerFileInput}
                >
                  {!previewImage && (
                    <>
                      <CloudUpload
                        sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        Drag and drop image or click to upload
                      </Typography>
                    </>
                  )}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </Box>

                {imageError && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    <Error
                      fontSize="small"
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                    />
                    Failed to load image
                  </Typography>
                )}

                <TextField
                  fullWidth
                  label="Or enter image URL"
                  name="image_url"
                  value={formik.values.image_url}
                  onChange={handleImageUrlChange}
                  disabled={!!uploadedFile}
                  sx={{ mt: 2 }}
                  InputProps={{
                    startAdornment: (
                      <Language sx={{ color: "action.active", mr: 1 }} />
                    ),
                  }}
                />
              </Box>

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
