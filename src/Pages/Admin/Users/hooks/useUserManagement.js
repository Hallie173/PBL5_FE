import { useState, useRef } from "react";

export const useUserManagement = (initialUsers) => {
  const [users, setUsers] = useState(initialUsers);
  const [modalMode, setModalMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024;
    
    if (!validTypes.includes(file.type)) {
      return { avatar: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" };
    }
    
    if (file.size > maxSize) {
      return { avatar: "File too large. Max 5MB" };
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    return null;
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
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

  const saveNewUser = (values) => {
    const newUser = {
      ...values,
      user_id: Math.max(...users.map((u) => u.user_id), 0) + 1,
      created_at: new Date().toISOString(),
      avatar_url: avatarPreview || values.avatar_url,
    };
    setUsers([...users, newUser]);
    handleClose();
  };

  const updateUser = (values) => {
    const updatedUser = {
      ...values,
      updated_at: new Date().toISOString(),
      avatar_url: avatarPreview || values.avatar_url,
    };
    setUsers(
      users.map((u) =>
        u.user_id === currentUser.user_id ? updatedUser : u
      )
    );
    handleClose();
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
    setIsModalOpen(false);
    setTimeout(() => {
      setModalMode(null);
      setCurrentUser(null);
      setAvatarPreview(null);
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
  };
};