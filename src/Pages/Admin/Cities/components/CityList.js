import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import CityModal from "./CityModal";
import { useCityManagement } from "../hooks/useCityManagement";

const CityList = ({ cities, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Pagination calculations
  const totalItems = cities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cities.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1); // Reset to first page when changing items per page
  };

  return (
    <Box sx={{ p: 3 }}>
      {cities.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "grey.100",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No cities found
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Start by adding your first city
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentItems.map((city) => (
              <Grid item xs={12} sm={6} md={4} key={city.city_id}>
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 1,
                    overflow: "hidden",
                    transition: "box-shadow 0.3s",
                    "&:hover": {
                      boxShadow: 3,
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ position: "relative", height: 160 }}>
                    <img
                      src={city.image_url}
                      alt={city.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                      }}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/400x200?text=No+Image")
                      }
                      className="hover:scale-105"
                    />
                  </Box>

                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "1.125rem", fontWeight: 600 }}
                      >
                        {city.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => onEdit(city)}
                          sx={{
                            p: 1,
                            "&:hover": { bgcolor: "blue.50" },
                            color: "blue.600",
                          }}
                          aria-label="Edit city"
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
                          aria-label="Delete city"
                        >
                          <FaTrash size={16} />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {city.description || "No description available"}
                    </Typography>

                    {city.images?.length > 1 && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {city.images.slice(1, 4).map((img, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <img
                              src={img}
                              alt={`${city.name} ${index + 2}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            {index === 2 && city.images.length > 4 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  bgcolor: "rgba(0,0,0,0.5)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography variant="caption" color="white">
                                  +{city.images.length - 4}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

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
                  sx={{ bgcolor: "white" }}
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
