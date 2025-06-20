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
  FaUser,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import weblogo from "../../views/webLogo.png";
import avatar from "../../assets/images/avatar.png";
import LoginModal from "../../components/LoginModal/LoginModal";
import RegisterModal from "../../components/RegisterModal/RegisterModal";
import ForgotPasswordModal from "../../components/ForgotPasswordModal/ForgotPasswordModal";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const location = useLocation();

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setLanguageMenuOpen(false);
  };

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
    setShowForgotPasswordModal(false);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
    setShowForgotPasswordModal(false);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
    setShowForgotPasswordModal(false);
  };

  const handleSwitchToForgotPassword = () => {
    setShowRegisterModal(false);
    setShowLoginModal(false);
    setShowForgotPasswordModal(true);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowForgotPasswordModal(false);
  };

  const handleLoginSuccess = () => {
    handleCloseModals();
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (
        !e.target.closest(".language-menu") &&
        !e.target.closest(".user-menu") &&
        !e.target.closest(".login-modal") &&
        !e.target.closest(".register-modal") &&
        !e.target.closest(".forgot-password-modal")
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
      path: "/",
      icon: <FaCompass className="mr-2" />,
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

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return location.pathname.includes(path) && path !== "/";
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  className="h-8 w-8 mr-2 object-contain"
                  src={weblogo}
                  alt="TripGuide"
                  width={32}
                  height={32}
                />
                <span className="font-bold text-xl text-green-600">
                  TripGuide
                </span>
              </Link>
            </div>
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
            <div className="flex items-center">
              <div className="relative ml-3 language-menu">
                <button
                  onClick={toggleLanguageMenu}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  <FaGlobe className="text-lg mr-1" />
                  <span>EN</span>
                  <FaChevronDown className="ml-1 text-xs" />
                </button>
                {languageMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-md py-1 bg-white ring-1 ring-gray-200 z-10">
                    <a
                      href="#"
                      className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-xs font-medium">
                        US
                      </span>
                      English
                    </a>
                    <a
                      href="#"
                      className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-xs font-medium">
                        VN
                      </span>
                      Tiếng Việt
                    </a>
                    <a
                      href="#"
                      className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-xs font-medium">
                        FR
                      </span>
                      Français
                    </a>
                  </div>
                )}
              </div>
              {!isLoggedIn ? (
                <button
                  onClick={handleOpenLoginModal}
                  className="ml-4 bg-black text-white font-semibold px-4 py-2 rounded-2xl hover:bg-gray-800 transition-colors flex items-center min-w-[80px]"
                >
                  <span>Sign in</span>
                </button>
              ) : (
                <div className="relative ml-3 user-menu">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center"
                    aria-label="User menu"
                  >
                    <div className="h-8 w-8 rounded-full border border-gray-200 overflow-hidden">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="User"
                          className="h-full w-full object-cover"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <img
                          src={avatar}
                          alt="Default avatar"
                          className="h-full w-full object-cover"
                          width={32}
                          height={32}
                        />
                      )}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-md py-1 bg-white ring-1 ring-gray-200 z-10">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.username || "Guest"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || ""}
                        </p>
                      </div>
                      <Link
                        to="/tripguide/profile"
                        className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <CgProfile className="inline-block mr-2 text-gray-500" />
                        Profile
                      </Link>
                      <Link
                        to="/tripguide/mytrip"
                        className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <FaMapMarkedAlt className="inline-block mr-2 text-gray-500" />
                        My Trips
                      </Link>
                      <Link
                        to="/tripguide/saved-places"
                        className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <FaMapMarkerAlt className="inline-block mr-2 text-gray-500" />
                        Saved Places
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/tripguide/admin"
                          className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <FaUser className="inline-block mr-2 text-gray-500" />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1"></div>
                      <button
                        onClick={logout}
                        className=" w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                      >
                        <LuLogOut className="inline-block mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 login-modal"
          style={{ overflow: "hidden" }}
        >
          <LoginModal
            onSwitchToRegister={handleSwitchToRegister}
            onClose={handleCloseModals}
            onLoginSuccess={handleLoginSuccess}
            login={login}
          />
        </div>
      )}
      {showRegisterModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 register-modal"
          style={{ overflow: "hidden" }}
        >
          <RegisterModal
            onSwitchToLogin={handleSwitchToLogin}
            onClose={handleCloseModals}
          />
        </div>
      )}
      {showForgotPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 forgot-password-modal"
          style={{ overflow: "hidden" }}
        >
          <ForgotPasswordModal
            onClose={handleCloseModals}
            onBackToLogin={handleSwitchToLogin}
          />
        </div>
      )}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;
