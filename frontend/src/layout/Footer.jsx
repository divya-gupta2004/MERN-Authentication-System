import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";
import git from "../assets/git.png";
import linkedin from "../assets/linkedin.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>MERN Authentication</h2>
        </div>
        <div className="footer-social">
          <h3>Follow Me</h3>
          <div className="social-icons">        
            <Link
              to="https://linkedin.com/in/divya-gupta-888361289"
              target="_blank"
              className="social-link"
            >
              <img src={linkedin} alt="LinkedIn" />
            </Link>
            <Link
              to="https://github.com/divya-gupta2004"
              target="_blank"
              className="social-link"
            >
              <img src={git} alt="GitHub" />
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 MERN Authentication. All Rights Reserved.</p>
        <p>Designed by Divya</p>
      </div>
    </footer>
  );
};

export default Footer;
