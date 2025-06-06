import React, { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../constants/BASE_URL";
const Review = () => {
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsPerPage] = useState(6); // Number of items per page
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    type: "all",
    rating: 0,
  });

  // Fetch completed itineraries and their details
  useEffect(() => {
    const fetchCompletedItineraries = async () => {
      if (!user?.user_id) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch completed itineraries for the user
        const itineraryResponse = await axios.get(
          `${BASE_URL}/itinerary/finished/${user.user_id}`
        );
        const itineraries = itineraryResponse.data;

        // Fetch details for each itinerary
        const locationPromises = itineraries.map(async (itinerary) => {
          const detailsResponse = await axios.get(
            `${BASE_URL}/itineraryDetail/${user.user_id}/${itinerary.itinerary_id}`
          );

          return detailsResponse.data.map((detail) => {
            return {
              detail_id: detail.detail_id,
              itinerary_id: detail.itinerary_id,
              name: detail.name,
              location:
                detail.type === "attraction"
                  ? "Tourist Attraction"
                  : "Restaurant",
              image: detail.image_url?.[0] || "", // Using optional chaining since image_url is JSONB
              rating: detail.average_rating || 0,
              rating_total: detail.rating_total || 0,
              type: detail.type,
              tags: detail.tags || [],
              // Simply use the id field directly
              id: detail.id,
            };
          });
        });

        // Flatten and set locations
        const allLocations = (await Promise.all(locationPromises)).flat();
        setLocations(allLocations);
        setError(null);
      } catch (err) {
        console.error("Error fetching itineraries:", err);
        setError("Failed to load locations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedItineraries();
  }, [user]);

  const RatingStars = ({ rating }) => {
    const renderStars = () => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;

      // Add full stars
      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <Star
            key={`full-${i}`}
            className="text-yellow-400"
            sx={{ fontSize: 24 }}
          />
        );
      }

      // Add half star if needed
      if (hasHalfStar) {
        stars.push(
          <StarHalf
            key="half"
            className="text-yellow-400"
            sx={{ fontSize: 24 }}
          />
        );
      }

      // Add empty stars
      const emptyStars = 5 - Math.ceil(rating);
      for (let i = 0; i < emptyStars; i++) {
        stars.push(
          <StarBorder
            key={`empty-${i}`}
            className="text-yellow-400"
            sx={{ fontSize: 24 }}
          />
        );
      }

      return stars;
    };

    return (
      <div className="flex items-center">
        <div className="flex">{renderStars()}</div>
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleItemClick = (place) => {
    const baseUrl = "/tripguide/review";
    const path =
      place.type === "attraction"
        ? `${baseUrl}/attraction/${place.id}`
        : `${baseUrl}/restaurant/${place.id}`;
    navigate(path);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const searchTerms = query.trim().toLowerCase().split(" ");

    // Filter locations based on search terms and filters
    const filteredResults = locations.filter((location) => {
      // Check if matches type filter
      if (
        searchFilters.type !== "all" &&
        location.type !== searchFilters.type
      ) {
        return false;
      }

      // Check if matches rating filter
      if (location.rating < searchFilters.rating) {
        return false;
      }

      // Check if matches search terms
      return searchTerms.every((term) => {
        return (
          location.name.toLowerCase().includes(term) ||
          (location.tags &&
            location.tags.some((tag) => tag.toLowerCase().includes(term)))
        );
      });
    });

    setSearchResults(filteredResults);
  };

  // Add filter handling function
  const handleFilterChange = (filterType, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));

    // Re-run search with new filters if there's a search query
    if (searchQuery.trim().length >= 2) {
      handleSearch(searchQuery);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p>Loading locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = locations.slice(
    indexOfFirstLocation,
    indexOfLastLocation
  );
  const totalPages = Math.ceil(locations.length / locationsPerPage);

  // Pagination component
  const Pagination = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
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
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            Write a review, make someone's trip
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share your experiences and help others discover amazing places
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-16 relative">
          {" "}
          {/* Added relative positioning here */}
          <div className="w-full max-w-3xl mx-auto">
            {/* Search Input with enhanced styling */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for places to review..."
                className="w-full py-4 pl-12 pr-4 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl 
                  hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  transition-all duration-200 shadow-sm"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
            </div>

            {/* Improved Filters */}
            <div className="flex gap-4 mb-6">
              <select
                value={searchFilters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  cursor-pointer transition-all duration-200 hover:border-gray-300"
              >
                <option value="all">All Types</option>
                <option value="attraction">Attractions</option>
                <option value="restaurant">Restaurants</option>
              </select>

              <select
                value={searchFilters.rating}
                onChange={(e) =>
                  handleFilterChange("rating", Number(e.target.value))
                }
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  cursor-pointer transition-all duration-200 hover:border-gray-300"
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            {/* Enhanced Suggestions Panel - Updated positioning */}
            {showSuggestions && (
              <div
                className="absolute z-10 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 
                backdrop-blur-sm backdrop-filter overflow-hidden transition-all duration-200"
              >
                <div className="p-4">
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.map((item) => (
                        <div
                          key={item.detail_id}
                          className="flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer
                            transition-all duration-200"
                          onClick={() => {
                            handleItemClick(item);
                            setShowSuggestions(false);
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                          <div className="ml-4 flex-grow">
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-500 flex items-center">
                                {item.type === "attraction" ? (
                                  <span className="flex items-center">
                                    <i className="fas fa-landmark mr-1"></i>{" "}
                                    Tourist Attraction
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <i className="fas fa-utensils mr-1"></i>{" "}
                                    Restaurant
                                  </span>
                                )}
                              </p>
                              <RatingStars rating={item.rating} />
                            </div>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {item.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.length > 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">Start typing to search...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Places Section with improved cards */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Your Recent Places
          </h2>
          {locations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-600">No completed trips found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentLocations.map((place) => (
                  <div
                    key={place.detail_id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md p-4 cursor-pointer
                      transform hover:-translate-y-1 transition-all duration-200"
                    onClick={() => handleItemClick(place)}
                  >
                    <div className="flex space-x-4">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-24 h-24 object-cover rounded-lg group-hover:shadow-md transition-shadow"
                      />
                      <div className="flex-grow">
                        <h3
                          className="font-bold text-lg text-gray-900 group-hover:text-blue-600 
                          transition-colors duration-200"
                        >
                          {place.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {place.location}
                        </p>
                        <div className="mt-3">
                          <RatingStars rating={place.rating} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {locations.length > locationsPerPage && (
                <div className="mt-10 flex justify-center">
                  <nav className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                        bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 
                        transition-all duration-200"
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
                      className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                        bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50
                        transition-all duration-200"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
