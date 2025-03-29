// Pages/Admin/Users/components/UserModal.js
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { FaTimes, FaSave, FaUserPlus } from "react-icons/fa";
import AvatarUpload from "./AvatarUpload";

const UserModal = ({
  open,
  mode,
  user,
  errors,
  isModalOpen,
  avatarPreview,
  fileInputRef,
  onClose,
  onSave,
  onChange,
  onAvatarUpload,
  onRemoveAvatar,
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
          {mode === "edit" ? "Edit User" : "Add New User"}
        </DialogTitle>
      )}
      <DialogContent>
        <AvatarUpload
          avatarPreview={avatarPreview}
          errors={errors}
          fileInputRef={fileInputRef}
          onAvatarUpload={onAvatarUpload}
          onRemoveAvatar={onRemoveAvatar}
          currentAvatar={user?.avatar_url}
        />
        <TextField
          margin="dense"
          label="Username"
          fullWidth
          value={user?.username || ""}
          onChange={(e) => onChange("username", e.target.value)}
          error={!!errors.username}
          helperText={errors.username}
          required
        />
        <TextField
          margin="dense"
          label="Full Name"
          fullWidth
          value={user?.full_name || ""}
          onChange={(e) => onChange("full_name", e.target.value)}
          error={!!errors.full_name}
          helperText={errors.full_name}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          value={user?.email || ""}
          onChange={(e) => onChange("email", e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
        <TextField
          margin="dense"
          label="Bio"
          fullWidth
          multiline
          rows={3}
          value={user?.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Location Preference"
          fullWidth
          value={user?.location_preference || ""}
          onChange={(e) => onChange("location_preference", e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Role"
          fullWidth
          value={user?.role || "user"}
          onChange={(e) => onChange("role", e.target.value)}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          startIcon={<FaTimes />}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          color="primary"
          variant="contained"
          startIcon={mode === "edit" ? <FaSave /> : <FaUserPlus />}
        >
          {mode === "edit" ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
