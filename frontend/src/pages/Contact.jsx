import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    toast.success('Thank you! Your message has been sent successfully.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="text-center mb-24">
        <h1 className="title-section">Contact Support</h1>
        <p className="subtitle">Have any questions? We would love to hear from you.</p>
      </div>

      <div className="grid-2">
        {/* Contact Info Cards */}
        <div className="contact-info">
          <div className="glass-card info-card">
            <div className="info-item">
              <div className="info-icon blue">
                <FiMail size={20} />
              </div>
              <div className="info-text">
                <h4>Email Support</h4>
                <p>support@employeems.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon violet">
                <FiPhone size={20} />
              </div>
              <div className="info-text">
                <h4>Phone Support</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon magenta">
                <FiMapPin size={20} />
              </div>
              <div className="info-text">
                <h4>Headquarters</h4>
                <p>100 Innovation Way, Suite 400<br />Tech City, TC 94016</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-container">
          <form className="glass-card contact-form" onSubmit={handleSubmit}>
            <h3>Send Message</h3>
            
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter subject"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <FiSend size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
