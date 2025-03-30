import React from "react";
import "./Navbar.css";
import { FaGlobe } from "react-icons/fa"; // Import icon trái đất
import weblogo from "../../views/webLogo.png";
import { Link } from "react-router-dom";
import avatar from "../../assets/images/avatar.png";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <span className="logo">
                    <Link to="/tripguide/homepage">
                        <img src={weblogo} className="location-icon" />
                    </Link>
                </span>
                <ul className="nav-links">
                    <li><Link to="/tripguide/articles">Articles</Link></li>
                    <li>Trips</li>
                    <li>Review</li>
                    <li>More</li>
                </ul>
            </div>
            <div className="navbar-right">
                <FaGlobe className="icon" />
                <span className="currency">USD</span>
                <img
                    src={avatar}
                    alt="Profile"
                    className="profile-pic"
                />
            </div>
        </nav>
    );
}

export default Navbar;
