import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiDatabase, FiBarChart2, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const links = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FiGrid size={20} /> },
    { path: '/admin/employees', name: 'Employees', icon: <FiUsers size={20} /> },
    { path: '/admin/departments', name: 'Departments', icon: <FiDatabase size={20} /> },
    { path: '/admin/reports', name: 'Reports', icon: <FiBarChart2 size={20} /> },
    { path: '/employee/profile', name: 'My Profile', icon: <FiUser size={20} /> },
  ];

  return (
    <div className={`sidebar-glass ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
      </button>

      <div className="sidebar-menu">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            title={isCollapsed ? link.name : ''}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {!isCollapsed && <span className="sidebar-text">{link.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
