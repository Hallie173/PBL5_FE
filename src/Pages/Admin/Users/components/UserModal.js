import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import defaultAvatar from "../../../../assets/images/default_avatar.jpg";
import { FaTimes, FaSave, FaUserPlus } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AvatarUpload from "./AvatarUpload";

const userSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  full_name: Yup.string(),
  bio: Yup.object().shape({
    currentCity: Yup.string(),
    about: Yup.string(),
    website: Yup.string().url("Invalid website URL"),
  }),
  role: Yup.string().oneOf(["user", "admin"]).default("user"),
  avatar_url: Yup.string().nullable(),
});

const UserModal = ({
  isModalOpen,
  mode,
  user,
  avatarPreview,
  fileInputRef,
  onClose,
  onSave,
  onAvatarUpload,
  onRemoveAvatar,
  loading,
  error,
}) => {
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState(null);

  // Fetch cities from API
  useEffect(() => {
    if (isModalOpen) {
      setCityLoading(true);
      axios
        .get("http://localhost:8080/cities/")
        .then(({ data }) => {
          setCities(data); // Assuming API returns an array of city objects with 'id' and 'name'
          setCityError(null);
        })
        .catch((err) => {
          setCityError("Failed to fetch cities");
          setCities([]);
        })
        .finally(() => {
          setCityLoading(false);
        });
    }
  }, [isModalOpen]);

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      full_name: user?.full_name || "",
      bio: {
        currentCity: user?.bio?.currentCity || "",
        about: user?.bio?.about || "",
        website: user?.bio?.website || "",
      },
      role: user?.role || "user",
      avatar_url: user?.avatar_url || null,
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      onSave(values);
    },
    enableReinitialize: true,
  });

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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {cityError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {cityError}
            </Alert>
          )}
          <AvatarUpload
            avatarPreview={avatarPreview}
            errors={
              error && error.includes("avatar")
                ? { avatar: error }
                : formik.errors
            }
            fileInputRef={fileInputRef}
            onAvatarUpload={onAvatarUpload}
            onRemoveAvatar={onRemoveAvatar}
            currentAvatar={user?.avatar_url || defaultAvatar}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
          <TextField
            select
            margin="dense"
            label="Current City"
            name="bio.currentCity"
            fullWidth
            value={formik.values.bio.currentCity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.bio?.currentCity &&
              Boolean(formik.errors.bio?.currentCity)
            }
            helperText={
              formik.touched.bio?.currentCity && formik.errors.bio?.currentCity
            }
            disabled={loading || cityLoading}
          >
            <MenuItem value="">
              <em>Select a city</em>
            </MenuItem>
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="About"
            name="bio.about"
            fullWidth
            multiline
            rows={3}
            value={formik.values.bio.about}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.bio?.about && Boolean(formik.errors.bio?.about)
            }
            helperText={formik.touched.bio?.about && formik.errors.bio?.about}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Website"
            name="bio.website"
            fullWidth
            value={formik.values.bio.website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.bio?.website && Boolean(formik.errors.bio?.website)
            }
            helperText={
              formik.touched.bio?.website && formik.errors.bio?.website
            }
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={mode === "edit" ? <FaSave /> : <FaUserPlus />}
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : mode === "edit" ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserModal;
