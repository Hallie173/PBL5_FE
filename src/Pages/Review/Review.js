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
          <div className="w-full max-w-3xl mx-auto">
            {/* Modern Search Input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for places to review..."
                className="w-full py-4 pl-12 pr-4 text-gray-700 bg-white/90 backdrop-blur-sm
                  border-2 border-gray-200 rounded-full shadow-md hover:shadow-xl
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none
                  transition-all duration-300 ease-in-out placeholder:text-gray-400"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {/* Modern Search Results */}
              {showSuggestions && (
                <div
                  className="absolute z-50 left-0 right-0 mt-2 bg-white/95 backdrop-blur-md
                rounded-3xl shadow-xl border border-gray-100 overflow-hidden
                transition-all duration-300 ease-in-out animate-fadeIn"
                >
                  <div className="p-4">
                    {searchResults.length > 0 ? (
                      <div className="space-y-4">
                        {searchResults.map((item) => (
                          <div
                            key={item.detail_id}
                            className="flex items-center p-4 rounded-2xl hover:bg-blue-50/50
                            cursor-pointer transition-all duration-200"
                            onClick={() => {
                              handleItemClick(item);
                              setShowSuggestions(false);
                            }}
                          >
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-200
                                hover:scale-110"
                              />
                            </div>

                            <div className="ml-4 flex-grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3
                                    className="font-semibold text-gray-900 group-hover:text-blue-600
                                  transition-colors duration-200"
                                  >
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 flex items-center mt-1">
                                    {item.type === "attraction" ? (
                                      <span className="flex items-center">
                                        <i className="fas fa-landmark mr-2"></i>
                                        Tourist Attraction
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <i className="fas fa-utensils mr-2"></i>
                                        Restaurant
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <span
                                  className="flex items-center bg-blue-50 text-blue-600 px-3 py-1
                                rounded-full text-sm font-medium"
                                >
                                  {item.rating.toFixed(1)}
                                  <Star className="w-4 h-4 ml-1 text-yellow-400" />
                                </span>
                              </div>

                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  {item.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="text-xs px-3 py-1 bg-gray-100/80 text-gray-600
                                      rounded-full transition-colors duration-200
                                      hover:bg-gray-200/80"
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
                        <p className="text-gray-500">
                          Start typing to search...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modern Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <select
                  value={searchFilters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full appearance-none py-3 pl-4 pr-10 bg-white/90 backdrop-blur-sm
                    border-2 border-gray-200 rounded-full text-gray-700
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none
                    cursor-pointer transition-all duration-300 hover:shadow-md"
                >
                  <option value="all">All Types</option>
                  <option value="attraction">Attractions</option>
                  <option value="restaurant">Restaurants</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>

              <div className="relative flex-1">
                <select
                  value={searchFilters.rating}
                  onChange={(e) =>
                    handleFilterChange("rating", Number(e.target.value))
                  }
                  className="w-full appearance-none py-3 pl-4 pr-10 bg-white/90
                    border-2 border-gray-200 rounded-full text-gray-700
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none
                    cursor-pointer transition-all duration-300 hover:shadow-md"
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
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
