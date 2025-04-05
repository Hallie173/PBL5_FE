import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const RestaurantList = ({ restaurants, onEdit, onDelete, cities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);

  const getCityName = (cityId) => {
    const city = cities.find((c) => c.city_id === cityId);
    return city ? city.name : "Unknown City";
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((restaurant) => (
          <div
            key={restaurant.restaurant_id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-102"
          >
            <div className="relative h-48">
              <img
                src={
                  restaurant.image_urls?.[0] ||
                  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/af/c0/f4/outside.jpg?w=700&h=400&s=1"
                }
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 rounded-md px-2 py-1 flex items-center gap-1 text-xs font-medium">
                <FaMapMarkerAlt className="text-blue-500" />
                {getCityName(restaurant.city_id)}
              </div>
              <div className="absolute top-3 right-3 bg-white/90 rounded-md px-2 py-1 flex items-center gap-1 text-xs font-medium">
                <FaStar className="text-yellow-400" />
                {restaurant.average_rating.toFixed(1)}
              </div>
              {restaurant.reservation_required && (
                <div className="absolute bottom-3 left-3 bg-red-500 text-white rounded-md px-2 py-1 text-xs font-medium">
                  Reservation Required
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {restaurant.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {restaurant.description}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                <FaMapMarkerAlt className="inline mr-1" />
                {restaurant.address}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <FaPhone className="inline mr-1" />
                {restaurant.phone_number}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <FaClock className="inline mr-1" />
                {formatTime(restaurant.open_time)} -{" "}
                {formatTime(restaurant.close_time)}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => onEdit(restaurant)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit restaurant"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(restaurant.restaurant_id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete restaurant"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {restaurants.length > itemsPerPage && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;