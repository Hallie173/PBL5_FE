import { useState, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import BASE_URL from "../../../constants/BASE_URL";

const ITEMS_PER_PAGE = 12;

// Fetch functions
const fetchAttractions = async () => {
  const response = await axios.get(`${BASE_URL}/attractions`);
  return response.data;
};

const fetchCities = async () => {
  const response = await axios.get(`${BASE_URL}/cities`);
  return response.data;
};

const fetchTags = async () => {
  const response = await axios.get(`${BASE_URL}/api/tags/attractions`);
  return response.data;
};

export const useAttractionList = () => {
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  // Fetch data using react-query
  const { data: attractionsData = [], isLoading: isAttractionsLoading } =
    useQuery("attractions", fetchAttractions, {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });

  const { data: citiesData = [], isLoading: isCitiesLoading } = useQuery(
    "cities",
    fetchCities,
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  );

  const { data: tags = [], isLoading: isTagsLoading } = useQuery(
    "attractionTags",
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

  // Filtered data
  const filteredAttractions = useMemo(() => {
    let filtered = attractionsData.filter((attraction) => {
      const matchesSearch =
        !searchQuery ||
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (attraction.description &&
          attraction.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesCity =
        !selectedCity ||
        (attraction.address && attraction.address.includes(selectedCity));

      const matchesTags =
        selectedTags.length === 0 ||
        (attraction.tags &&
          selectedTags.some((tag) => attraction.tags.includes(tag)));

      return matchesSearch && matchesCity && matchesTags;
    });

    // Sorting logic
    if (sortOption) {
      filtered = filtered.slice(); // create a shallow copy before sorting
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
  }, [attractionsData, searchQuery, selectedCity, selectedTags, sortOption]);

  // Computed values
  const totalItems = filteredAttractions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const hasActiveFilters =
    searchQuery || selectedTags.length > 0 || selectedCity;

  // Paginated data
  const paginatedAttractions = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredAttractions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAttractions, page]);

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
    attractions: paginatedAttractions,
    totalItems,
    totalPages,
    hasActiveFilters,
    isLoading: isAttractionsLoading || isCitiesLoading || isTagsLoading,
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
  };
};
