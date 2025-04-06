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
import "./Footer.css"; // Import file CSS riêng

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/tripguide/homepage" className="footer-logo">
              <img className="footer-logo-img" src={weblogo} alt="TripGuide" />
              <span className="footer-logo-text">TripGuide</span>
            </Link>
            <p className="footer-description">
              Your trusted companion for travel inspiration and guides around the world.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-icon"><FaFacebookF /></a>
              <a href="#" className="footer-social-icon"><FaTwitter /></a>
              <a href="#" className="footer-social-icon"><FaInstagram /></a>
              <a href="#" className="footer-social-icon"><FaPinterestP /></a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li>
                <Link to="/tripguide/homepage" className="footer-link">
                  <FaMapMarkedAlt className="footer-icon" />
                  Discover Destinations
                </Link>
              </li>
              <li>
                <Link to="/tripguide/articles" className="footer-link">
                  <FaNewspaper className="footer-icon" />
                  Travel Articles
                </Link>
              </li>
              <li>
                <Link to="/tripguide/trips" className="footer-link">
                  <FaMapMarkedAlt className="footer-icon" />
                  Plan Your Trip
                </Link>
              </li>
              <li>
                <Link to="/tripguide/review" className="footer-link">
                  <FaStar className="footer-icon" />
                  Write a Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
              <li><a href="#" className="footer-link">Help Center</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Cookie Policy</a></li>
              <li><a href="#" className="footer-link">Sitemap</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} TripGuide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
