import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantList } from "./hooks/useRestaurantList";
import ItemCard from "../../components/ItemCard/ItemCard";
import {
  TextField,
  Select,
  MenuItem,
  Chip,
  FormControl,
  Typography,
  Box,
  Grid,
  Pagination,
  Paper,
  InputAdornment,
  Container,
  Divider,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  Tag as TagIcon,
  ViewList as ViewListIcon,
  TuneRounded as TuneIcon,
} from "@mui/icons-material";
import SortIcon from "@mui/icons-material/Sort";
import { useAuth } from "../../contexts/AuthContext";

// Styled Components
const SearchField = ({ value, onChange, onClear }) => (
  <TextField
    placeholder="Search restaurants..."
    variant="outlined"
    value={value}
    onChange={onChange}
    fullWidth
    size="large"
    sx={{
      "& .MuiOutlinedInput-root": {
        backgroundColor: "#ffffff",
        borderRadius: "50px",
        height: "56px",
        fontSize: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        "& fieldset": { borderColor: "transparent", borderWidth: "2px" },
        "&:hover": {
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
          "& fieldset": { borderColor: "#e2e8f0" },
        },
        "&.Mui-focused": {
          boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)",
          "& fieldset": { borderColor: "#3b82f6", borderWidth: "2px" },
        },
      },
      "& .MuiOutlinedInput-input": {
        padding: "16px 20px 16px 60px",
        "&::placeholder": { color: "#9ca3af", opacity: 1, fontWeight: 400 },
      },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment
          position="start"
          sx={{ position: "absolute", left: "20px", zIndex: 1 }}
        >
          <SearchIcon
            sx={{ color: value ? "#3b82f6" : "#9ca3af", fontSize: "24px" }}
          />
        </InputAdornment>
      ),
      endAdornment: value && (
        <InputAdornment position="end" sx={{ mr: 1 }}>
          <IconButton
            onClick={onClear}
            size="small"
            sx={{
              color: "#6b7280",
              backgroundColor: "#f3f4f6",
              width: "32px",
              height: "32px",
              "&:hover": { backgroundColor: "#e5e7eb", color: "#374151" },
            }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

const FilterChips = ({
  selectedCity,
  selectedTags,
  onClearCity,
  onClearTag,
  onClearAll,
}) => {
  if (!selectedCity && selectedTags.length === 0) return null;

  return (
    <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "600px",
        }}
      >
        <Typography variant="body2" color="#6b7280" sx={{ mr: 1 }}>
          Filters:
        </Typography>
        {selectedCity && (
          <Chip
            label={`📍 ${selectedCity}`}
            onDelete={onClearCity}
            size="small"
            sx={{
              backgroundColor: "#dbeafe",
              color: "#1e40af",
              fontWeight: 500,
            }}
          />
        )}
        {selectedTags.map((tag) => (
          <Chip
            key={tag}
            label={`🏷️ ${tag}`}
            onDelete={() => onClearTag(tag)}
            size="small"
            sx={{
              backgroundColor: "#f0f9ff",
              color: "#0369a1",
              fontWeight: 500,
            }}
          />
        ))}
        <Button
          size="small"
          onClick={onClearAll}
          sx={{
            color: "#ef4444",
            fontSize: "0.75rem",
            textTransform: "none",
            minWidth: "auto",
            p: 0.5,
          }}
        >
          Clear All
        </Button>
      </Box>
    </Box>
  );
};

const FilterSidebar = ({
  selectedCity,
  selectedTags,
  cities,
  tags,
  onCityChange,
  onTagChange,
  onClearAll,
  hasActiveFilters,
  sortOption,
  onSortChange,
}) => (
  <Paper
    sx={{
      p: 3,
      border: "1px solid #e2e8f0",
      borderRadius: 2,
      position: "sticky",
      top: 80,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TuneIcon sx={{ color: "#3b82f6", mr: 1 }} />
        <Typography variant="h6" fontWeight="600" color="#1f2937">
          Filters
        </Typography>
      </Box>
      {hasActiveFilters && (
        <Button
          size="small"
          onClick={onClearAll}
          sx={{ color: "#3b82f6", fontSize: "0.875rem", textTransform: "none" }}
        >
          Clear All
        </Button>
      )}
    </Box>

    <Divider sx={{ mb: 3 }} />

    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocationIcon sx={{ color: "#3b82f6", fontSize: 20, mr: 1 }} />
        <Typography variant="subtitle2" fontWeight="600" color="#374151">
          City
        </Typography>
      </Box>
      <FormControl fullWidth size="small">
        <Select
          value={selectedCity}
          onChange={onCityChange}
          displayEmpty
          sx={{
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6b7280",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3b82f6",
            },
          }}
        >
          <MenuItem value="">
            <em style={{ color: "#9ca3af" }}>All Cities</em>
          </MenuItem>
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <TagIcon sx={{ color: "#3b82f6", fontSize: 20, mr: 1 }} />
        <Typography variant="subtitle2" fontWeight="600" color="#374151">
          Tags
        </Typography>
      </Box>
      <FormControl fullWidth size="small">
        <Select
          multiple
          value={selectedTags}
          onChange={onTagChange}
          displayEmpty
          sx={{
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6b7280",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3b82f6",
            },
          }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em style={{ color: "#9ca3af" }}>Select tags</em>;
            }
            return (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    sx={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
            );
          }}
        >
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>

    {/* Sort By Section */}
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <SortIcon sx={{ color: "#3b82f6", fontSize: 20, mr: 1 }} />
        <Typography variant="subtitle2" fontWeight="600" color="#374151">
          Sort by
        </Typography>
      </Box>
      <FormControl fullWidth size="small">
        <Select
          value={sortOption}
          onChange={onSortChange}
          displayEmpty
          sx={{
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6b7280",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3b82f6",
            },
          }}
        >
          <MenuItem value="">
            <em style={{ color: "#9ca3af" }}>None</em>
          </MenuItem>
          <MenuItem value="rating_asc">Rating Ascending</MenuItem>
          <MenuItem value="rating_desc">Rating Descending</MenuItem>
          <MenuItem value="reviews_asc">Total Reviews Ascending</MenuItem>
          <MenuItem value="reviews_desc">Total Reviews Descending</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </Paper>
);

const RestaurantList = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const {
    searchQuery,
    selectedTags,
    selectedCity,
    sortOption,
    page,
    restaurants,
    totalItems,
    totalPages,
    hasActiveFilters,
    isLoading,
    cities,
    tags,
    handleSearchChange,
    handleTagChange,
    handleCityChange,
    handleSortChange,
    handlePageChange,
    clearFilters,
    clearCity,
    clearTag,
    clearSearch,
  } = useRestaurantList();

  const handleCardClick = useCallback(
    (id) => navigate(`/tripguide/restaurant/${id}`),
    [navigate]
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", pb: 6 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight="700"
            gutterBottom
            sx={{ color: "#1a365d", mb: 2 }}
          >
            Discover Restaurants
          </Typography>
          <Typography variant="h6" color="#64748b" sx={{ fontWeight: 400 }}>
            Search and explore amazing places to eat
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
            px: { xs: 0, sm: 2, md: 4 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "600px", position: "relative" }}>
            <SearchField
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={clearSearch}
            />
          </Box>
        </Box>

        {/* Active Filters */}
        <FilterChips
          selectedCity={selectedCity}
          selectedTags={selectedTags}
          onClearCity={clearCity}
          onClearTag={clearTag}
          onClearAll={clearFilters}
        />

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid item xs={12} lg={3}>
            <FilterSidebar
              selectedCity={selectedCity}
              selectedTags={selectedTags}
              cities={cities}
              tags={tags}
              onCityChange={handleCityChange}
              onTagChange={handleTagChange}
              onClearAll={clearFilters}
              hasActiveFilters={hasActiveFilters}
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
          </Grid>

          {/* Content */}
          <Grid item xs={12} lg={9}>
            {/* Results Header */}
            <Paper
              sx={{
                mb: 3,
                py: 2,
                px: 3,
                border: "1px solid #e2e8f0",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ViewListIcon sx={{ color: "#3b82f6", mr: 1 }} />
                  <Typography variant="body1" color="#1f2937" fontWeight="600">
                    <strong style={{ color: "#3b82f6" }}>{totalItems}</strong>{" "}
                    restaurants found
                  </Typography>
                </Box>
                <Typography variant="body2" color="#6b7280">
                  Page {page} / {totalPages}
                </Typography>
              </Box>
            </Paper>

            {/* Loading State */}
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : restaurants.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="#6b7280">
                  No restaurants found.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Restaurants List */}
                <Box>
                  {restaurants.map((restaurant, index) => (
                    <Box sx={{ mb: 3 }} key={restaurant.restaurant_id}>
                      <ItemCard
                        item={restaurant}
                        index={index}
                        page={page}
                        limit={12}
                        onClick={() =>
                          handleCardClick(restaurant.restaurant_id)
                        }
                        type="restaurant"
                        userId={user?.user_id || null}
                        isLoggedIn={isLoggedIn}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Paper
                    sx={{
                      mt: 4,
                      py: 3,
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      size="large"
                      showFirstButton
                      showLastButton
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: "#374151",
                          borderColor: "#d1d5db",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            borderColor: "#6b7280",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#3b82f6",
                            color: "white",
                            borderColor: "#3b82f6",
                            "&:hover": { backgroundColor: "#2563eb" },
                          },
                        },
                      }}
                    />
                  </Paper>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RestaurantList;
