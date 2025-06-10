import { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  FiHome,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiGlobe,
  FiLogOut,
} from "react-icons/fi";
import { BiLandscape } from "react-icons/bi";
import { IoRestaurantOutline } from "react-icons/io5";
import webLogo from "../../views/webLogo.png";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar({ expanded, setExpanded }) {
  const { user, isLoggedIn, logout } = useAuth();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); // For redirecting after logout

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update active menu item based on route
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const currentPath = pathSegments[pathSegments.length - 1] || "dashboard";
    const matchedItem = menuItems.find(
      (item) => item.path.toLowerCase() === currentPath.toLowerCase()
    );
    setActiveItem(matchedItem ? matchedItem.name : "Dashboard");
  }, [location]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/"); // Adjust the login route as needed
    }
  }, [isLoggedIn, navigate]);

  const menuItems = [
    { name: "Dashboard", icon: FiHome, path: "dashboard" },
    { name: "Users", icon: FiUsers, path: "users" },
    { name: "Cities", icon: FiGlobe, path: "cities" },
    { name: "Attractions", icon: BiLandscape, path: "attractions" },
    { name: "Restaurants", icon: IoRestaurantOutline, path: "restaurants" },
    // { name: "Itineraries", icon: FiCalendar, path: "itineraries" },
    { name: "Reviews", icon: FiStar, path: "reviews" },
  ];
  const userDropdownItems = [
    { name: "Logout", icon: FiLogOut },
    { name: "Home", icon: FiHome, path: "/" },
  ];

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => {
          setExpanded(!expanded);
          setShowUserDropdown(false);
        }}
        className={`fixed top-5 ${
          expanded ? "left-56" : "left-14"
        } z-50 p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 shadow-md transition-all duration-300 transform hover:scale-105`}
        aria-label={expanded ? "Collapse menu" : "Expand menu"}
      >
        {expanded ? (
          <FiChevronLeft className="w-5 h-5" />
        ) : (
          <FiChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen flex flex-col overflow-hidden transition-all duration-300 ease-in-out 
          bg-white border-r shadow-xl ${expanded ? "w-64" : "w-20"}`}
      >
        <div className="flex-grow px-3 py-6 overflow-y-auto">
          {/* Logo */}
          <Link
            to="/tripguide/admin/dashboard"
            className="flex items-center mb-8 ps-2 justify-center"
          >
            <img
              src={webLogo}
              alt="Website Logo"
              className={`transition-all duration-300 ${
                expanded ? "w-32" : "w-12"
              }`}
            />
          </Link>

          {/* Menu items */}
          <ul className="space-y-2 font-medium mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <li key={item.name}>
                  <Link
                    to={`/tripguide/admin/${item.path}`}
                    className={`flex items-center p-3 rounded-lg text-gray-700 
                      transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 hover:text-gray-900"
                      } ${expanded ? "" : "justify-center"}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors duration-200 ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-gray-800"
                      }`}
                    />
                    <span
                      className={`ms-3 whitespace-nowrap transition-all duration-300 ${
                        !expanded ? "opacity-0 w-0 hidden" : "opacity-100"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User profile at bottom */}
        <div ref={dropdownRef} className="p-4 border-t relative">
          {!isLoggedIn ? (
            <div className="flex items-center justify-center p-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ) : (
            <div
              onClick={() => expanded && setShowUserDropdown(!showUserDropdown)}
              className={`flex items-center ${
                expanded ? "" : "justify-center"
              } p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer`}
              aria-expanded={showUserDropdown}
            >
              <img
                src={user?.avatar_url}
                alt="User Avatar"
                className={`object-cover ${
                  expanded ? "w-10 h-10" : "w-8 h-8"
                } rounded-full border-2 border-gray-300`}
              />
              <div
                className={`ml-3 transition-all duration-300 ${
                  !expanded ? "opacity-0 w-0 hidden" : "opacity-100"
                }`}
              >
                <p className="text-sm font-medium text-gray-800">
                  {user?.full_name || "Guest"}
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          )}

          {/* User Dropdown */}
          {showUserDropdown && expanded && isLoggedIn && (
            <div className="absolute bottom-full left-0 w-full p-2 mb-2">
              <div className="bg-white border rounded-lg shadow-lg">
                {userDropdownItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.name}
                      to={item.path || "#"}
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (item.name === "Logout") {
                          logout();
                        }
                        navigate("/"); // Redirect to login
                      }}
                      className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      <Icon className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm text-gray-800">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
