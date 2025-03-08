import React from "react";
import ReactDOM from "react-dom/client"; // Dùng "react-dom/client" thay vì "react-dom"
import App from "./views/App";
import reportWebVitals from "./reportWebVitals";
import "./styles/global.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
