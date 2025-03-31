import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,

} from "@mui/material";
import { FaTimes, FaSave, FaPlus } from "react-icons/fa";
import ImageUpload from "./ImageUpload";

const CityModal = ({
  isModalOpen,
  mode,
  city,
  errors,
  imagePreview,
  fileInputRef,
  onClose,
  onSave,
  onChange,
  onImageUpload,
  onRemoveImage,
}) => {
  return (
    <Dialog open={isModalOpen} onClose={onClose} fullWidth maxWidth="sm">
      {mode && (
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            padding: "16px 24px",
            fontSize: "1.25rem",
            fontWeight: 500,
          }}
        >
          {mode === "edit" ? "Edit City" : "Add New City"}
        </DialogTitle>
      )}
      
      <DialogContent sx={{ pt: 3 }}>
        <ImageUpload
          imagePreview={imagePreview}
          errors={errors}
          fileInputRef={fileInputRef}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          currentImage={city?.image_url}
        />
        
        <TextField
          margin="dense"
          label="City Name"
          fullWidth
          value={city?.name || ""}
          onChange={(e) => onChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          required
          sx={{ mt: 2 }}
        />
        
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={city?.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          startIcon={<FaTimes />}
          sx={{ minWidth: 120 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          color="primary"
          variant="contained"
          startIcon={mode === "edit" ? <FaSave /> : <FaPlus />}
          sx={{ minWidth: 120, ml: 2 }}
        >
          {mode === "edit" ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CityModal;