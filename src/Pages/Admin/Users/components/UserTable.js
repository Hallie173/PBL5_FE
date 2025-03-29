// Pages/Admin/Users/components/UserTable.js
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Tooltip,
  TablePagination,
  Box,
  Typography,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = ({ users, onEdit, onDelete }) => {
  // State cho pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên khi thay đổi số dòng mỗi trang
  };

  // Tính toán dữ liệu hiển thị theo trang hiện tại
  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Kiểm tra nếu không có users
  if (users.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1">No users found</Typography>
      </Box>
    );
  }

  return (
    <Paper className="shadow-md rounded-lg">
      <TableContainer className="overflow-x-auto">
        <Table sx={{ minWidth: 650 }}>
          {/* Phần TableHead giữ nguyên như cũ */}
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                "& th": {
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  borderBottom: "none",
                  padding: "16px 12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  "&:first-of-type": {
                    borderTopLeftRadius: "8px",
                  },
                  "&:last-of-type": {
                    borderTopRightRadius: "8px",
                  },
                },
              }}
            >
              <TableCell align="center">Avatar</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Phần TableBody với dữ liệu đã phân trang */}
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.user_id}
                sx={{
                  "&:last-child td": { borderBottom: 0 },
                  "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.04)" },
                }}
              >
                {/* Các ô dữ liệu giữ nguyên */}
                <TableCell align="center">
                  <Avatar
                    src={user.avatar_url}
                    alt={user.full_name}
                    sx={{
                      width: 56,
                      height: 56,
                      margin: "0 auto",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  <span
                    style={{
                      backgroundColor:
                        user.role === "admin"
                          ? "rgba(25, 118, 210, 0.1)"
                          : "rgba(76, 175, 80, 0.1)",
                      color: user.role === "admin" ? "#1976d2" : "#4caf50",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit User" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(user)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                        },
                      }}
                    >
                      <FaEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User" arrow>
                    <IconButton
                      color="error"
                      onClick={() => onDelete(user.user_id)}
                      sx={{
                        ml: 1,
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                        },
                      }}
                    >
                      <FaTrash />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Thêm TablePagination ở cuối bảng */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid rgba(224, 224, 224, 1)",
          "& .MuiTablePagination-toolbar": {
            padding: "12px 16px",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              marginBottom: 0,
            },
        }}
      />
    </Paper>
  );
};

export default UserTable;
