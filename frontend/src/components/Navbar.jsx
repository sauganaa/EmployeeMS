import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfileImage = () => {
    if (user && user.profile_image) {
      return `http://localhost:5000/uploads/${user.profile_image}`;
    }
    return null;
  };

  const getInitials = () => {
    if (!user || !user.fullname) return '?';
    return user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span>Emp</span>MS
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links-desktop">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>

          {user ? (
            <>
              {isAdmin ? (
                <>
                  <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
                  <NavLink to="/admin/employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Employees</NavLink>
                  <NavLink to="/admin/departments" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Departments</NavLink>
                  <NavLink to="/admin/reports" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Reports</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/employee/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
                  <NavLink to="/employee/departments" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Departments</NavLink>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>

        {/* Right Section (Profile / Action) */}
        {user && (
          <div className="navbar-user-section-desktop">
            <Link to={isAdmin ? "/employee/profile" : "/employee/profile"} className="navbar-profile-trigger">
              {getProfileImage() ? (
                <img src={getProfileImage()} alt={user.fullname} className="navbar-avatar" />
              ) : (
                <div className="navbar-avatar-placeholder">{getInitials()}</div>
              )}
              <span className="navbar-username">{user.fullname}</span>
            </Link>
            <button onClick={handleLogout} className="btn-logout" title="Logout">
              <FiLogOut />
            </button>
          </div>
        )}

        {/* Mobile Toggle */}
        <button className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="navbar-links-mobile">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>

          {user ? (
            <>
              {isAdmin ? (
                <>
                  <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
                  <NavLink to="/admin/employees" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Employees</NavLink>
                  <NavLink to="/admin/departments" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Departments</NavLink>
                  <NavLink to="/admin/reports" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Reports</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/employee/dashboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
                  <NavLink to="/employee/departments" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Departments</NavLink>
                </>
              )}
              <div className="divider"></div>
              <Link to="/employee/profile" onClick={() => setMobileMenuOpen(false)} className="nav-link profile-link-mobile">
                <FiUser style={{ marginRight: '8px' }} /> My Profile
              </Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="nav-link btn-logout-mobile">
                <FiLogOut style={{ marginRight: '8px' }} /> Logout
              </button>
            </>
          ) : (
            <>
              <div className="divider"></div>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
              <NavLink to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-register-mobile">Register</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
