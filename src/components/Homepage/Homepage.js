import React from "react";
import "./Homepage.css";
import { FaSearch } from "react-icons/fa";

function Homepage() {
    return (
        <div className="homepage">
            {/* Phần tìm kiếm */}
            <div className="search-container">
                <h1 className="search-title">Where to?</h1>
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Places to go, things to do, hotels..." />
                    <button className="search-button">Search</button>
                </div>
            </div>

            {/* Phần ảnh lớn */}
            <div className="featured-container">
                <img
                    src="https://source.unsplash.com/900x500/?snorkeling,mountains"
                    alt="Featured"
                    className="featured-image"
                />
                <div className="featured-overlay">
                    <h2>The 2025 Tripadvisor Trendcast</h2>
                    <p>Forecasting the future of travel—now.</p>
                    <button className="featured-button">Check it out</button>
                </div>
            </div>

            {/* Recently Viewed */}
            <div className="recently-viewed">
                <h2>Recently viewed</h2>
                <div className="recently-grid">
                    <div className="recent-item">
                        <img src="https://source.unsplash.com/200x200/?cafe" alt="Cong Ca Phe" />
                        <p>Cong Ca Phe</p>
                    </div>
                    <div className="recent-item">
                        <img src="https://source.unsplash.com/200x200/?mountains" alt="Marble Mountains" />
                        <p>The Marble Mountains</p>
                    </div>
                    <div className="recent-item">
                        <img src="https://source.unsplash.com/200x200/?museum" alt="Da Nang Museum" />
                        <p>Bao Tang Da Nang - Da Nang Museum</p>
                    </div>
                    <div className="recent-item">
                        <img src="https://source.unsplash.com/200x200/?bridge" alt="Dragon Bridge" />
                        <p>Dragon Bridge</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
