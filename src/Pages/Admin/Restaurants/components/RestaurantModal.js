import React, { useCallback, useState } from "react";
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
  Switch,
  FormControlLabel,
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
  Phone,
  AccessTime,
} from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

const RestaurantModal = ({
  open,
  onClose,
  cities,
  isEdit,
  isSubmitting,
  formik,
  imageError,
  fileInputRef,
  handleFileChange,
  triggerFileInput,
  setImageError,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileChange(e);
  }, [handleFileChange]);

  const handleRemoveImage = (index) => {
    const newImages = formik.values.image_urls.filter((_, i) => i !== index);
    formik.setFieldValue("image_urls", newImages);
    if (imageError && newImages.length < 10) {
      setImageError(null);
    }
  };

  const handleAddUrl = () => {
    if (!newImageUrl.trim()) return;
    
    if (formik.values.image_urls.length >= 10) {
      setImageError("Maximum 10 images allowed");
      return;
    }
    
    // Basic URL validation
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(newImageUrl)) {
      setImageError("Please enter a valid URL");
      return;
    }
    
    formik.setFieldValue("image_urls", [
      ...formik.values.image_urls,
      newImageUrl.trim(),
    ]);
    setNewImageUrl("");
    setImageError(null);
  };

  const parseTimeString = (timeString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
  };

  const handleTimeChange = (field, newTime) => {
    if (!newTime) return;
    const formattedTime = format(newTime, "HH:mm");
    formik.setFieldValue(field, formattedTime);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid #eee", py: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="600">
            {isEdit ? "Update Restaurant" : "Add New Restaurant"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh" }}>
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
                  label="Restaurant Name *"
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

                <TextField
                  fullWidth
                  label="Phone Number *"
                  name="phone_number"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.phone_number &&
                    Boolean(formik.errors.phone_number)
                  }
                  helperText={
                    formik.touched.phone_number && formik.errors.phone_number
                  }
                  InputProps={{
                    startAdornment: (
                      <Phone sx={{ color: "action.active", mr: 1 }} />
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Latitude *"
                      name="latitude"
                      type="number"
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Longitude *"
                      name="longitude"
                      type="number"
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
                  <AccessTime sx={{ color: "primary.main", mr: 1 }} />
                  Operating Hours
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TimePicker
                        label="Opening Time"
                        value={parseTimeString(formik.values.open_time)}
                        onChange={(newTime) =>
                          handleTimeChange("open_time", newTime)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error:
                              formik.touched.open_time &&
                              Boolean(formik.errors.open_time),
                            helperText:
                              formik.touched.open_time &&
                              formik.errors.open_time,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TimePicker
                        label="Closing Time"
                        value={parseTimeString(formik.values.close_time)}
                        onChange={(newTime) =>
                          handleTimeChange("close_time", newTime)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error:
                              formik.touched.close_time &&
                              Boolean(formik.errors.close_time),
                            helperText:
                              formik.touched.close_time &&
                              formik.errors.close_time,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.reservation_required}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "reservation_required",
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  }
                  label="Reservation Required"
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
                  helperText="Example: italian, seafood, fine-dining"
                />
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="600">
                  <ImageIcon sx={{ color: "primary.main", mr: 1 }} />
                  Images (Max 10)
                </Typography>

                <Box
                  sx={{
                    border: `2px dashed ${dragActive ? "#2196f3" : "#ddd"}`,
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    minHeight: 100,
                    backgroundColor: dragActive ? "rgba(33,150,243,0.1)" : "inherit",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onClick={triggerFileInput}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <CloudUpload sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {formik.values.image_urls.length >= 10 
                      ? "Maximum number of images reached (10/10)" 
                      : `Drag and drop images or click to upload (${formik.values.image_urls.length}/10)`}
                  </Typography>
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={formik.values.image_urls.length >= 10}
                  />
                </Box>

                {imageError && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <Error fontSize="small" sx={{ mr: 0.5 }} />
                    {imageError}
                  </Typography>
                )}

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {formik.values.image_urls.map((url, index) => (
                    <Box key={index} sx={{ position: "relative" }}>
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100?text=Invalid+Image";
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          color: "error.main",
                          backgroundColor: "rgba(255,255,255,0.8)",
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Add image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddUrl();
                      }
                    }}
                    disabled={formik.values.image_urls.length >= 10}
                    InputProps={{
                      endAdornment: (
                        <Button
                          onClick={handleAddUrl}
                          disabled={!newImageUrl.trim() || formik.values.image_urls.length >= 10}
                        >
                          Add URL
                        </Button>
                      ),
                    }}
                  />
                </Box>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="600">
                  <Info sx={{ color: "primary.main", mr: 1 }} />
                  Description
                </Typography>
                <TextField
                  fullWidth
                  label="Restaurant Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid #eee", py: 2, px: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <Check />}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantModal;