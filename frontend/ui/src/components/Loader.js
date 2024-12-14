// src/components/Loader.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
