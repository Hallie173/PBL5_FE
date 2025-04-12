import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaGlobe,
  FaChevronDown,
  FaMapMarkedAlt,
  FaNewspaper,
  FaStar,
  FaCompass,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import weblogo from "../../views/webLogo.png";
import avatar from "../../assets/images/avatar.png";

function Navbar() {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setLanguageMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (
        !e.target.closest(".language-menu") &&
        !e.target.closest(".user-menu")
      ) {
        setLanguageMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  const navItems = [
    {
      name: "Explore",
      path: "/tripguide/homepage",
      icon: <FaCompass className="mr-2" />,
    },
    {
      name: "Articles",
      path: "/tripguide/articles",
      icon: <FaNewspaper className="mr-2" />,
    },
    {
      name: "Trips",
      path: "/tripguide/mytrip",
      icon: <FaMapMarkedAlt className="mr-2" />,
    },
    {
      name: "Reviews",
      path: "/tripguide/review",
      icon: <FaStar className="mr-2" />,
    },
  ];

  // Check if path is active
  const isActive = (path) => {
    if (
      path === "/tripguide/homepage" &&
      location.pathname === "/tripguide/homepage"
    ) {
      return true;
    }
    return location.pathname.includes(path) && path !== "/tripguide/homepage";
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/tripguide/homepage" className="flex items-center">
                <img
                  className="h-8 w-auto mr-2"
                  src={weblogo}
                  alt="TripGuide"
                />
                <span className="font-bold text-xl text-green-600">
                  TripGuide
                </span>
              </Link>
            </div>

            {/* Center Nav */}
            <div className="flex items-center justify-center flex-1">
              <div className="flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium ${isActive(item.path)
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-700 hover:text-green-600"
                      }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side elements */}
            <div className="flex items-center">
              {/* Language Selector */}
              <div className="relative ml-3 language-menu">
                <button
                  onClick={toggleLanguageMenu}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  <FaGlobe className="text-lg mr-1" />
                  <span>EN</span>
                  <FaChevronDown className="ml-1 text-xs" />
                </button>

                {/* Language Dropdown */}
                {languageMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-md py-1 bg-white ring-1 ring-gray-200 z-10">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-xs font-medium">
                        US
                      </span>
                      English
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-xs font-medium">
                        VN
                      </span>
                      Tiếng Việt
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-xs font-medium">
                        FR
                      </span>
                      Français
                    </a>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative ml-3 user-menu">
                <button onClick={toggleUserMenu} className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                    src={avatar}
                    alt="User"
                  />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-md py-1 bg-white ring-1 ring-gray-200 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        John Traveler
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        john.traveler@example.com
                      </p>
                    </div>
                    <Link to="/tripguide/user-profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <CgProfile className="inline-block mr-2 text-gray-500" />
                      Profile
                    </Link>
                    <Link to="/tripguide/mytrip"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <FaMapMarkedAlt className="inline-block mr-2 text-gray-500" />
                      My Trips
                    </Link>
                    <Link to="/tripguide/saved-places"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <FaMapMarkerAlt className="inline-block mr-2 text-gray-500" />
                      Saved Places
                    </Link>
                    <div className="border-t border-gray-100 mt-1"></div>
                    <Link
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <LuLogOut className="inline-block mr-2" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer div to create space between navbar and content */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;
