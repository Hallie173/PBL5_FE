import React, { useState } from "react";
import { Button, TextField, InputAdornment } from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import { useUserManagement } from "./hooks/useUserManagement";
import { initialUsers } from "./constants/initialUsers";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    users,
    modalMode,
    currentUser,
    avatarPreview,
    fileInputRef,
    handleAdd,
    isModalOpen,
    handleEdit,
    handleDelete,
    saveNewUser,
    updateUser,
    handleClose,
    handleAvatarUpload,
    handleRemoveAvatar,
  } = useUserManagement(initialUsers);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        
        <div className="p-4 border-b">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch className="text-gray-400" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        
        <UserTable 
          users={filteredUsers} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
      <UserModal
        isModalOpen={isModalOpen}
        mode={modalMode}
        user={currentUser}
        avatarPreview={avatarPreview}
        fileInputRef={fileInputRef}
        onClose={handleClose}
        onSave={modalMode === "edit" ? updateUser : saveNewUser}
        onAvatarUpload={handleAvatarUpload}
        onRemoveAvatar={handleRemoveAvatar}
      />
    </div>
  );
}