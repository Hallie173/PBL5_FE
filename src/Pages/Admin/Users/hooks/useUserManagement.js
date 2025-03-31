import { useState, useRef } from "react";

export const useUserManagement = (initialUsers) => {
  const [users, setUsers] = useState(initialUsers);
  const [modalMode, setModalMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const validateForm = (user) => {
    const newErrors = {};
    if (!user.username || user.username.trim() === "")
      newErrors.username = "Username is required";
    else if (user.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!user.email || user.email.trim() === "")
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      newErrors.email = "Invalid email format";
    const isDuplicateEmail = users.some(
      (u) =>
        u.email.toLowerCase() === user.email.toLowerCase() &&
        u.user_id !== user.user_id
    );
    if (isDuplicateEmail) newErrors.email = "Email already exists";
    const isDuplicateUsername = users.some(
      (u) =>
        u.username.toLowerCase() === user.username.toLowerCase() &&
        u.user_id !== user.user_id
    );
    if (isDuplicateUsername) newErrors.username = "Username already exists";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    setErrors((prev) => ({ ...prev, avatar: undefined }));
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP",
      }));
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, avatar: "File too large. Max 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setCurrentUser((prev) => ({ ...prev, avatar_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setCurrentUser((prev) => ({ ...prev, avatar_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

  };

  const handleEdit = (user) => {
    setCurrentUser({ ...user });
    setModalMode("edit");
    setIsModalOpen(true);
    setAvatarPreview(user.avatar_url);
  };

  const saveNewUser = () => {
    if (validateForm(currentUser)) {
      const newUser = {
        ...currentUser,
        user_id: Math.max(...users.map((u) => u.user_id), 0) + 1,
        created_at: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      handleClose();
    }
  };

  const updateUser = () => {
    if (validateForm(currentUser)) {
      setUsers(
        users.map((u) =>
          u.user_id === currentUser.user_id
            ? { ...currentUser, updated_at: new Date().toISOString() }
            : u
        )
      );
      handleClose();
    }
  };

  const handleDelete = (user_id) => {
    const userToDelete = users.find((u) => u.user_id === user_id);
    if (
      window.confirm(
        `Are you sure you want to delete user ${userToDelete.full_name}?`
      )
    ) {
      setUsers(users.filter((u) => u.user_id !== user_id));
    }
  };

  const handleClose = () => {
    setIsModalOpen(false); // Đóng modal trước

    setTimeout(() => {
      setModalMode(null);
      setCurrentUser(null);
      setErrors({});
      setAvatarPreview(null);
    }, 300); 
  };
  

  const handleChange = (field, value) => {
    setCurrentUser((prev) => ({ ...prev, [field]: value }));
  };

  return {
    users,
    modalMode,
    currentUser,
    errors,
    avatarPreview,
    fileInputRef,
    handleAdd,
    handleEdit,
    handleDelete,
    saveNewUser,
    updateUser,
    isModalOpen,
    handleClose,
    handleChange,
    handleAvatarUpload,
    handleRemoveAvatar,
  };
};
