// Pages/Admin/Users/Users.js
import React from "react";
import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import { useUserManagement } from "./hooks/useUserManagement";
import { initialUsers } from "./constants/initialUsers";

export default function UserManagement() {
  const {
    users,
    modalMode,
    currentUser,
    errors,
    avatarPreview,
    fileInputRef,
    handleAdd,
    isModalOpen,
    handleEdit,
    handleDelete,
    saveNewUser,
    updateUser,
    handleClose,
    handleChange,
    handleAvatarUpload,
    handleRemoveAvatar,
  } = useUserManagement(initialUsers);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus />}
            onClick={handleAdd}
          >
            Add User
          </Button>
        </div>
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <UserModal
        isModalOpen={isModalOpen} // Truyền prop mới
        open={isModalOpen} // Có thể giữ lại để tương thích hoặc bỏ
        mode={modalMode}
        user={currentUser}
        errors={errors}
        avatarPreview={avatarPreview}
        fileInputRef={fileInputRef}
        onClose={handleClose}
        onSave={modalMode === "edit" ? updateUser : saveNewUser}
        onChange={handleChange}
        onAvatarUpload={handleAvatarUpload}
        onRemoveAvatar={handleRemoveAvatar}
      />
    </div>
  );
}
