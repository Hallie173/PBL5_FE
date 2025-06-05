import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import axios from "axios";
import BASE_URL from "../../../../constants/BASE_URL";
const API_BASE_URL = `${BASE_URL}/users`; // Adjust to your backend URL

export const useUserManagement = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Fetch all users (admin only)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/");
        setUsers(data);
      } catch (err) {
        if (err.response?.status === 401) logout();
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") fetchUsers();
  }, [user, logout]);

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return { avatar: "No file selected" };

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) return { avatar: "Invalid file type" };
    if (file.size > maxSize) return { avatar: "File too large. Max 5MB" };

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await axiosInstance.post("/upload-avatar", formData);
      return { avatar_url: data.avatar_url };
    } catch (err) {
      return {
        avatar: err.response?.data?.message || "Failed to upload avatar",
      };
    }
  };

  // Remove avatar preview
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Open modal for adding a user
  const handleAdd = () => {
    setCurrentUser({
      username: "",
      email: "",
      full_name: "",
      avatar_url: "",
      bio: "",
      location_preference: "",
      role: "user",
      created_at: new Date().toISOString(),
    });
    setModalMode("add");
    setIsModalOpen(true);
    setAvatarPreview(null);
    setError(null);
  };

  // Open modal for editing a user
  const handleEdit = async (user_id) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/${user_id}`);
      setCurrentUser(data);
      setModalMode("edit");
      setIsModalOpen(true);
      setAvatarPreview(data.avatar_url);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Save new user
  const saveNewUser = async (values) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/", {
        ...values,
        avatar_url: avatarPreview || values.avatar_url,
      });
      setUsers([...users, data]);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Update existing user
  const updateUser = async (values) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`/${currentUser.user_id}`, {
        ...values,
        bio: JSON.stringify(values.bio),
        avatar_url: avatarPreview || values.avatar_url,
        avatar: fileInputRef.current?.files[0],
      });
      setUsers(users.map((u) => (u.user_id === data.user_id ? data : u)));
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (user_id) => {
    const userToDelete = users.find((u) => u.user_id === user_id);
    if (
      window.confirm(
        `Are you sure you want to delete user ${userToDelete.full_name}?`
      )
    ) {
      setLoading(true);
      try {
        await axiosInstance.delete(`/${user_id}`);
        setUsers(users.filter((u) => u.user_id !== user_id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user");
      } finally {
        setLoading(false);
      }
    }
  };

  // Close modal
  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalMode(null);
      setCurrentUser(null);
      setAvatarPreview(null);
      setError(null);
    }, 300);
  };

  return {
    users,
    modalMode,
    currentUser,
    avatarPreview,
    fileInputRef,
    handleAdd,
    handleEdit,
    handleDelete,
    saveNewUser,
    updateUser,
    isModalOpen,
    handleClose,
    handleAvatarUpload,
    handleRemoveAvatar,
    loading,
    error,
  };
};
