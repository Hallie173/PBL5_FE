import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { FaImage, FaCloudUploadAlt } from "react-icons/fa";

const ImageUpload = ({
  imagePreview,
  errors,
  fileInputRef,
  onImageUpload,
  onRemoveImage,
  currentImage,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mb={3}
      mt={3}
    >
      <Box
        position="relative"
        mb={2}
        sx={{
          width: 180,
          height: 180,
          border: "3px dashed",
          borderColor: errors.image ? "error.main" : "grey.300",
          borderRadius: "4px", // Khác biệt chính: bo góc vuông thay vì hình tròn
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        {imagePreview || currentImage ? (
          <Avatar
            src={imagePreview || currentImage}
            alt="Image Preview"
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "4px",
              objectFit: "cover",
            }}
            variant="rounded"
          />
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            color="grey.500"
          >
            <FaImage size={100} />
            <Typography variant="body2" mt={1}>
              No Image
            </Typography>
          </Box>
        )}
        <input
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          type="file"
          onChange={onImageUpload}
        />
        <label
          htmlFor="image-upload"
          className="hover:opacity-100"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            opacity: 0,
            transition: "opacity 0.3s ease",
            cursor: "pointer",
          }}
        >
          <Box textAlign="center">
            <FaCloudUploadAlt size={50} />
            <Typography variant="body2">Upload Image</Typography>
          </Box>
        </label>
      </Box>
      {errors.image && (
        <Typography color="error" variant="body2" textAlign="center" mb={1}>
          {errors.image}
        </Typography>
      )}
      {(imagePreview || currentImage) && (
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          onClick={onRemoveImage}
          sx={{ mb: 2 }}
        >
          Remove Image
        </Button>
      )}
    </Box>
  );
};

export default ImageUpload;
