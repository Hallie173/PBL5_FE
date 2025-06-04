import React, { useCallback, memo, useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Rating,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  Avatar,
  Stack,
  Zoom,
  Skeleton,
  Badge,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Reviews as ReviewsIcon,
  AccessTime as AccessTimeIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import useFavorites from "../../hooks/useFavorites";

const ItemCard = memo(
  ({ item, index, page, limit, onClick, type, userId, isLoggedIn }) => {
    const theme = useTheme();
    const rank = index + 1 + (page - 1) * limit;
    const { favorites, isFavoritesLoading, createFavorite, deleteFavorite } =
      useFavorites(userId, isLoggedIn);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Determine ID and image URL based on type
    const id = type === "restaurant" ? item.restaurant_id : item.attraction_id;
    const imageUrl = item.image_url?.[0] || item.image || "";

    // Check if the item is in favorites
    const isFavorite = favorites.some((fav) =>
      type === "restaurant"
        ? fav.restaurant_id === id
        : fav.attraction_id === id
    );

    const handleFavoriteToggle = useCallback(
      (event) => {
        event.stopPropagation();
        if (!isLoggedIn) {
          alert("Please log in to manage favorites.");
          return;
        }
        if (isFavorite) {
          const favorite = favorites.find((fav) =>
            type === "restaurant"
              ? fav.restaurant_id === id
              : fav.attraction_id === id
          );
          if (favorite) {
            deleteFavorite(favorite.favorite_id);
          }
        } else {
          if (type === "attraction") {
            createFavorite({
              userId,
              attractionId: id,
            });
          } else if (type === "restaurant") {
            createFavorite({
              userId,
              restaurantId: id,
            });
          }
        }
      },
      [
        isFavorite,
        favorites,
        createFavorite,
        deleteFavorite,
        userId,
        isLoggedIn,
        id,
        type,
      ]
    );

    const truncateText = useCallback((text, maxLength) => {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    }, []);

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
    }, []);

    return (
      <Card
        elevation={0}
        onClick={onClick}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          borderRadius: 4,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          height: 250, // Fixed height for card to keep uniformity
          position: "relative",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
            "& .card-image": {
              transform: "scale(1.05)",
            },
            "& .rank-badge": {
              transform: "scale(1.1) rotate(5deg)",
            },
            "& .action-buttons": {
              opacity: 1,
              transform: "translateX(0)",
            },
            "& .card-gradient-overlay": {
              opacity: 1,
            },
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
        tabIndex={0}
        aria-label={`${item.name}, ${type}, Rating: ${
          item.average_rating || 0
        } out of 5`}
      >
        {/* Image Section with Overlay */}
        <Box
          sx={{
            width: { xs: "100%", sm: 260 },
            height: 250, // Fixed height for image container to match card height
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          }}
        >
          {/* Image with Skeleton Loading */}
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
            />
          )}
          <Box
            component="img"
            src={imageUrl}
            alt={item.name}
            className="card-image"
            onLoad={handleImageLoad}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top", // Ensure image aligns to top to avoid empty space at bottom
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: imageLoaded ? 1 : 0,
            }}
          />

          {/* Gradient Overlay */}
          <Box
            className="card-gradient-overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 100%)",
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 1,
            }}
          />

          {/* Rank Badge */}
          <Badge
            overlap="circular"
            badgeContent={
              rank <= 3 ? (
                <StarIcon
                  sx={{
                    fontSize: 12,
                    color:
                      rank === 1
                        ? "#FFD700"
                        : rank === 2
                        ? "#C0C0C0"
                        : "#CD7F32",
                    position: "absolute",
                    top: -4,
                    right: -4,
                  }}
                />
              ) : null
            }
          >
            <Avatar
              className="rank-badge"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                width: 36,
                height: 36,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                fontSize: "0.875rem",
                fontWeight: "700",
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 2,
                border:
                  rank <= 3
                    ? `2px solid ${
                        rank === 1
                          ? "#FFD700"
                          : rank === 2
                          ? "#C0C0C0"
                          : "#CD7F32"
                      }`
                    : "none",
              }}
            >
              {rank}
            </Avatar>
          </Badge>

          {/* Action Buttons */}
          <Stack
            direction="column"
            spacing={1}
            className="action-buttons"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              opacity: { xs: 1, sm: 0 },
              transform: { xs: "translateX(0)", sm: "translateX(10px)" },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 2,
            }}
          >
            <Tooltip
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              arrow
            >
              <IconButton
                onClick={handleFavoriteToggle}
                size="small"
                disabled={isFavoritesLoading}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                sx={{
                  backgroundColor: alpha("#fff", 0.95),
                  color: isFavorite ? "#e91e63" : theme.palette.text.secondary,
                  boxShadow: `0 2px 8px ${alpha("#000", 0.15)}`,
                  "&:hover": {
                    backgroundColor: "#fff",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                  width: 36,
                  height: 36,
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Rating Badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              display: "flex",
              alignItems: "center",
              backgroundColor: alpha("#fff", 0.95),
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              boxShadow: `0 2px 8px ${alpha("#000", 0.15)}`,
              zIndex: 2,
            }}
          >
            <StarIcon sx={{ color: "#ff6d00", fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" fontWeight="700" color="text.primary">
              {item.average_rating || 0}
            </Typography>
          </Box>
        </Box>

        {/* Content Section */}
        <CardContent
          sx={{
            flex: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start", // Changed from space-between to flex-start for better layout
            position: "relative",
            "&:last-child": {
              paddingBottom: 3,
            },
          }}
        >
          {/* Header */}
          <Box>
            <Typography
              variant="h6"
              component="h3"
              fontWeight="700"
              title={item.name}
              sx={{
                fontSize: "1.25rem",
                lineHeight: 1.3,
                mb: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                color: theme.palette.text.primary,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  width: 40,
                  height: 3,
                  background: `linear-gradient(90deg, ${
                    theme.palette.primary.main
                  } 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
                  borderRadius: 4,
                },
              }}
            >
              {item.name}
            </Typography>

            {/* Rating & Reviews */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Rating
                  value={item.average_rating || 0}
                  readOnly
                  precision={0.5}
                  size="small"
                  sx={{
                    color: "#ff6d00",
                    "& .MuiRating-iconEmpty": {
                      color: alpha("#ff6d00", 0.3),
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ReviewsIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.primary.main,
                    mr: 0.5,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {item.rating_total || 0} reviews
                </Typography>
              </Box>

              {item.opening_hours && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.primary.main,
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    {item.opening_hours}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
              >
                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Zoom in timeout={300 + tagIndex * 100} key={tag}>
                    <Chip
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.08
                        ),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 28,
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.15
                        )}`,
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.15
                          ),
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                        my: 0.5,
                      }}
                    />
                  </Zoom>
                ))}
                {item.tags.length > 3 && (
                  <Tooltip
                    title={item.tags.slice(3).join(", ")}
                    arrow
                    placement="top"
                  >
                    <Chip
                      label={`+${item.tags.length - 3}`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.text.secondary,
                          0.08
                        ),
                        color: theme.palette.text.secondary,
                        fontSize: "0.75rem",
                        height: 28,
                        fontWeight: 600,
                        my: 0.5,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.text.secondary,
                            0.15
                          ),
                        },
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ mt: "auto" }}>
            {/* Address */}
            {item.address && (
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <LocationOnIcon
                  sx={{
                    fontSize: 18,
                    color: theme.palette.primary.main,
                    mr: 0.5,
                    mt: 0.1,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    flex: 1,
                    fontWeight: 500,
                  }}
                >
                  {truncateText(item.address, 50)}
                </Typography>
              </Box>
            )}

            {/* Description */}
            {item.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: { xs: 6, sm: 6 },
                  opacity: 0.9,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  p: 1,
                  borderRadius: 1,
                  borderLeft: `3px solid ${alpha(
                    theme.palette.primary.main,
                    0.5
                  )}`,
                }}
              >
                {truncateText(item.description, 300)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
);

ItemCard.displayName = "ItemCard";

export default ItemCard;
