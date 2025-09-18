import React from "react";
import "../styles/Instructor.css";
import instructorImage from "../assets/profile.png";

const Instructor = () => {
  return (
    <div className="instructor-page">
      <div className="instructor-card">
        <div className="instructor-image">
          <img src={instructorImage} alt="Instructor" />
        </div>
        <div className="instructor-info">
          <h1>Divya Gupta</h1>
          <h4>Web Developer</h4>
          <p>
            Hi, I’m Divya Gupta, a passionate Web Developer specializing in building
            dynamic, responsive, and user-friendly web applications. I work with
            React, Node.js, Express.js, and MongoDB to create full-stack
            solutions that are both visually appealing and technically robust. I
            love turning ideas into seamless digital experiences and constantly
            exploring new technologies to craft innovative web solutions.
          </p>
          <div className="social-links">
            <a
              href="https://github.com/divya-gupta2004"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/divya-gupta-888361289"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://portfolio-gamma-plum-41.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructor;
