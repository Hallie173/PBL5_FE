import React from "react";
import "./NewArticle.scss";

function NewArticle() {
    return (
        <div className="new-article-container">
            <h1 className="new-article">Share your travel experiences!</h1>
            <div className="write-page">
                <div
                    className="article-title"
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    data-placeholder="Enter your story title here"
                ></div>

                <hr />

                <div
                    className="editor"
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    placeholder="Start writing your story here..."
                ></div>

                <button className="btn-submit">Publish</button>
            </div>

        </div>
    );
}

export default NewArticle;