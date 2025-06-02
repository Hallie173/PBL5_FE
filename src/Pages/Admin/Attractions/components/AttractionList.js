import { useState, useCallback } from "react";
import { memo } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import {
  Edit,
  Delete,
  Star,
  LocationOn,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const AttractionList = memo(({ attractions, onEdit, onDelete, cities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const totalPages = Math.ceil(attractions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = attractions.slice(startIndex, startIndex + itemsPerPage);

  const getCityName = useCallback(
    (cityId) =>
      cities.find((c) => c.city_id === cityId)?.name || "Unknown City",
    [cities]
  );

  const getImageUrl = useCallback(
    (imageUrl) =>
      Array.isArray(imageUrl) && imageUrl[0]
        ? imageUrl[0]
        : "https://via.placeholder.com/400x180?text=No+Image",
    []
  );

  const formatRating = useCallback(
    (rating) => Number(rating)?.toFixed(1) || "N/A",
    []
  );

  const handlePageChange = useCallback(
    (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    [totalPages]
  );

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const badgeSx = {
    position: "absolute",
    top: 8,
    bgcolor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 1,
    px: 1,
    py: 0.5,
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 2.5,
        }}
      >
        {currentItems.map((attraction) => (
          <Box
            key={attraction.attraction_id}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
              overflow: "hidden",
              "&:hover": { boxShadow: 3 },
            }}
          >
            <Box sx={{ height: 180, position: "relative", overflow: "hidden" }}>
              <img
                src={getImageUrl(attraction.image_url)}
                alt={attraction.name || "Attraction"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/400x180?text=No+Image")
                }
              />
              <Box sx={{ ...badgeSx, left: 8 }}>
                <LocationOn fontSize="small" color="primary" />
                <Typography variant="caption">
                  {getCityName(attraction.city_id)}
                </Typography>
              </Box>
              <Box sx={{ ...badgeSx, right: 8 }}>
                <Star fontSize="small" sx={{ color: "warning.main" }} />
                <Typography variant="caption">
                  {formatRating(attraction.average_rating)}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  fontSize="1.1rem"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {attraction.name || "Unnamed Attraction"}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(attraction)}
                    color="primary"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(attraction.attraction_id)}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {attraction.description || "No description available"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.secondary",
                }}
              >
                <LocationOn fontSize="small" color="primary" />
                <Typography
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {attraction.address || "No address provided"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  minHeight: 30,
                }}
              >
                {Array.isArray(attraction.tags) &&
                attraction.tags.length > 0 ? (
                  <>
                    {attraction.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={`${attraction.attraction_id}-tag-${index}`}
                        label={tag}
                        size="small"
                        color="primary"
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: "medium",
                          height: 28,
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                      />
                    ))}
                    {attraction.tags.length > 3 && (
                      <Chip
                        label={`+${attraction.tags.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.85rem", height: 28 }}
                      />
                    )}
                  </>
                ) : (
                  <Chip
                    label="No tags"
                    size="small"
                    variant="outlined"
                    color="default"
                    sx={{ fontSize: "0.85rem", height: 28 }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      {attractions.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Show
            </Typography>
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              size="small"
              sx={{ minWidth: 50 }}
            >
              {[6, 12, 24].map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="body2" color="text.secondary">
              per page
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              size="small"
            >
              <ChevronLeft />
            </IconButton>
            {pageNumbers.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? "contained" : "outlined"}
                size="small"
                sx={{ minWidth: 32, px: 0.5 }}
              >
                {page}
              </Button>
            ))}
            <IconButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              size="small"
            >
              <ChevronRight />
            </IconButton>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, attractions.length)} of{" "}
            {attractions.length}
          </Typography>
        </Stack>
      )}
    </Box>
  );
});

AttractionList.propTypes = {
  attractions: PropTypes.arrayOf(
    PropTypes.shape({
      attraction_id: PropTypes.number.isRequired,
      name: PropTypes.string,
      city_id: PropTypes.number,
      address: PropTypes.string,
      description: PropTypes.string,
      average_rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      image_url: PropTypes.arrayOf(PropTypes.string),
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      city_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AttractionList;
