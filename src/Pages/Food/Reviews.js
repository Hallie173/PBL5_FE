import React from "react";
import "./Restaurant.css";

const Reviews = () => {
    return (
        <div className="reviews">
            <h2>Contribute</h2>
            <div className="review-actions">
                <button>Write a review</button>
                <button>Upload a photo</button>
                <button>Ask a question</button>
            </div>

            <h3>Reviews</h3>
            <div className="review-summary">
                <p><b>4.0</b> ⭐⭐⭐⭐☆</p>
                <p>75 Excellent, 66 Very Good, 29 Average, 8 Poor, 3 Terrible</p>
            </div>

            <div className="review">
                <h4>Vietnam Chicken Rice</h4>
                <p><i>Oct 2019 - none</i></p>
                <p>Visited last year when traveling to central Vietnam...</p>
                <button>Read more</button>
            </div>
        </div>
    );
};

export default Reviews;
