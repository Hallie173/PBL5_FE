import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaStar,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaLocationArrow,
  FaInfoCircle,
} from "react-icons/fa";

const AttractionList = ({ attractions, onEdit, onDelete, cities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Pagination calculations
  const totalItems = attractions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attractions.slice(indexOfFirstItem, indexOfLastItem);

  const getCityName = (cityId) => {
    const city = cities.find((c) => c.city_id === cityId);
    return city ? city.name : "Unknown City";
  };

  const getTagColor = (tag) => {
    const tagColors = {
      historical: "bg-amber-100 text-amber-800",
      modern: "bg-sky-100 text-sky-800",
      unesco: "bg-emerald-100 text-emerald-800",
      lake: "bg-blue-100 text-blue-800",
      park: "bg-green-100 text-green-800",
      architecture: "bg-indigo-100 text-indigo-800",
      landmark: "bg-violet-100 text-violet-800",
      river: "bg-cyan-100 text-cyan-800",
      viewpoint: "bg-rose-100 text-rose-800",
      mountain: "bg-lime-100 text-lime-800",
      museum: "bg-orange-100 text-orange-800",
      war: "bg-red-100 text-red-800",
      nature: "bg-teal-100 text-teal-800",
      boat: "bg-fuchsia-100 text-fuchsia-800",
    };
    return tagColors[tag] || "bg-gray-100 text-gray-800";
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const renderPagination = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Show</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
        <span>per page</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <FaChevronLeft className="text-gray-600" size={16} />
        </button>

        {/* Show limited page numbers */}
        {(() => {
          const pages = [];
          const startPage = Math.max(1, currentPage - 2);
          const endPage = Math.min(totalPages, currentPage + 2);

          if (startPage > 1) pages.push(<span key="start-ellipsis" className="text-gray-500">...</span>);

          for (let i = startPage; i <= endPage; i++) {
            pages.push(
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  currentPage === i
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {i}
              </button>
            );
          }

          if (endPage < totalPages) pages.push(<span key="end-ellipsis" className="text-gray-500">...</span>);

          return pages;
        })()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <FaChevronRight className="text-gray-600" size={16} />
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems} attractions
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((attraction) => (
          <div
            key={attraction.attraction_id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onMouseEnter={() => setHoveredCard(attraction.attraction_id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={attraction.image_url || "https://via.placeholder.com/400x200?text=No+Image"}
                alt={attraction.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => (e.target.src = "https://via.placeholder.com/400x200?text=No+Image")}
              />
              <div className="absolute top-3 left-3 bg-white/90 rounded-md px-2 py-1 flex items-center gap-1 text-xs font-medium">
                <FaLocationArrow className="text-blue-500" size={12} />
                {getCityName(attraction.city_id)}
              </div>
              <div className="absolute top-3 right-3 bg-white/90 rounded-md px-2 py-1 flex items-center gap-1 text-xs font-medium">
                <FaStar className="text-yellow-400" size={12} />
                {attraction.average_rating.toFixed(1)}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {attraction.name}
                </h3>
                <div
                  className={`flex gap-2 transition-opacity duration-200 ${
                    hoveredCard === attraction.attraction_id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={() => onEdit(attraction)}
                    className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                    aria-label="Edit attraction"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(attraction.attraction_id)}
                    className="p-1.5 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                    aria-label="Delete attraction"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-gray-600 mb-3 text-sm">
                <FaMapMarkerAlt className="mt-0.5 text-blue-500 flex-shrink-0" size={14} />
                <span className="line-clamp-1">{attraction.address}</span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {attraction.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {attraction.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FaInfoCircle className="text-gray-400" size={12} />
                  {attraction.latitude.toFixed(4)}, {attraction.longitude.toFixed(4)}
                </span>
                {/* <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                  View Details
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalItems > 0 && renderPagination()}
    </div>
  );
};

export default AttractionList;