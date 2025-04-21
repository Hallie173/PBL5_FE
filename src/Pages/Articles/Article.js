import React from "react";
import "./Article.scss";
import authoravatar from "../../assets/images/avatar.png";
import vuonquocgia from "../../assets/images/Cities/vuonquocgia.png";

function Article() {
    return (
        <div className="article-container">
            <nav className="breadcrumb">
                <span>All Articles &gt; </span>
            </nav>
            <div className="article-header">
                <h1 className="article-title">Which Is The Best National Park?</h1>
                <div className="info-container">
                    <div className="author-info">
                        <img src={authoravatar} alt="Author" className="author-avatar" />
                        <span className="author-name">Author: PHLD</span>
                    </div>
                    <p className="article-date">Published on: April 13, 2025</p>
                </div>
            </div>
            <div className="article-content">
                <div className="article-picture">
                    <img src={vuonquocgia} alt="Article" className="article-image" />
                    <div className="image-description">Viet Nam National Park</div>
                </div>
                <p className="article-description">
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
                    This is a sample description of the article. It provides an overview of the content and engages the reader.
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