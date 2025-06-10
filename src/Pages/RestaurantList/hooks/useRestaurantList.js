import { useState, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";

const ITEMS_PER_PAGE = 12;

// Fetch functions
const fetchRestaurants = async (searchQuery) => {
  if (!searchQuery || searchQuery.trim().length === 0) {
    // Fetch all restaurants if no search query
    const response = await axios.get(`${BASE_URL}/restaurants`);
    return response.data;
  }
  // Fetch search results
  const response = await axios.get(`${BASE_URL}/restaurants/search`, {
    params: { q: searchQuery.trim() },
  });
  return response.data;
};

const fetchCities = async () => {
  const response = await axios.get(`${BASE_URL}/cities`);
  return response.data;
};

const fetchTags = async () => {
  const response = await axios.get(`${BASE_URL}/api/tags/restaurants`);
  return response.data;
};

export const useRestaurantList = () => {
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  // Fetch data using react-query
  const {
    data: restaurantsData = [],
    isLoading: isRestaurantsLoading,
    error: restaurantsError,
  } = useQuery(
    ["restaurants", searchQuery],
    () => fetchRestaurants(searchQuery),
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      enabled: true, // Always fetch, as we handle empty queries in fetchRestaurants
    }
  );

  const { data: citiesData = [], isLoading: isCitiesLoading } = useQuery(
    ["cities"],
    fetchCities,
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  );

  const { data: tags = [], isLoading: isTagsLoading } = useQuery(
    ["restaurantTags"],
    fetchTags,
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  );

  // Map cities to array of names
  const cities = useMemo(
    () => citiesData.map((city) => city.name),
    [citiesData]
  );

  // Filtered data (apply city and tag filters client-side)
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurantsData.filter((restaurant) => {
      const matchesCity =
        !selectedCity ||
        (restaurant.address && restaurant.address.includes(selectedCity));

      const matchesTags =
        selectedTags.length === 0 ||
        (restaurant.tags &&
          selectedTags.some((tag) => restaurant.tags.includes(tag)));

      return matchesCity && matchesTags;
    });

    // Sorting logic
    if (sortOption) {
      filtered = filtered.slice(); // Create a shallow copy before sorting
      switch (sortOption) {
        case "rating_asc":
          filtered.sort(
            (a, b) => (a.average_rating || 0) - (b.average_rating || 0)
          );
          break;
        case "rating_desc":
          filtered.sort(
            (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
          );
          break;
        case "reviews_asc":
          filtered.sort(
            (a, b) => (a.rating_total || 0) - (b.rating_total || 0)
          );
          break;
        case "reviews_desc":
          filtered.sort(
            (a, b) => (b.rating_total || 0) - (a.rating_total || 0)
          );
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [restaurantsData, selectedCity, selectedTags, sortOption]);

  // Computed values
  const totalItems = filteredRestaurants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const hasActiveFilters =
    searchQuery || selectedTags.length > 0 || selectedCity;

  // Paginated data
  const paginatedRestaurants = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredRestaurants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRestaurants, page]);

  // Event handlers
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  }, []);

  const handleTagChange = useCallback((event) => {
    setSelectedTags(event.target.value);
    setPage(1);
  }, []);

  const handleCityChange = useCallback((event) => {
    setSelectedCity(event.target.value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((event) => {
    setSortOption(event.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCity("");
    setSortOption("");
    setPage(1);
  }, []);

  const clearCity = useCallback(() => {
    setSelectedCity("");
    setPage(1);
  }, []);

  const clearTag = useCallback((tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setPage(1);
  }, []);

  return {
    searchQuery,
    selectedTags,
    selectedCity,
    sortOption,
    page,
    restaurants: paginatedRestaurants,
    totalItems,
    totalPages,
    hasActiveFilters,
    isLoading: isRestaurantsLoading || isCitiesLoading || isTagsLoading,
    cities,
    tags,
    restaurantsError, // Expose error for handling in UI
    handleSearchChange,
    handleTagChange,
    handleCityChange,
    handleSortChange,
    handlePageChange,
    clearFilters,
    clearCity,
    clearTag,
    clearSearch,
  };
};
