import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import './Register.css';

const Register = () => {
  const { register, token, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, password, confirmPassword } = formData;

    if (!fullname || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    
    // Create FormData for multipart/form-data
    const submitData = new FormData();
    submitData.append('fullname', fullname);
    submitData.append('email', email);
    submitData.append('password', password);
    if (profileImage) {
      submitData.append('profile_image', profileImage);
    }

    // Call API directly instead of context register to support FormData easily
    // Since AuthContext register only takes JSON currently
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: submitData
      });
      const result = await response.json();
      
      setLoading(false);

      if (result.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error(result.message || 'Registration failed.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Network error during registration.');
    }
  };

  return (
    <div className="register-page">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="register-container animate-slideUp">
        <form className="glass-card register-form" onSubmit={handleSubmit}>
          <div className="text-center mb-24">
            <h2 className="register-title">Account <span className="gradient-text">Register</span></h2>
            <p className="register-subtitle">Create your personal employee workspace credentials</p>
          </div>

          <div className="form-group text-center mb-24">
            <div className="photo-preview-wrapper mx-auto" onClick={() => document.getElementById('reg-image').click()} style={{ width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '2px dashed var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                  <FiUser size={32} />
                  <span style={{ fontSize: '10px', marginTop: '4px' }}>Upload Photo</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              id="reg-image" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiUser size={18} /></span>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiMail size={18} /></span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiLock size={18} /></span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="At least 6 characters"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiLock size={18} /></span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Repeat password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-8" disabled={loading}>
            {loading ? 'Creating Account...' : <><FiUserPlus size={16} /> Create Account</>}
          </button>

          <p className="auth-footer-text text-center mt-24">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
