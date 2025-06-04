import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";

const CityList = ({ cities, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Sort cities alphabetically by name
  const sortedCities = useMemo(() => {
    if (!Array.isArray(cities)) return [];
    return [...cities].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );
  }, [cities]);

  // Pagination calculations
  const {
    currentItems,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
  } = useMemo(() => {
    const totalItems = sortedCities.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCities.slice(indexOfFirstItem, indexOfLastItem);

    return {
      currentItems,
      totalPages,
      totalItems,
      indexOfFirstItem,
      indexOfLastItem,
    };
  }, [sortedCities, page, itemsPerPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1); // Reset to first page
  };

  return (
    <Box sx={{ p: 3 }}>
      {totalItems === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "grey.200",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No cities found
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Start by adding your first city
          </Typography>
        </Box>
      ) : (
        <>
          {/* City Grid */}
          <Grid container spacing={2}>
            {currentItems.map((city) => (
              <Grid item xs={12} sm={6} md={4} key={city.city_id}>
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 1,
                    overflow: "hidden",
                    transition: "box-shadow 0.3s, transform 0.3s",
                    "&:hover": {
                      boxShadow: 3,
                      transform: "translateY(-2px)",
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* City Image */}
                  <Box sx={{ position: "relative", height: 200 }}>
                    <img
                      src={
                        Array.isArray(city.image_url) &&
                        city.image_url.length > 0
                          ? city.image_url[0]
                          : ""
                      }
                      alt={`${city.name || "City"} cover`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                      }}
                      className="hover:scale-105"
                    />
                  </Box>
                  {/* City Details */}
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "1.125rem", fontWeight: 600 }}
                      >
                        {city.name || "Unnamed City"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => onEdit(city)}
                          sx={{
                            p: 1,
                            "&:hover": { bgcolor: "blue.50" },
                            color: "blue.600",
                          }}
                          aria-label={`Edit ${city.name || "city"}`}
                        >
                          <FaEdit size={16} />
                        </IconButton>
                        <IconButton
                          onClick={() => onDelete(city.city_id)}
                          sx={{
                            p: 1,
                            "&:hover": { bgcolor: "red.50" },
                            color: "red.600",
                          }}
                          aria-label={`Delete ${city.name || "city"}`}
                        >
                          <FaTrash size={16} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "3.6em",
                      }}
                    >
                      {city.description || "No description available"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          {/* Pagination Controls */}
          {totalItems > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mt: 4,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Show
                </Typography>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  size="small"
                  sx={{ bgcolor: "white", borderRadius: 1 }}
                  aria-label="Items per page"
                >
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                  <MenuItem value={48}>48</MenuItem>
                </Select>
                <Typography variant="body2" color="text.secondary">
                  per page
                </Typography>
              </Box>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="medium"
                aria-label="City list pagination"
              />
              <Typography variant="body2" color="text.secondary">
                Showing {indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, totalItems)} of {totalItems} cities
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CityList;
