import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP } from "react-icons/fa";
import weblogo from "../../views/webLogo.png";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <span className="logo">
                        <img src={weblogo} className="footer-logo" />
                    </span>
                    <p>Your trusted companion for travel inspiration and guides.</p>
                </div>
                <div className="footer-section">
                    <h3>Explore</h3>
                    <ul>
                        <li><a href="#">Articles</a></li>
                        <li><a href="#">My Trips</a></li>
                        <li><a href="#">Write a review</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaPinterestP /></a>
                    </div>
                </div>
            </div>
            <hr />
            <p className="footer-copy">&copy; 2025 TripGuide. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
