import React from "react";
import "./Homepage.css";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import trendcast from "../../views/trendcast.png";
import golemcafe from "../../assets/images/golemcafe.png";
import marblemountains from "../../assets/images/marblemountains.png";
import danangmuseum from "../../assets/images/danangmuseum.png";
import dragonbridge from "../../assets/images/dragonbridge.png";
import burgerbros from "../../assets/images/burgerbros.png";
import banhxeobaduong from "../../assets/images/banhxeobaduong.png";
import madamelan from "../../assets/images/madamelan.png";
import quancomhuengon from "../../assets/images/quancomhuengon.png";


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
                    src={trendcast}
                    alt="Featured"
                    className="featured-image"
                />
                <div className="featured-overlay">
                    <h2>The 2025 Tripadvisor Trendcast</h2>
                    <p>Forecasting the future of travel—now.</p>
                    <button className="featured-button">Check it out</button>
                </div>
            </div>

            <hr />

            {/* Recently Viewed */}
            <div className="recently-viewed">
                <h2>Recently viewed</h2>
                <div className="picture-grid">
                    <div className="picture-item">
                        <div className="item-content">
                            <img src={golemcafe} alt="Golem Cafe" />
                            <div className="save-overlay">
                                <button className="save-button-overlay">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="heart-icon-recent"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                        <p>Golem Cafe</p>
                    </div>
                    <div className="picture-item">
                        <div className="item-content">
                            <img src={marblemountains} alt="Marble Mountains" />
                            <div className="save-overlay">
                                <button className="save-button-overlay">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="heart-icon-recent"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                        <p>The Marble Mountains</p>
                    </div>
                    <div className="picture-item">
                        <div className="item-content">
                            <img src={danangmuseum} alt="Da Nang Museum" />
                            <div className="save-overlay">
                                <button className="save-button-overlay">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="heart-icon-recent"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                        <p>Bao Tang Da Nang - Da Nang Museum</p>
                    </div>
                    <div className="picture-item">
                        <div className="item-content">
                            <img src={dragonbridge} alt="Dragon Bridge" />
                            <div className="save-overlay">
                                <button className="save-button-overlay">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="heart-icon-recent"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                        <p>Dragon Bridge</p>
                    </div>
                </div>
            </div>

            {/* You Might Like These */}
            <div className="you-might-like">
                <h2>You might like these</h2>
                <p>More restaurants in Da Nang</p>
                <div className="picture-grid">
                    <div className="picture-item">
                        <div className="item-content">
                            <img src={burgerbros} alt="Burger Bros" />
                            <div className="save-overlay">
                                <button className="save-button-overlay">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="heart-icon-recent"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                        <p>Burger Bros</p>
                    </div>
                    <div className="picture-item">
                        <div className="item-content">
                            <img src={banhxeobaduong} alt="Banh Xeo Ba Duong" />
                            <div className="save-overlay">
                                <button className="save-button-overlay">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="heart-icon-recent"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                        <p>Banh Xeo Ba Duong</p>
                    </div>
                    <div className="picture-item">
                        <div className="item-content">
                            <img src={madamelan} alt="Madame Lân" />
                            <div className="save-overlay">
                                <button className="save-button-overlay">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="heart-icon-recent"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                        <p>Madame Lân</p>
                    </div>
                    <div className="picture-item">
                        <div className="item-content">
                            <img src={quancomhuengon} alt="Quan Com Hue Ngon" />
                            <div className="save-overlay">
                                <button className="save-button-overlay">
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="heart-icon-recent"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                        <p>Quan Com Hue Ngon</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Homepage;
