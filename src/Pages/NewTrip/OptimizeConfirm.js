import React from "react";
import "./OptimizeConfirm.scss";

const OptimizeConfirm = ({
  isOpen,
  onConfirm,
  onCancel,
  message = "Optimize this Itinerary?",
}) => {
  if (!isOpen) return null;

  return (
    <div className="opt-confirm-overlay">
      <div className="opt-confirm-box">
        <div className="opt-confirm-message">{message}</div>
        <div className="opt-confirm-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            NO
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizeConfirm;
