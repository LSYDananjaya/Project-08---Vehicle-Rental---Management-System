import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "../styles/Navbar.css"; // External CSS for custom styling

const Navbar = () => {
  const [hover, setHover] = useState(false);

  return (
    <nav
      className="fixed-top d-flex align-items-center justify-content-between px-4"
      style={{
        height: "5rem",
        width: "100vw",
        zIndex: 50,
        backgroundColor: "#005f99", // Darker blue background for better contrast
        fontFamily: "Russo One, sans-serif",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Deeper shadow for more depth
      }}
    >
      {/* Left - Navigation Links */}
      <div
        className="d-flex align-items-center"
        style={{
          height: "4rem",
          width: "25%",
        }}
      >
        <Link
          to="/reservation"
          className="nav-link text-light"
          style={{
            fontWeight: "500",
            fontSize: "1.5rem", // Larger font size for better visibility
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faCar}
            style={{
              height: "1.8rem",
              marginRight: "0.8rem",
              color: "#ffffff",
            }}
          />
          Vehicle Rental
        </Link>
      </div>

      {/* Middle - Centered Title */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: "4rem",
          width: "50%",
        }}
      >
        <h2
          className="text-light"
          style={{
            margin: 0,
            fontWeight: "600",
            fontSize: "2rem", // Increase font size for clarity
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Text shadow for better contrast
          }}
        >
          Welcome to Vehicle Rental
        </h2>
      </div>

      {/* Right - Profile Icon */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: "4rem",
          width: "10%",
        }}
      >
        <Link to="/profile" style={{ textDecoration: "none" }}>
          <FontAwesomeIcon
            icon={faUserCircle}
            className={`transition ${hover ? "text-light" : ""}`}
            style={{
              color: "#ffffff",
              height: "3rem", // Slightly larger icon
              cursor: "pointer",
              transform: hover ? "scale(1.2)" : "scale(1)",
              transition: "transform 0.3s ease, color 0.3s ease", // Smoother hover transition
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
