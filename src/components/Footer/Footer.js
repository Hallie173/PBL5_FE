import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaMapMarkedAlt,
  FaNewspaper,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import weblogo from "../../views/webLogo.png";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with logo and sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div className="col-span-1">
            <Link to="/tripguide/homepage" className="flex items-center mb-4">
              <img className="h-8 w-auto mr-2" src={weblogo} alt="TripGuide" />
              <span className="font-bold text-xl text-green-600">
                TripGuide
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted companion for travel inspiration and guides around
              the world.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <FaPinterestP />
              </a>
            </div>
          </div>

          {/* Explore section */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/tripguide/homepage"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center"
                >
                  <FaMapMarkedAlt className="mr-2 text-sm" />
                  Discover Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/tripguide/articles"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center"
                >
                  <FaNewspaper className="mr-2 text-sm" />
                  Travel Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/tripguide/trips"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center"
                >
                  <FaMapMarkedAlt className="mr-2 text-sm" />
                  Plan Your Trip
                </Link>
              </li>
              <li>
                <Link
                  to="/tripguide/review"
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center"
                >
                  <FaStar className="mr-2 text-sm" />
                  Write a Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Company section */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Resources section */}
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} TripGuide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
