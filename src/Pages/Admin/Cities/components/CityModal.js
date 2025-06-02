import React, { useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { FaTimes, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageUpload from "./ImageUpload";

const citySchema = Yup.object().shape({
  name: Yup.string()
    .required("City name is required")
    .max(100, "City name must be 100 characters or less")
    .trim(),
  description: Yup.string()
    .max(2000, "Description must be 2000 characters or less")
    .nullable(),
});

const CityModal = ({
  isModalOpen,
  mode,
  city,
  imagePreviews,
  fileInputRef,
  onClose,
  onSave,
  onImageUpload,
  onRemoveImage,
}) => {
  const theme = useTheme();

  // Formik setup for form management
  const formik = useFormik({
    initialValues: {
      name: city?.name || "",
      description: city?.description || "",
    },
    validationSchema: citySchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSave({
          ...values,
          image_url: imagePreviews, // Match backend schema
        });
        formik.resetForm();
      } catch (error) {
        console.error("Error saving city:", error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  // Memoized close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    formik.resetForm();
    onClose();
  }, [formik, onClose]);

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="city-modal-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        id="city-modal-title"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {mode === "edit" ? "Edit City" : "Add New City"}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: "white", "&:hover": { bgcolor: "primary.dark" } }}
          aria-label="Close modal"
        >
          <FaTimes />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogContent sx={{ py: 4, px: 3, bgcolor: "grey.50" }}>
          <Grid container spacing={2}>
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <ImageUpload
                onImageUpload={onImageUpload}
                fileInputRef={fileInputRef}
                disabled={formik.isSubmitting}
              />
              {imagePreviews?.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    justifyContent: "center",
                  }}
                >
                  {imagePreviews.map((img, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      <Avatar
                        src={img}
                        variant="rounded"
                        sx={{
                          width: 80,
                          height: 80,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                        alt={`Preview ${index + 1}`}
                      />
                      <IconButton
                        size="small"
                        onClick={() => onRemoveImage(index)}
                        disabled={formik.isSubmitting}
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          bgcolor: "error.main",
                          color: "white",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <FaTrash size={12} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* City Name Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                disabled={formik.isSubmitting}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.dark",
                    },
                  },
                }}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            {/* Description Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  (formik.touched.description && formik.errors.description) ||
                  `${formik.values.description?.length || 0}/2000 characters`
                }
                variant="outlined"
                disabled={formik.isSubmitting}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.dark",
                    },
                  },
                }}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            bgcolor: "grey.100",
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            onClick={handleClose}
            color="inherit"
            startIcon={<FaTimes />}
            disabled={formik.isSubmitting}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            startIcon={mode === "edit" ? <FaSave /> : <FaPlus />}
            disabled={formik.isSubmitting || !formik.isValid}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s",
            }}
          >
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CityModal;
