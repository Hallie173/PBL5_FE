import React, { useCallback } from "react";
import { Button, Typography, Stack, Box, useTheme } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";

const ImageUpload = ({
  multiple = true,
  fileInputRef,
  onImageUpload,
  disabled = false,
}) => {
  const theme = useTheme();

  const handleClick = useCallback(() => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  }, [fileInputRef, disabled]);

  return (
    <Stack spacing={2} alignItems="center" sx={{ width: "100%", maxWidth: 400 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          p: 4,
          border: `2px dashed ${disabled ? theme.palette.grey[400] : theme.palette.primary.main}`,
          borderRadius: 3,
          bgcolor: disabled ? "grey.100" : "primary.lightest",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: disabled ? "grey.100" : "primary.lighter",
            borderColor: disabled ? "grey.400" : "primary.dark",
            transform: disabled ? "none" : "scale(1.02)",
          },
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple={multiple}
          onChange={onImageUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
          disabled={disabled}
          aria-label={multiple ? "Upload multiple images" : "Upload an image"}
        />
        <Stack spacing={2} alignItems="center">
          <FaCloudUploadAlt 
            size={48} 
            color={disabled ? theme.palette.grey[500] : theme.palette.primary.main}
          />
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<FaCloudUploadAlt />}
            onClick={handleClick}
            disabled={disabled}
            sx={{
              py: 1,
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                transform: disabled ? "none" : "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {multiple ? "Choose Images" : "Choose Image"}
          </Button>
          <Typography
            variant="body2"
            color={disabled ? "text.disabled" : "text.secondary"}
            sx={{ textAlign: "center" }}
          >
            {multiple
              ? "Drag & drop or click to upload images"
              : "Drag & drop or click to upload an image"}
          </Typography>
        </Stack>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ 
          fontStyle: "italic",
          bgcolor: "grey.100",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
        }}
      >
        {multiple
          ? "Supports: JPEG, PNG, GIF, WebP (max 5 files, 5MB each)"
          : "Supports: JPEG, PNG, GIF, WebP (max 5MB)"}
      </Typography>
    </Stack>
  );
};

export default ImageUpload;