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

const CityTable = ({ cities, onEdit, onDelete }) => {
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
    setPage(0);
  };

  // Tính toán dữ liệu hiển thị theo trang hiện tại
  const paginatedCities = cities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Kiểm tra nếu không có cities
  if (cities.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1">No cities found</Typography>
      </Box>
    );
  }

  return (
    <Paper className="shadow-md rounded-lg">
      <TableContainer className="overflow-x-auto">
        <Table sx={{ minWidth: 650 }}>
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
              <TableCell align="center">Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCities.map((city) => (
              <TableRow
                key={city.city_id}
                sx={{
                  "&:last-child td": { borderBottom: 0 },
                  "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.04)" },
                }}
              >
                <TableCell align="center">
                  <Avatar
                    src={city.image_url}
                    alt={city.name}
                    sx={{
                      width: 56,
                      height: 56,
                      margin: "0 auto",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{city.name}</TableCell>
                <TableCell>
                  {city.description?.length > 50
                    ? `${city.description.substring(0, 50)}...`
                    : city.description || '-'}
                </TableCell>
                <TableCell align="center" sx={{ color: "text.secondary" }}>
                  {new Date(city.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit City" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(city)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                        },
                      }}
                    >
                      <FaEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete City" arrow>
                    <IconButton
                      color="error"
                      onClick={() => onDelete(city.city_id)}
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={cities.length}
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

export default CityTable;