import React from 'react';
import { FiUsers, FiTarget, FiActivity } from 'react-icons/fi';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="text-center mb-24">
        <h1 className="title-section">About Our Platform</h1>
        <p className="subtitle">Learn more about the vision behind the Employee Management System</p>
      </div>

      <div className="grid-3 mb-24">
        <div className="glass-card card-about">
          <div className="icon-wrapper violet">
            <FiTarget size={24} />
          </div>
          <h3>Our Mission</h3>
          <p>
            To empower organizations with robust digital tools to streamline employee workflows, structure departmental data, and maintain organizational accuracy without relying on outdated spreadsheets or paper forms.
          </p>
        </div>

        <div className="glass-card card-about">
          <div className="icon-wrapper blue">
            <FiUsers size={24} />
          </div>
          <h3>Enterprise Security</h3>
          <p>
            By implementing standards-based JSON Web Token authorization and bcrypt hashes, we guarantee that confidential payroll, personal contact, and record details are accessed strictly by authorized administration staff.
          </p>
        </div>

        <div className="glass-card card-about">
          <div className="icon-wrapper magenta">
            <FiActivity size={24} />
          </div>
          <h3>High Availability</h3>
          <p>
            Developed on top of Express and MySQL, our backend application delivers stable performance, lightning fast lookups, and support for thousands of simultaneous requests.
          </p>
        </div>
      </div>

      <div className="glass-card details-card">
        <h3>Platform Details & Specifications</h3>
        <p>
          This Employee Management System is built using a complete React JS client running on the latest version of Vite. All styling is crafted via custom CSS variables and utility layouts to guarantee a completely customizable and modern feel.
        </p>
        <p>
          Our MySQL database maps complex structural linkages between users, departments, and employees to ensure referential integrity while calculating live breakdowns of employee counts dynamically.
        </p>
      </div>
    </div>
  );
};

export default About;
