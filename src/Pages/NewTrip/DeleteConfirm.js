import React from "react";
import "./DeleteConfirm.scss";

const DeleteConfirm = ({ isOpen, onConfirm, onCancel, message = "Are you sure you want to delete this item?" }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-confirm-overlay">
            <div className="delete-confirm-box">
                <div className="delete-confirm-message">{message}</div>
                <div className="delete-confirm-buttons">
                    <button className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="confirm-btn" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;