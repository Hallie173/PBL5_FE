import React from "react";
import "./Article.scss";
import authoravatar from "../../assets/images/avatar.png";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BASE_URL from "../../constants/BASE_URL";
import axios from "axios";

const Article = () => {
    const { id: articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [author, setAuthor] = useState(null);
    useEffect(() => {
        if (!articleId) return;
        const fetchArticle = async () => {
            try {
                const articleRespone = await axios.get(`${BASE_URL}/articles/${articleId}`);
                const articleData = articleRespone.data; // Dữ liệu nằm trong data.data theo controller
                setArticle(articleData);
                  console.log(article);
                  console.log(article.user_id);
                const authorRespone = await axios.get(`${BASE_URL}/users/${article.user_id}`);
                const authorData = authorRespone.data;
                setAuthor(authorData);

                console.log(author);
            } catch (error) {
            } finally {
            }
        }
        fetchArticle();
    }, [articleId]);
    return (
        <div className="article-container">
            <nav className="breadcrumb">
                <span>All Articles &gt; Article Detail</span>
            </nav>
            <div className="article-header">
                <h1 className="article-title">{article?.title}</h1>
                <div className="info-container">
                    <div className="author-info">
                        <img src={authoravatar} alt="Author" className="author-avatar" />
                        <span className="author-name">Author: {author?.username}</span>
                    </div>
                    <p className="article-date">Published on: {new Date(article?.created_at).toDateString()}</p>
                </div>
            </div>
            <div className="article-content">
                <div className="article-picture">
                    <img src={article?.images} alt="Article" className="article-image" />
                    <div className="image-description">{article?.title}</div>
                </div>
                <p className="article-description">
                    {article?.content}
                </p>
            </div>

            <hr />

            <div className="article-footer">
                <div className="related-articles">Related Articles</div>
                <div className="article-list">
                    <div className="article-card">
                        <img src="" />
                        <div className="article-content">
                            <div className="upper-content">
                                <span className="category"></span>
                                <h3></h3>
                                <p></p>
                            </div>
                            <div className="article-footer">
                                <span className="author"></span>
                                <span className="date"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Article;