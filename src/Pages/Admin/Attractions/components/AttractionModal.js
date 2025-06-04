import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Typography,
  IconButton,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import {
  Close,
  LocationOn,
  Check,
  Delete,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import ImageUpload from "./ImageUpload";

const AttractionModal = ({
  open,
  onClose,
  onSubmit,
  cities,
  isEdit,
  isSubmitting,
  formik,
  previewUrls,
  imageError,
  imageUrls,
  fileInputRef,
  handleFileChange,
  triggerFileInput,
  setImageError,
  setImageUrls,
  removeImage,
  tagList,
  tagError,
  handleTagChange,
}) => {
  const [currentImagePage, setCurrentImagePage] = useState(1);
  const imagesPerPage = 6;

  const totalImagePages = Math.ceil(previewUrls.length / imagesPerPage);
  const startImageIndex = (currentImagePage - 1) * imagesPerPage;
  const currentImages = previewUrls.slice(
    startImageIndex,
    startImageIndex + imagesPerPage
  );

  const handleImagePageChange = useCallback(
    (page) => {
      setCurrentImagePage(Math.max(1, Math.min(page, totalImagePages)));
    },
    [totalImagePages]
  );

  const imageContainerSx = {
    position: "relative",
    borderRadius: 1,
    overflow: "hidden",
    aspectRatio: "4/3",
    boxShadow: 1,
    transition: "transform 0.2s",
    "&:hover": { transform: "scale(1.02)" },
  };

  const deleteButtonSx = {
    position: "absolute",
    top: 6,
    right: 6,
    bgcolor: "error.main",
    color: "#fff",
    p: 0.5,
    "&:hover": { bgcolor: "error.dark" },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ py: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {isEdit ? "Update Attraction" : "Add New Attraction"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                InputProps={{
                  startAdornment: (
                    <LocationOn sx={{ color: "primary", mr: 1 }} />
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
                      formik.touched.latitude && Boolean(formik.errors.latitude)
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
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Tags
                </Typography>
                <Autocomplete
                  multiple
                  freeSolo
                  options={tagList || []}
                  value={formik.values.tags || []}
                  onChange={(event, newValue) => handleTagChange(newValue)}
                  disabled={isSubmitting}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Type a tag and press Enter"
                      error={
                        (formik.touched.tags && Boolean(formik.errors.tags)) ||
                        Boolean(tagError)
                      }
                      helperText={
                        tagError ||
                        (formik.touched.tags && formik.errors.tags) ||
                        (tagList.length === 0
                          ? "No suggested tags available"
                          : "Add tags")
                      }
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        size="small"
                        {...getTagProps({ index })}
                        disabled={isSubmitting}
                      />
                    ))
                  }
                  sx={{ mb: 2 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                placeholder="Enter description..."
                sx={{ mb: 2 }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                Images
              </Typography>
              <ImageUpload
                multiple={true}
                fileInputRef={fileInputRef}
                onImageUpload={handleFileChange}
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
              {previewUrls.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Preview Images
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {currentImages.map((url, index) => (
                      <Grid item xs={4} key={startImageIndex + index}>
                        <Box sx={imageContainerSx}>
                          <img
                            src={url}
                            alt={`Image ${startImageIndex + index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) =>
                              (e.target.src =
                                "https://via.placeholder.com/150?text=No+Image")
                            }
                          />
                          <IconButton
                            onClick={() => {
                              removeImage(startImageIndex + index);
                              if (
                                currentImages.length === 1 &&
                                currentImagePage > 1
                              ) {
                                setCurrentImagePage(currentImagePage - 1);
                              }
                            }}
                            sx={deleteButtonSx}
                            size="small"
                            disabled={isSubmitting}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  {previewUrls.length > imagesPerPage && (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{ mt: 2 }}
                    >
                      <IconButton
                        onClick={() =>
                          handleImagePageChange(currentImagePage - 1)
                        }
                        disabled={currentImagePage === 1}
                        size="small"
                      >
                        <ChevronLeft />
                      </IconButton>
                      {Array.from(
                        { length: totalImagePages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Button
                          key={page}
                          onClick={() => handleImagePageChange(page)}
                          variant={
                            currentImagePage === page ? "contained" : "outlined"
                          }
                          size="small"
                          sx={{ minWidth: 32, px: 0.5 }}
                        >
                          {page}
                        </Button>
                      ))}
                      <IconButton
                        onClick={() =>
                          handleImagePageChange(currentImagePage + 1)
                        }
                        disabled={currentImagePage === totalImagePages}
                        size="small"
                      >
                        <ChevronRight />
                      </IconButton>
                    </Stack>
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Showing {startImageIndex + 1}-
                    {Math.min(
                      startImageIndex + imagesPerPage,
                      previewUrls.length
                    )}{" "}
                    of {previewUrls.length} images
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ py: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <Check />}
          onClick={onSubmit}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AttractionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      city_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  isEdit: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  formik: PropTypes.object.isRequired,
  previewUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageError: PropTypes.string,
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileInputRef: PropTypes.object.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  triggerFileInput: PropTypes.func.isRequired,
  setImageError: PropTypes.func.isRequired,
  setImageUrls: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
  tagList: PropTypes.arrayOf(PropTypes.string),
  tagError: PropTypes.string,
  handleTagChange: PropTypes.func.isRequired,
};

export default AttractionModal;
