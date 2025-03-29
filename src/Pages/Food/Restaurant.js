import React from "react";
import "./Restaurant.css";

const Restaurant = () => {
    return (
        <div className="restaurant-container">
            <nav className="breadcrumb">
                <span>Asia &gt; Vietnam &gt; Da Nang &gt; Da Nang Restaurants &gt; Com Ga A.Hai</span>
            </nav>

            <header className="restaurant-header">
                <h1>Com Ga A.Hai <span className="unclaimed">Unclaimed</span></h1>
                <div className="rating">
                    <span>★★★★☆</span>
                    <span>177 reviews</span>
                    <span>#144 of 1,619 Restaurants in Da Nang</span>
                </div>
            </header>

            <div className="restaurant-images">
                <img src="/restaurant-image.jpg" alt="Restaurant Dish" className="main-image" />
                <div className="image-grid">
                    <img src="/interior.jpg" alt="Interior" />
                    <img src="/food.jpg" alt="Food" />
                    <img src="/menu.jpg" alt="Menu" />
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
