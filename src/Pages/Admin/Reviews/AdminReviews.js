import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
  Box,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  DialogActions,
} from "@mui/material";
import {
  Search,
  Star,
  Calendar,
  Users,
  Utensils,
  ChevronDown,
  RefreshCw,
  Camera,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import BASE_URL from "../../../constants/BASE_URL";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    type: "ALL",
    rating: 0,
  });
  const { user } = useAuth();
  const token = localStorage.getItem("token") || user?.token || "";
  const [isLoading, setIsLoading] = useState(true);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [locationName, setLocationName] = useState(""); // New state for attraction/restaurant name
  const [snackbar, setOpenSnackBar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Match constants from backend
  const visitTypes = [
    { value: "recent", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
  ];
  const companions = ["business", "couples", "family", "friends", "solo"];
  const purposes = [
    "breakfast",
    "lunch",
    "dinner",
    "brunch",
    "late night",
    "dine-in",
    "takeout",
    "business meeting",
    "casual dining",
    "celebration",
  ];

  const ITEMS_PER_PAGE = 6;

  // Axios instance
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch reviews
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/reviews");
      const mappedReviews = response.data.map((review) => ({
        ...review,
        review_id: review.review_id,
        user_id: review.user_id,
        attraction_id: review.attraction_id,
        restaurant_id: review.restaurant_id,
        visit_type: review.visit_type,
        photos: review.photos || [],
      }));
      setReviews(mappedReviews);
      setFilteredReviews(mappedReviews);
    } catch (error) {
      setOpenSnackBar({
        open: true,
        message: error.response?.data?.error || "Failed to fetch reviews",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attraction or restaurant name
  const fetchLocationName = async (review) => {
    try {
      let response;
      if (review.attraction_id) {
        response = await axiosInstance.get(
          `/attractions/${review.attraction_id}`
        );
      } else if (review.restaurant_id) {
        response = await axiosInstance.get(
          `/restaurants/${review.restaurant_id}`
        );
      }
      setLocationName(response?.data?.name || "Unknown Location");
    } catch (error) {
      setLocationName("Unknown Location");
      setOpenSnackBar({
        open: true,
        message: error.response?.data?.error || "Failed to fetch location name",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setOpenSnackBar({
        open: true,
        message: "Unauthorized access. Admins only.",
        type: "error",
      });
      return;
    }
    fetchReviews();
  }, [user]);

  // Handle search and filters
  useEffect(() => {
    const searchTerms = searchQuery.trim().toLowerCase().split(" ");
    const filtered = reviews.filter((review) => {
      if (
        searchFilters.type !== "ALL" &&
        (searchFilters.type === "ATTRACTION"
          ? !review.attraction_id
          : !review.restaurant_id)
      ) {
        return false;
      }
      if (review.rating < searchFilters.rating) return false;
      return searchTerms.every((term) =>
        review.title.toLowerCase().includes(term)
      );
    });
    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [searchQuery, searchFilters, reviews]);

  // Pagination
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.trim().length >= 2);
  };

  const handleFilterChange = (filterType, value) => {
    setSearchFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleDetailsClick = (review) => {
    setSelectedReview({
      ...review,
      review_id: review.review_id,
      user_id: review.user_id,
      restaurant_id: review.restaurant_id,
      attraction_id: review.attraction_id,
    });
    fetchLocationName(review); // Fetch the location name
    setOpenDetailsDialog(true);
    setShowSuggestions(false);
  };

  const handleDeleteReview = async (review_id) => {
    if (!user || !user.user_id) {
      setOpenSnackBar({
        open: true,
        message: "User not authenticated. Please log in.",
        type: "error",
      });
      return;
    }
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await axiosInstance.delete(`/reviews/${review_id}`, {
        data: { user_id: user.user_id },
      });
      if (response.status === 204) {
        fetchReviews();
        setOpenSnackBar({
          open: true,
          message: "Review deleted successfully",
          type: "success",
        });
      }
    } catch (error) {
      setOpenSnackBar({
        open: true,
        message: error.response?.data?.error || "Failed to delete review",
        type: "error",
      });
    }
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Typography variant="h4" className="font-bold text-gray-900">
            Admin Review Management
          </Typography>
          <button
            onClick={fetchReviews}
            className="p-2 rounded-full bg-white/90 shadow-md hover:bg-gray-100"
          >
            <RefreshCw className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search reviews by title..."
              className="w-full py-4 pl-12 pr-4 text-gray-700 bg-white/90 border-2 border-gray-200 rounded-full shadow-md hover:shadow-xl focus:border-[#00a568] focus:ring-2 focus:ring-[#00a568]/20 outline-none"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && (
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white/95 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-4">
                  {filteredReviews.length > 0 && searchQuery.length >= 2 ? (
                    filteredReviews.slice(0, 5).map((review) => (
                      <div
                        key={review.review_id}
                        className="flex items-center p-4 rounded-2xl hover:bg-green-50/50 cursor-pointer"
                        onClick={() => handleDetailsClick(review)}
                      >
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900 hover:text-[#00a568]">
                            {review.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {review.attraction_id
                              ? "Tourist Attraction"
                              : "Restaurant"}
                          </p>
                          <div className="flex space-x-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                fill={
                                  star <= review.rating ? "#00a568" : "none"
                                }
                                color={
                                  star <= review.rating ? "#00a568" : "#D1D5DB"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      {searchQuery.length > 0
                        ? `No results found for "${searchQuery}"`
                        : "Start typing to search..."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={searchFilters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="bg-white/90 border-2 border-gray-200 rounded-full"
              >
                <MenuItem value="ALL">All Types</MenuItem>
                <MenuItem value="ATTRACTION">Attractions</MenuItem>
                <MenuItem value="RESTAURANT">Restaurants</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                value={searchFilters.rating}
                onChange={(e) =>
                  handleFilterChange("rating", Number(e.target.value))
                }
                className="bg-white/90 border-2 border-gray-200 rounded-full"
              >
                <MenuItem value={0}>Any Rating</MenuItem>
                <MenuItem value={3}>3+ Stars</MenuItem>
                <MenuItem value={4}>4+ Stars</MenuItem>
                <MenuItem value={5}>5 Stars</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Reviews */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Reviews</h2>
          {isLoading ? (
            <Box display="flex" justifyContent="center" my={8}>
              <CircularProgress />
            </Box>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-600">No reviews found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedReviews.map((review) => (
                  <Card
                    key={review.review_id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <CardContent>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#00a568]">
                        {review.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {review.attraction_id
                          ? "Tourist Attraction"
                          : "Restaurant"}
                      </p>
                      <div className="flex space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            fill={star <= review.rating ? "#00a568" : "none"}
                            color={
                              star <= review.rating ? "#00a568" : "#D1D5DB"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm mt-2 truncate">
                        {review.comment}
                      </p>
                    </CardContent>
                    <CardActions className="p-4 pt-0">
                      <Button
                        variant="contained"
                        className="bg-[#00a568] hover:bg-[#009259] text-white"
                        size="small"
                        onClick={() => handleDetailsClick(review)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="contained"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="small"
                        onClick={() => handleDeleteReview(review.review_id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </div>
              {filteredReviews.length > ITEMS_PER_PAGE && (
                <div className="mt-10 flex justify-center">
                  <nav className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg disabled:opacity-50 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg disabled:opacity-50 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {/* Details Review Dialog */}
        <Dialog
          open={openDetailsDialog}
          onClose={() => {
            setOpenDetailsDialog(false);
            setLocationName(""); // Reset location name on close
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="bg-gray-100 text-gray-900 font-bold">
            Review Details
          </DialogTitle>
          <DialogContent className="bg-white p-6">
            {selectedReview && (
              <>
                {/* Location Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {selectedReview.attraction_id ? "Attraction" : "Restaurant"}{" "}
                    Name
                  </label>
                  <Typography className="text-sm text-gray-700">
                    {locationName || "Loading..."}
                  </Typography>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        fill={
                          star <= selectedReview.rating ? "#00a568" : "none"
                        }
                        color={
                          star <= selectedReview.rating ? "#00a568" : "#D1D5DB"
                        }
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600 mt-2 inline-block bg-gray-100 px-3 py-1 rounded-full">
                    {selectedReview.rating === 5 && "Excellent"}
                    {selectedReview.rating === 4 && "Good"}
                    {selectedReview.rating === 3 && "Average"}
                    {selectedReview.rating === 2 && "Fair"}
                    {selectedReview.rating === 1 && "Poor"}
                  </span>
                </div>

                {/* Visit Type */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                    <Calendar className="mr-2 text-gray-500" size={16} />
                    When was the visit?
                  </label>
                  <Typography className="text-sm text-gray-700">
                    {visitTypes.find(
                      (type) => type.value === selectedReview.visit_type
                    )?.label || selectedReview.visit_type}
                  </Typography>
                </div>

                {/* Companion */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                    <Users className="mr-2" size={16} />
                    Who was the visit with?
                  </label>
                  <Typography className="text-sm text-gray-700">
                    {selectedReview.companion
                      ? selectedReview.companion.charAt(0).toUpperCase() +
                        selectedReview.companion.slice(1)
                      : "N/A"}
                  </Typography>
                </div>

                {/* Purpose (for restaurants) */}
                {selectedReview.restaurant_id && (
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                      <Utensils className="mr-2 text-gray-500" size={16} />
                      What was the visit purpose?
                    </label>
                    <Typography className="text-sm text-gray-700">
                      {selectedReview.purpose
                        ? selectedReview.purpose
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : "N/A"}
                    </Typography>
                  </div>
                )}

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Title
                  </label>
                  <Typography className="text-sm text-gray-700">
                    {selectedReview.title}
                  </Typography>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Review
                  </label>
                  <Typography className="text-sm text-gray-700">
                    {selectedReview.comment}
                  </Typography>
                </div>

                {/* Photos */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                    <Camera className="mr-2 text-gray-500" size={16} />
                    Photos
                  </label>
                  {selectedReview.photos && selectedReview.photos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      {selectedReview.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                        >
                          <img
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography className="text-sm text-gray-500">
                      No photos available
                    </Typography>
                  )}
                </div>
              </>
            )}
          </DialogContent>
          <DialogActions className="bg-gray-100 p-4">
            <Button
              onClick={() => {
                setOpenDetailsDialog(false);
                setLocationName(""); // Reset location name on close
              }}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.type} onClose={handleCloseSnackBar}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AdminReviews;
