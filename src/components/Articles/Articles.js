import React from "react";
import "./Articles.css";

const articles = [
    {
        category: "Destinations",
        title: "The Ultimate Guide to Santorini",
        description: "Everything you need to know about visiting the most iconic Greek island.",
        author: "Mike Chen",
        date: "March 10, 2025",
        image: "https://source.unsplash.com/400x300/?santorini,travel",
    },
    {
        category: "Food & Dining",
        title: "Best Street Food in Tokyo",
        description: "A culinary journey through Tokyo’s most delicious street food spots.",
        author: "Lisa Wong",
        date: "March 8, 2025",
        image: "https://source.unsplash.com/400x300/?sushi,food",
    },
    {
        category: "Adventure",
        title: "Hiking the Inca Trail",
        description: "Essential tips for conquering the famous trek to Machu Picchu.",
        author: "Tom Wilson",
        date: "March 5, 2025",
        image: "https://source.unsplash.com/400x300/?hiking,mountains",
    },
];

function Articles() {
    return (
        <div className="articles-container">
            <div className="featured-article">

                <div className="featured-content">
                    <span className="featured-badge">Featured</span>
                    <h2>10 Most Beautiful Hidden Gems in Europe</h2>
                    <p>Discover unexplored destinations that will take your breath away</p>
                    <div className="author-info">

                        <div>
                            <p className="author-name">Sarah Johnson</p>
                            <p className="date">March 15, 2025</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="categories">
                <button className="active">All Articles</button>
                <button>Destinations</button>
                <button>Travel Tips</button>
                <button>Food & Dining</button>
                <button>Culture</button>
                <button>Adventure</button>
            </div>

            <div className="article-list">
                {articles.map((article, index) => (
                    <div className="article-card" key={index}>
                        <div className="article-content">
                            <span className="category">{article.category}</span>
                            <h3>{article.title}</h3>
                            <p>{article.description}</p>
                            <div className="article-footer">
                                <span className="author">{article.author}</span>
                                <span className="date">{article.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Articles;
