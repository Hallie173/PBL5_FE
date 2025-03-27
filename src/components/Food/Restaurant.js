import React from "react";
import "./Restaurant.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareShareNodes, faPen } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import comgaAHai1 from "../../assets/images/comgaahai1.png";
import comgaAHai2 from "../../assets/images/comgaahai2.png";

const Restaurant = () => {
    return (
        <div className="restaurant-container">
            <nav className="breadcrumb">
                <span>Asia &gt; Vietnam &gt; Da Nang &gt; Da Nang Restaurants &gt; Com Ga A.Hai</span>
            </nav>

            <header className="restaurant-header">
                <div className="name-and-action">
                    <h1>Com Ga A.Hai <span className="claim-status">Unclaimed</span></h1>
                    <div className="restaurant-action">
                        <button className="share-restaurant">
                            <FontAwesomeIcon
                                icon={faSquareShareNodes}
                                className="share-icon"
                            ></FontAwesomeIcon>
                            Share
                        </button>
                        <button className="review-restaurant">
                            <FontAwesomeIcon
                                icon={faPen}
                                className="review-icon"
                            ></FontAwesomeIcon>
                            Review
                        </button>
                        <button className="save-restaurant">
                            <FontAwesomeIcon
                                icon={faHeart}
                                className="heart-icon"
                            ></FontAwesomeIcon>
                            Save
                        </button>
                    </div>
                </div>
                <div className="rating">
                    <span>★★★★☆</span>
                    <span>177 reviews</span>
                    <span>#144 of 1,619 Restaurants in Da Nang</span>
                </div>
            </header>

            <div className="restaurant-images">
                <img src={comgaAHai1} alt="Restaurant Dish" className="main-image" />
                <div className="image-grid">
                    <img src={comgaAHai2} alt="Interior" />
                </div>
            </div>

            <nav className="tabs">
                <a href="#">Overview</a>
                <a href="#">Hours</a>
                <a href="#">Location</a>
                <a href="#">Reviews</a>
            </nav>

            <div className="restaurant-content">
                <h2>Overview</h2>
                <p>Com Ga A.Hai is a popular restaurant in Da Nang known for its delicious chicken rice...</p>
            </div>
        </div>
    );
};

export default Restaurant;
