import React from "react";
import "./NewArticle.scss";

function NewArticle() {
    return (
        <div className="new-article-container">
            <h1 className="new-article-title">Create new article</h1>
            <form className="new-article-form">

                <button type="submit" className="btn-submit">Submit</button>
            </form>
        </div>
    );
}

export default NewArticle;