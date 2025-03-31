// Pages/Admin/Users/components/AvatarUpload.js
import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { FaUserCircle, FaCloudUploadAlt } from "react-icons/fa";

const AvatarUpload = ({
  avatarPreview,
  errors,
  fileInputRef,
  onAvatarUpload,
  onRemoveAvatar,
  currentAvatar,
}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
      <Box
        position="relative"
        mb={2}
        mt={2}
        sx={{
          width: 180,
          height: 180,
          border: "3px dashed",
          borderColor: errors.avatar ? "error.main" : "grey.300",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        {avatarPreview || currentAvatar ? (
          <Avatar
            src={avatarPreview || currentAvatar}
            alt="Avatar Preview"
            sx={{ width: 170, height: 170, border: "4px solid white" }}
          />
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" color="grey.500">
            <FaUserCircle size={100} />
            <Typography variant="body2" mt={1}>No Avatar</Typography>
          </Box>
        )}
        <input
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          id="avatar-upload"
          type="file"
          onChange={onAvatarUpload}
        />
        <label
          htmlFor="avatar-upload"
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
            <Typography variant="body2">Upload Avatar</Typography>
          </Box>
        </label>
      </Box>
      {errors.avatar && (
        <Typography color="error" variant="body2" textAlign="center" mb={1}>
          {errors.avatar}
        </Typography>
      )}
      {(avatarPreview || currentAvatar) && (
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          onClick={onRemoveAvatar}
          sx={{ mb: 2 }}
        >
          Remove Avatar
        </Button>
      )}
    </Box>
  );
};

export default AvatarUpload;