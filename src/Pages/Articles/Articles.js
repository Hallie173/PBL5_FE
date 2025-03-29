import React, { useState } from "react";
import "./Articles.css";

const articlesData = [
    {
        category: "Travel Tips",
        title: "Maldives on a Budget",
        description: "How to experience luxury paradise without breaking the bank.",
        author: "Emma Davis",
        date: "March 3, 2025",
        image: "https://source.unsplash.com/400x300/?maldives,travel",
    },
    {
        category: "Culture",
        title: "Exploring Marrakech’s Medina",
        description: "Navigate the enchanting maze of Morocco’s most famous marketplace.",
        author: "Ahmed Hassan",
        date: "March 1, 2025",
        image: "https://source.unsplash.com/400x300/?morocco,market",
    },
    {
        category: "Adventure",
        title: "Chasing Northern Lights",
        description: "Complete guide to viewing the Aurora Borealis in Iceland.",
        author: "Nina Berg",
        date: "February 28, 2025",
        image: "https://source.unsplash.com/400x300/?aurora,northernlights",
    },
    // Thêm nhiều bài viết khác nếu cần...
];

function Articles() {
    const [articles, setArticles] = useState(articlesData);
    const [page, setPage] = useState(1);
    const articlesPerPage = 3;
    const totalPages = 6;

    const handleLoadMore = () => {
        const newArticles = [
            {
                category: "Nature",
                title: "Discovering the Amazon Rainforest",
                description: "A journey into the heart of the world's largest rainforest.",
                author: "Carlos Mendez",
                date: "February 20, 2025",
                image: "https://source.unsplash.com/400x300/?amazon,rainforest",
            },
        ];
        setArticles([...articles, ...newArticles]);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

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
                {articles.slice(0, articlesPerPage).map((article, index) => (
                    <div className="article-card" key={index}>
                        <img src={article.image} alt={article.title} />
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

            <button className="load-more-btn" onClick={handleLoadMore}>Load More Articles</button>

            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={page === index + 1 ? "page-btn active" : "page-btn"}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button className="page-btn">...</button>
                <button className="page-btn">→</button>
            </div>
        </div>
    );
}

export default Articles;
