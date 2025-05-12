import React from "react";
import "./Loading.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-modal">
      <div className="loading-overlay"></div>
      <div className="loading-box">
        <FontAwesomeIcon
          icon={faSpinner}
          className="loading-spinner"
          aria-label="Loading"
        />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loading;
