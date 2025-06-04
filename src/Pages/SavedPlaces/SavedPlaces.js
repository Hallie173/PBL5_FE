import React, { useState, useCallback, useMemo } from "react";
import useFavorites from "../../hooks/useFavorites";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHeart,
  faPhone,
  faTrash,
  faFilter,
  faTimes,
  faChevronDown,
  faChevronUp,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  Button,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Grid,
  Alert,
  Skeleton,
  InputAdornment,
  Badge,
  Collapse,
  Divider,
} from "@mui/material";

// Constants
const ITEMS_PER_PAGE = 9;
const FILTER_TYPES = {
  restaurants: { label: "Restaurants", color: "#f97316" },
  attractions: { label: "Attractions", color: "#3b82f6" },
};

// Filter Section Component
const FilterSection = ({ filters, onFilterChange, isOpen, onToggle }) => {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card elevation={1} className="mb-4">
      <Box
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <Box className="flex items-center gap-3">
          <Box className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faFilter}
              className="text-indigo-600 text-sm"
            />
          </Box>
          <Typography variant="subtitle1" className="font-semibold">
            Filters
          </Typography>
          {activeCount > 0 && (
            <Badge
              className="ml-1"
              badgeContent={activeCount}
              color="primary"
            />
          )}
        </Box>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="text-gray-500"
        />
      </Box>
      <Collapse in={isOpen}>
        <Divider />
        <Box className="p-4 space-y-3 bg-gray-50">
          <Grid container spacing={2}>
            {Object.entries(FILTER_TYPES).map(([key, config]) => (
              <Grid item key={key}>
                <FormControlLabel
                  className="flex items-center"
                  control={
                    <Checkbox
                      checked={filters[key]}
                      onChange={onFilterChange}
                      value={key}
                      sx={{
                        color: config.color,
                        "&.Mui-checked": { color: config.color },
                      }}
                    />
                  }
                  label={
                    <span className="text-sm font-medium">{config.label}</span>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Card>
  );
};

// Search Section Component
const SearchSection = ({
  searchTerm,
  onSearchChange,
  resultsCount,
  onClear,
}) => (
  <Card elevation={1} className="mb-4">
    <Box className="p-4">
      <TextField
        fullWidth
        placeholder="Search your saved places..."
        value={searchTerm}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={onClear} size="small">
                <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {searchTerm && (
        <Typography variant="body2" className="mt-2 text-gray-600">
          Found {resultsCount} result{resultsCount !== 1 ? "s" : ""}
        </Typography>
      )}
    </Box>
  </Card>
);

// Place Card Component
const PlaceCard = ({ item, onClick, onRemoveFavorite }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Remove this from favorites?")) return;

    setIsRemoving(true);
    try {
      await onRemoveFavorite(item.favoriteId);
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const typeConfig = FILTER_TYPES[item.type + "s"] || FILTER_TYPES.attractions;

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 h-full"
      elevation={2}
    >
      <Box className="relative">
        <CardMedia
          component="img"
          height="160"
          image={item.image}
          alt={item.name}
          className="h-40 object-cover"
        />

        {/* Type Badge */}
        <Chip
          label={typeConfig.label.slice(0, -1)}
          size="small"
          className="absolute top-2 right-2 text-white font-bold"
          style={{ backgroundColor: typeConfig.color }}
        />

        {/* Delete Button */}
        <Tooltip title="Remove from favorites">
          <IconButton
            onClick={handleRemove}
            disabled={isRemoving}
            className="absolute top-2 left-2 bg-white hover:bg-red-50"
            size="small"
          >
            <FontAwesomeIcon icon={faTrash} className="text-red-600" />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent
        className="p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => onClick(item.type, item.id)}
      >
        <Typography variant="subtitle1" className="font-bold mb-1 line-clamp-1">
          {item.name}
        </Typography>
        {/* Rating and Review Count */}
        <Box className="flex items-center gap-2 mb-2">
          <Rating value={item.rating} precision={0.1} readOnly size="small" />
          <Typography variant="caption" className="text-gray-600">
            {item.rating.toFixed(1)} ({item.reviewCount.toLocaleString()})
          </Typography>
        </Box>
        <Typography
          variant="body2"
          className="text-gray-600 mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: item.description }}
        ></Typography>
        {item.address && (
          <Box className="flex items-center gap-1 mb-2 mt-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-600" />
            <Typography variant="body2" className="text-gray-600 line-clamp-1">
              {item.address}
            </Typography>
          </Box>
        )}

        {/* Contact Info */}
        <Box className="flex gap-2 mb-2">
          {item.phone_number && (
            <Box className="flex items-center gap-1">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-green-600 text-sm"
              />
              <Typography variant="body2" className="text-gray-600">
                {item.phone_number}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <Box className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" />
            ))}
            {item.tags.length > 2 && (
              <Chip
                label={`+${item.tags.length - 2}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <Grid container spacing={2}>
    {[...Array(6)].map((_, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <Skeleton variant="rectangular" height={160} />
          <CardContent>
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={16} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Stats Card
const StatsCard = ({ favorites }) => {
  const restaurantCount = favorites.filter(
    (item) => item.type === "restaurant"
  ).length;
  const attractionCount = favorites.filter(
    (item) => item.type === "attraction"
  ).length;

  return (
    <Card elevation={1} className="mb-4">
      <CardContent className="p-4">
        <Typography variant="h6" className="mb-3 font-bold">
          Your Collection
        </Typography>
        <Box className="space-y-2">
          <Box className="flex justify-between p-2 bg-gray-50 rounded">
            <span>Total Places:</span>
            <span className="font-bold text-indigo-600">
              {favorites.length}
            </span>
          </Box>
          <Box className="flex justify-between p-2 bg-orange-50 rounded">
            <span>Restaurants:</span>
            <span className="font-bold text-orange-600">{restaurantCount}</span>
          </Box>
          <Box className="flex justify-between p-2 bg-blue-50 rounded">
            <span>Attractions:</span>
            <span className="font-bold text-blue-600">{attractionCount}</span>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ type, onNavigate, onClearFilters }) => {
  const configs = {
    noData: {
      icon: faHeart,
      title: "No saved places yet",
      message: "Start exploring amazing restaurants and attractions!",
      buttonText: "Start Exploring",
      action: () => onNavigate("/tripguide"),
    },
    noResults: {
      icon: faSearch,
      title: "No results found",
      message: "Try adjusting your search or filters",
      buttonText: "Clear Filters",
      action: onClearFilters,
    },
  };

  const config = configs[type];

  return (
    <Card elevation={1}>
      <CardContent className="p-12 text-center">
        <Box className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon
            icon={config.icon}
            className="text-gray-400 text-2xl"
          />
        </Box>
        <Typography variant="h5" className="text-gray-700 mb-2 font-semibold">
          {config.title}
        </Typography>
        <Typography variant="body1" className="text-gray-500 mb-4">
          {config.message}
        </Typography>
        <Button variant="contained" onClick={config.action} size="large">
          {config.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Component
const SavedPlaces = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { favorites, isFavoritesLoading, favoritesError, deleteFavorite } =
    useFavorites(user?.user_id, isLoggedIn);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    restaurants: true,
    attractions: true,
  });
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  const handleFilterChange = useCallback((e) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({ ...prev, [value]: checked }));
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setFilters({ restaurants: true, attractions: true });
    setPage(1);
  }, []);

  const handleCardClick = useCallback(
    (type, id) => {
      navigate(`/tripguide/${type}/${id}`);
    },
    [navigate]
  );

  const transformedFavorites = useMemo(() => {
    return favorites
      .map((fav) => {
        const isRestaurant = fav.restaurant_id != null;
        const itemData = isRestaurant ? fav.Restaurant : fav.Attraction;
        if (!itemData) return null;

        return {
          favoriteId: fav.favorite_id,
          id: fav.restaurant_id || fav.attraction_id,
          name: itemData.name?.trim() || "Unnamed Location",
          description: itemData.description?.trim() || "",
          image: Array.isArray(itemData.image_url)
            ? itemData.image_url[0]
            : itemData.image_url ||
              "https://via.placeholder.com/400x200?text=No+Image",
          rating: Number(itemData.average_rating) || 0,
          reviewCount: Number(itemData.rating_total) || 0,
          address: itemData.address || "",
          phone_number: itemData.phone_number || "",
          website: itemData.website || "",
          tags: Array.isArray(itemData.tags) ? itemData.tags : [],
          type: isRestaurant ? "restaurant" : "attraction",
        };
      })
      .filter(Boolean);
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    return transformedFavorites
      .filter((item) => filters[item.type + "s"])
      .filter((item) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.address.toLowerCase().includes(searchLower) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      });
  }, [transformedFavorites, filters, searchTerm]);

  const pageCount = Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE);
  const paginatedFavorites = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredFavorites.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFavorites, page]);

  if (!isLoggedIn) return null;

  if (favoritesError) {
    return (
      <Box className="container mx-auto p-6">
        <Alert severity="error">
          Error loading favorites: {favoritesError.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="container mx-auto p-6 max-w-7xl">
        <Grid container spacing={2}>
          <Grid item xs={12} lg={3}>
            <FilterSection
              filters={filters}
              onFilterChange={handleFilterChange}
              isOpen={filterOpen}
              onToggle={() => setFilterOpen(!filterOpen)}
            />
            <StatsCard favorites={transformedFavorites} />
          </Grid>

          <Grid item xs={12} lg={9}>
            <SearchSection
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onClear={() => setSearchTerm("")}
              resultsCount={filteredFavorites.length}
            />

            {isFavoritesLoading ? (
              <LoadingSkeleton />
            ) : transformedFavorites.length === 0 ? (
              <EmptyState type="noData" onNavigate={navigate} />
            ) : filteredFavorites.length === 0 ? (
              <EmptyState
                type="noResults"
                onClearFilters={handleClearFilters}
              />
            ) : (
              <>
                <Grid container spacing={2}>
                  {paginatedFavorites.map((item) => (
                    <Grid item xs={12} sm={6} lg={4} key={item.favoriteId}>
                      <PlaceCard
                        item={item}
                        onClick={handleCardClick}
                        onRemoveFavorite={deleteFavorite}
                      />
                    </Grid>
                  ))}
                </Grid>

                {pageCount > 1 && (
                  <Box className="flex justify-center mt-6">
                    <Pagination
                      count={pageCount}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SavedPlaces;
