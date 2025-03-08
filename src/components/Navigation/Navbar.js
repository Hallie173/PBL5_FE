import React from "react";
import "./Navbar.css";
import { FaGlobe } from "react-icons/fa"; // Import icon trái đất
import weblogo from "../../views/webLogo.png";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <span className="logo">
                    <img src={weblogo} className="location-icon" />
                </span>
                <ul className="nav-links">
                    <li>Articles</li>
                    <li>Trips</li>
                    <li>Review</li>
                    <li>More</li>
                </ul>
            </div>
            <div className="navbar-right">
                <FaGlobe className="icon" />
                <span className="currency">USD</span>
                <img
                    src="https://via.placeholder.com/30"
                    alt="Profile"
                    className="profile-pic"
                />
            </div>
        </nav>
    );
}

export default Navbar;
