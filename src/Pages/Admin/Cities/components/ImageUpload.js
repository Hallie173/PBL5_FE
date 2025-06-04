import React, { useCallback, useState } from "react";
import {
  Button,
  Typography,
  Stack,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";

const ImageUpload = ({
  multiple = true,
  fileInputRef,
  onImageUpload,
  disabled = false,
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Xử lý sự kiện drag-and-drop
  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled || !onImageUpload) return;

      const files = Array.from(e.dataTransfer.files);
      if (!validateFiles(files)) return;
      onImageUpload({ target: { files } });
    },
    [disabled, onImageUpload]
  );

  // Xử lý click để mở file input
  const handleClick = useCallback(() => {
    if (!fileInputRef.current || disabled) {
      console.warn("File input ref is not available or upload is disabled");
      return;
    }
    fileInputRef.current.click();
    // Reset giá trị input để cho phép chọn lại cùng file
    fileInputRef.current.value = null;
  }, [fileInputRef, disabled]);

  // Kiểm tra file hợp lệ
  const validateFiles = (files) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = multiple ? 10 : 1;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} file(s) allowed`);
      return false;
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG, PNG, GIF, and WebP files are supported");
        return false;
      }
      if (file.size > maxSize) {
        setError("Each file must be less than 10MB");
        return false;
      }
    }
    setError(null);
    return true;
  };

  // Xử lý khi chọn file
  const handleFileChange = useCallback(
    (e) => {
      if (disabled || !onImageUpload) return;
      const files = Array.from(e.target.files);
      if (validateFiles(files)) {
        setIsLoading(true);
        onImageUpload(e).finally(() => setIsLoading(false));
      }
    },
    [disabled, onImageUpload]
  );

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{ width: "100%", maxWidth: 400, mx: "auto" }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          p: 4,
          border: `2px dashed ${
            disabled ? theme.palette.grey[400] : theme.palette.primary.main
          }`,
          borderRadius: 3,
          bgcolor: isDragging
            ? "primary.lighter"
            : disabled
            ? "grey.100"
            : "primary.lightest",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: disabled ? "grey.100" : "primary.lighter",
            borderColor: disabled ? "grey.400" : "primary.dark",
            transform: disabled ? "none" : "scale(1.02)",
          },
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple={multiple}
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
          disabled={disabled}
          id="image-upload-input"
          aria-label={multiple ? "Upload multiple images" : "Upload an image"}
          aria-describedby="image-upload-desc"
        />
        <Stack spacing={2} alignItems="center">
          {isLoading ? (
            <CircularProgress size={48} />
          ) : (
            <FaCloudUploadAlt
              size={48}
              color={
                disabled ? theme.palette.grey[500] : theme.palette.primary.main
              }
            />
          )}
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<FaCloudUploadAlt />}
            onClick={handleClick}
            disabled={disabled || isLoading}
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
                transform: disabled || isLoading ? "none" : "translateY(-2px)",
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
            id="image-upload-desc"
          >
            {multiple
              ? "Drag & drop or click to upload images"
              : "Drag & drop or click to upload an image"}
          </Typography>
        </Stack>
      </Box>
      <Typography
        variant="caption"
        color={error ? "error.main" : "text.secondary"}
        sx={{
          fontStyle: "italic",
          bgcolor: error ? "error.light" : "grey.100",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
        }}
      >
        {error ||
          (multiple
            ? "Supports: JPEG, PNG, GIF, WebP (max 10 files, 10MB each)"
            : "Supports: JPEG, PNG, GIF, WebP (max 10MB)")}
      </Typography>
    </Stack>
  );
};

export default ImageUpload;
