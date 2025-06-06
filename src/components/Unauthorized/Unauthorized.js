import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.scss";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="unauthorized">
      <div className="unauthorized__content">
        <div className="unauthorized__header">
          <div className="unauthorized__status">403</div>
          <h1>Access Denied</h1>
          <p>Sorry, you are not authorized to access this page.</p>
        </div>
        <div className="unauthorized__actions">
          <button className="btn btn--secondary" onClick={goBack}>
            Go Back
          </button>
          <button className="btn btn--primary" onClick={goHome}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
