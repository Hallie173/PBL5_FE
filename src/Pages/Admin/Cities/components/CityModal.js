import React from "react";
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
    .max(100, "City name must be less than 100 characters"),
  description: Yup.string().max(500, "Description too long"),
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

  const formik = useFormik({
    initialValues: {
      name: city?.name || "",
      description: city?.description || "",
    },
    validationSchema: citySchema,
    onSubmit: (values) => {
      onSave({
        ...values,
        images: imagePreviews,
      });
    },
    enableReinitialize: true,
  });

  return (
    <Dialog
      open={isModalOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
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
          onClick={onClose}
          sx={{ color: "white", "&:hover": { bgcolor: "primary.dark" } }}
        >
          <FaTimes />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ py: 4, px: 3, bgcolor: "grey.50" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ImageUpload
                onImageUpload={onImageUpload}
                fileInputRef={fileInputRef}
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
                          width: 100,
                          height: 100,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => onRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          bgcolor: "error.main",
                          color: "white",
                          "&:hover": { bgcolor: "error.dark" },
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <FaTrash size={14} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>

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
                  formik.touched.description && formik.errors.description
                }
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                  },
                }}
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
            onClick={onClose}
            color="inherit"
            startIcon={<FaTimes />}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "grey.200",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            startIcon={mode === "edit" ? <FaSave /> : <FaPlus />}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
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