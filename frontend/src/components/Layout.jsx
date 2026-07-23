import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { AuthContext } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, isAdmin } = useContext(AuthContext);

  return (
    <div className="app-layout">
      <Navbar />
      
      <div className="layout-body">
        {user && isAdmin && <Sidebar />}
        
        <main className={`main-content ${user && isAdmin ? 'admin-main' : ''}`}>
          <div className="page-wrapper animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
