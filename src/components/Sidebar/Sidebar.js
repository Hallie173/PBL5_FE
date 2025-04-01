import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiGlobe,
  FiCalendar,
  FiFileText,
  FiStar,
  FiMessageSquare,
  FiActivity,
  FiLogOut,
} from "react-icons/fi";
import { BiLandscape } from "react-icons/bi";
import { IoRestaurantOutline } from "react-icons/io5";

export default function Sidebar({ expanded, setExpanded }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    const matchedItem = menuItems.find(
      (item) => item.name.toLowerCase() === path.toLowerCase()
    );
    setActiveItem(matchedItem ? matchedItem.name : "Dashboard");
  }, [location]);

  const menuItems = [
    { name: "Dashboard", icon: FiHome },
    { name: "Users", icon: FiUsers },
    { name: "Cities", icon: FiGlobe },
    { name: "Attractions", icon: BiLandscape },
    { name: "Restaurants", icon: IoRestaurantOutline },
    { name: "Itineraries", icon: FiCalendar },
    { name: "Articles", icon: FiFileText },
    { name: "Reviews", icon: FiStar },
    { name: "Chat Logs", icon: FiMessageSquare },
    { name: "Analytics", icon: FiActivity },
  ];

  const userDropdownItems = [{ name: "Logout", icon: FiLogOut }];

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
        aria-label="Toggle menu"
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
          bg-white border-r
          ${expanded ? "w-64" : "w-20"}
          shadow-xl`}
      >
        <div className="flex-grow px-3 py-6 overflow-y-auto">
          {/* Logo */}
          <a href="#" className="flex items-center mb-8 ps-2 justify-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span
                className={`ml-3 text-xl font-bold text-gray-800 transition-opacity duration-300 ${
                  !expanded ? "opacity-0 w-0 hidden" : "opacity-100"
                }`}
              >
                TravelApp
              </span>
            </div>
          </a>
          {/* Menu items */}
          <ul className="space-y-2 font-medium mt-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <li key={index}>
                  <Link
                    to={`/tripguide/admin/${item.name.toLowerCase()}`}
                    className={`flex items-center p-3 rounded-lg text-gray-700 
                      transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 hover:text-gray-900"
                      }
                      ${expanded ? "" : "justify-center"}`}
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
          <div
            onClick={() => {
              if (expanded) setShowUserDropdown(!showUserDropdown);
            }}
            className={`flex items-center ${
              expanded ? "" : "justify-center"
            } p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer`}
          >
            <img
              src="https://img.freepik.com/premium-vector/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.jpg"
              alt="Avatar"
              className={`object-cover ${
                expanded ? "w-10 h-10" : "w-8 h-8"
              } rounded-full border-2 border-gray-300`}
            />
            <div
              className={`ml-3 transition-all duration-300 ${
                !expanded ? "opacity-0 w-0 hidden" : "opacity-100"
              }`}
            >
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          {/* User Dropdown */}
          {showUserDropdown && expanded && (
            <div className="absolute bottom-full left-0 w-full p-2 mb-2">
              <div className="bg-white border rounded-lg shadow-lg">
                {userDropdownItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => setShowUserDropdown(false)}
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
