import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-glass">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} EmpMS. All Rights Reserved.
        </p>
        <div className="footer-links">
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
