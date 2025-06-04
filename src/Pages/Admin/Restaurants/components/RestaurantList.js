import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  Pagination,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn,
  Star,
  Phone,
  AccessTime,
} from "@mui/icons-material";
import { toast } from "react-toastify"; // Thêm import react-toastify

const RestaurantList = ({ restaurants, onEdit, onDelete, cities }) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);

  const getCityName = (cityId) => {
    const city = cities.find((c) => c.city_id === cityId);
    return city ? city.name : "Thành phố không xác định";
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const formatHours = (hours) => {
    if (
      !hours ||
      !hours.weekRanges ||
      !hours.weekRanges[0] ||
      !hours.weekRanges[0][0]
    )
      return "N/A";
    const { openHours, closeHours } = hours.weekRanges[0][0];
    return `${formatTime(openHours)} - ${formatTime(closeHours)}`;
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleDelete = (restaurantId, restaurantName) => {
    if (
      window.confirm(`Bạn có chắc muốn xóa nhà hàng "${restaurantName}" không?`)
    ) {
      onDelete(restaurantId);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {currentItems.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.restaurant_id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[2],
                height: 480,
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.2s",
                "&:hover": {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ position: "relative", height: 220 }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={
                    restaurant.image_url?.[0] ||
                    "https://via.placeholder.com/300x220?text=No+Image"
                  }
                  alt={restaurant.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                />
                {restaurant.reservation_required && (
                  <Chip
                    label="Yêu cầu Đặt chỗ"
                    color="error"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      bgcolor: "rgba(255, 0, 0, 0.8)",
                      color: "white",
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Star fontSize="small" sx={{ color: "#fbc02d" }} />
                  <Typography variant="body2" fontWeight={500}>
                    {restaurant.average_rating.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
              <CardContent
                sx={{
                  flexGrow: 1,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {restaurant.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(restaurant)}
                      title="Chỉnh sửa nhà hàng"
                      sx={{
                        "&:hover": {
                          bgcolor: theme.palette.primary.light,
                        },
                      }}
                    >
                      <EditIcon fontSize="medium" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(restaurant.restaurant_id, restaurant.name)
                      }
                      title="Xóa nhà hàng"
                      sx={{
                        "&:hover": {
                          bgcolor: theme.palette.error.light,
                        },
                      }}
                    >
                      <DeleteIcon fontSize="medium" />
                    </IconButton>
                  </Box>
                </Box>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <LocationOn fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight={500}>
                      {getCityName(restaurant.city_id)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mb: 1.5,
                      minHeight: 60,
                    }}
                  >
                    {restaurant.description || "Không có mô tả"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <LocationOn fontSize="small" color="action" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {restaurant.address}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.phone_number || "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatHours(restaurant.hours)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {restaurants.length > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 1,
                fontWeight: 500,
                "&:hover": {
                  bgcolor: theme.palette.primary.light,
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default RestaurantList;
