import React, { useEffect, useState } from "react";
import "./AllArticles.scss";
import maldives from "../../assets/images/Cities/maldives.png";
import marrakech from "../../assets/images/Cities/marrakech.png";
import winterlondon from "../../assets/images/Cities/winterlondon.png";
import amazonrainforest from "../../assets/images/Cities/amazonrainforest.png";
import asiapark from "../../assets/images/Cities/asiapark.png";
import { Link } from "react-router-dom";
import BASE_URL from "../../constants/BASE_URL";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Giả lập nhiều bài viết để thử phân trang
// const articlesData = Array.from({ length: 24 }, (_, i) => ({
//     category: "Sample Category",
//     title: `Article Title ${i + 1}`,
//     description: `Sample description for article ${i + 1}`,
//     author: `Author ${i + 1}`,
//     date: `April ${i + 1}, 2025`,
//     image: [maldives, marrakech, winterlondon, amazonrainforest][i % 4],
// }));

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

const AllArticles = () => {
    const [page, setPage] = useState(1);
    const articlesPerPage = 8;
    const [articles, setArticles] = useState([]);
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    const navigate = useNavigate();
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handlenavigate_article = async (article_id) => {
        try {
            console.log("Article_id", article_id);
            navigate(`/tripguide/articles/${article_id}`);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articleRespone = await axios.get(`${BASE_URL}/articles`);
                const articleData = articleRespone.data;
                setArticles(articleData);

                const articlewithUser = await Promise.all(
                    articleData.map(async (article) => {
                        const userResponse = await axios.get(`${BASE_URL}/users/${article.user_id}`);
                        //console.log(userResponse.data.username);
                        return { ...article, userName: userResponse.data.username };
                    })
                );
            } catch (error) {
                console.error(error);
            } finally {

            }
        } 
        fetchArticles();
    },[]);

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
                {articles
                    .slice((page - 1) * articlesPerPage, page * articlesPerPage)
                    .map((article, index) => (
                        <div className="article-card" key={index}>
                            <img src={article.images} alt={article.title} onClick={() => handlenavigate_article(article.article_id)} />
                            <div className="article-content">
                                <div className="upper-content">
                                    <span className="category">Tourist Attraction</span>
                                    <h3 className="item-title">{article.title}</h3>
                                    <p>Sample description for article </p>
                                </div>
                                <div className="article-footer">
                                    <span className="author">Ahrumiki</span>
                                    <span className="date">{new Date(article?.created_at).toDateString()}</span>
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

export default AllArticles;
