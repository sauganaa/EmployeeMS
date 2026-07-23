import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCpu, FiShield, FiTrendingUp } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* Hero Section */}
      <section className="hero-section text-center">
        <h1 className="hero-title animate-slideUp">
          Manage Your Workspace <br />
          <span className="gradient-text">Digitally & Securely</span>
        </h1>
        <p className="hero-subtitle animate-slideUp">
          A premium unified workspace platform to track employee performance, departments, records, and reports with enterprise-grade JWT security and a sleek user interface.
        </p>
        <div className="hero-ctas animate-slideUp">
          <Link to="/login" className="btn btn-primary">Get Started</Link>
          <Link to="/about" className="btn btn-secondary">Learn More</Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title text-center">Platform Capabilities</h2>
        <div className="grid-3">
          <div className="glass-card feature-card">
            <div className="feature-icon blue">
              <FiShield size={24} />
            </div>
            <h3>JWT Authentication</h3>
            <p>Secure login with JSON Web Tokens and encrypted passwords using bcrypt. Strict role authorization for admins and employees.</p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon violet">
              <FiUsers size={24} />
            </div>
            <h3>Employee Directory</h3>
            <p>Comprehensive employee management including personal information, department designation, salary records, and profile pictures.</p>
          </div>

          <div className="glass-card feature-card">
            <div className="feature-icon magenta">
              <FiCpu size={24} />
            </div>
            <h3>Department Structure</h3>
            <p>Organize, customize, and view company layout structures. Monitor employees assigned per department with automatic counts.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="glass-card stats-card">
          <div className="stats-grid">
            <div className="stat-item">
              <h2 className="stat-number gradient-text">99.9%</h2>
              <p className="stat-label">System Uptime</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number gradient-text">256-bit</h2>
              <p className="stat-label">AES Encryption</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number gradient-text">10x</h2>
              <p className="stat-label">Faster Operations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
