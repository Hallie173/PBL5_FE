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
import { useFormik } from "formik";
import * as Yup from "yup";
import AvatarUpload from "./AvatarUpload";

const userSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  full_name: Yup.string(),
  bio: Yup.string(),
  location_preference: Yup.string(),
  role: Yup.string().oneOf(["user", "admin"]).default("user"),
  avatar_url: Yup.string().nullable(),
});

const UserModal = ({
  open,
  mode,
  user,
  isModalOpen,
  avatarPreview,
  fileInputRef,
  onClose,
  onSave,
  onAvatarUpload,
  onRemoveAvatar,
}) => {
  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      full_name: user?.full_name || "",
      bio: user?.bio || "",
      location_preference: user?.location_preference || "",
      role: user?.role || "user",
      avatar_url: user?.avatar_url || null,
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      onSave({
        ...values,
        avatar_url: avatarPreview || values.avatar_url,
      });
    },
    enableReinitialize: true,
  });

  const handleAvatarChange = (event) => {
    onAvatarUpload(event);
    formik.setFieldValue("avatar_url", avatarPreview);
  };

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
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <AvatarUpload
            avatarPreview={avatarPreview}
            errors={formik.errors}
            fileInputRef={fileInputRef}
            onAvatarUpload={handleAvatarChange}
            onRemoveAvatar={onRemoveAvatar}
            currentAvatar={user?.avatar_url}
          />
          <TextField
            margin="dense"
            label="Username"
            name="username"
            fullWidth
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            required
          />
          <TextField
            margin="dense"
            label="Full Name"
            name="full_name"
            fullWidth
            value={formik.values.full_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.full_name && Boolean(formik.errors.full_name)}
            helperText={formik.touched.full_name && formik.errors.full_name}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            required
          />
          <TextField
            margin="dense"
            label="Bio"
            name="bio"
            fullWidth
            multiline
            rows={3}
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={formik.touched.bio && formik.errors.bio}
          />
          <TextField
            margin="dense"
            label="Location Preference"
            name="location_preference"
            fullWidth
            value={formik.values.location_preference}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.location_preference &&
              Boolean(formik.errors.location_preference)
            }
            helperText={
              formik.touched.location_preference &&
              formik.errors.location_preference
            }
          />
          <TextField
            select
            margin="dense"
            label="Role"
            name="role"
            fullWidth
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
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
            type="button"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={mode === "edit" ? <FaSave /> : <FaUserPlus />}
            type="submit"
          >
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserModal;