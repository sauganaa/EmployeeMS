import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const { login, token, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } else {
      toast.error(result.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="login-container animate-slideUp">
        <form className="glass-card login-form" onSubmit={handleSubmit}>
          <div className="text-center mb-24">
            <h2 className="login-title">Account <span className="gradient-text">Login</span></h2>
            <p className="login-subtitle">Enter your credentials to access your workspace</p>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
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
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiLock size={18} /></span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-8" disabled={loading}>
            {loading ? 'Logging in...' : <><FiLogIn size={16} /> Sign In</>}
          </button>

          <p className="auth-footer-text text-center mt-24">
            Don't have an account? <Link to="/register" className="auth-link">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
