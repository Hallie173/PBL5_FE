import React, { useState } from "react";
import "./Articles.scss";
import maldives from "../../assets/images/Cities/maldives.png";
import marrakech from "../../assets/images/Cities/marrakech.png";
import winterlondon from "../../assets/images/Cities/winterlondon.png";
import amazonrainforest from "../../assets/images/Cities/amazonrainforest.png";
import asiapark from "../../assets/images/Cities/asiapark.png";
import { Link } from "react-router-dom";

// Giả lập nhiều bài viết để thử phân trang
const articlesData = Array.from({ length: 24 }, (_, i) => ({
    category: "Sample Category",
    title: `Article Title ${i + 1}`,
    description: `Sample description for article ${i + 1}`,
    author: `Author ${i + 1}`,
    date: `April ${i + 1}, 2025`,
    image: [maldives, marrakech, winterlondon, amazonrainforest][i % 4],
}));

const Pagination = ({ page, totalPages, handlePageChange }) => {
    const pagesPerGroup = 6;
    const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    const currentGroup = Math.floor((page - 1) / pagesPerGroup);
    const [visibleGroup, setVisibleGroup] = useState(currentGroup);

    const startPage = visibleGroup * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

    const showNextGroup = () => {
        if (visibleGroup < totalGroups - 1) {
            setVisibleGroup(visibleGroup + 1);
        }
    };

    const showPrevGroup = () => {
        if (visibleGroup > 0) {
            setVisibleGroup(visibleGroup - 1);
        }
    };

    return (
        <div className="pagination-container flex justify-center mt-4 gap-2 flex-wrap">
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="pagination-arrow rounded-l-md"
            >
                ←
            </button>

            {visibleGroup > 0 && (
                <button onClick={showPrevGroup} className="pagination-page">
                    ...
                </button>
            )}

            {[...Array(endPage - startPage + 1)].map((_, index) => {
                const pageNumber = startPage + index;
                return (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`pagination-page ${page === pageNumber ? "pagination-page-active" : ""}`}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {visibleGroup < totalGroups - 1 && (
                <button onClick={showNextGroup} className="pagination-page">
                    ...
                </button>
            )}

            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="pagination-arrow rounded-r-md"
            >
                →
            </button>
        </div>
    );
};

function Articles() {
    const [page, setPage] = useState(1);
    const articlesPerPage = 8;
    const totalPages = Math.ceil(articlesData.length / articlesPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="articles-container">
            <div className="featured-article">
                <div className="featured-image">
                    <img src={asiapark} alt="Featured" />
                </div>
                <div className="featured-content">
                    <h2>Share your experiences and advices</h2>
                    <div className="new-article-button">
                        <Link to="/tripguide/articles/new" className="create-article-button">+ New Article</Link>
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
                {articlesData
                    .slice((page - 1) * articlesPerPage, page * articlesPerPage)
                    .map((article, index) => (
                        <div className="article-card" key={index}>
                            <img src={article.image} alt={article.title} />
                            <div className="article-content">
                                <div className="upper-content">
                                    <span className="category">{article.category}</span>
                                    <h3>{article.title}</h3>
                                    <p>{article.description}</p>
                                </div>
                                <div className="article-footer">
                                    <span className="author">{article.author}</span>
                                    <span className="date">{article.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
        </div>
    );
}

export default Articles;
