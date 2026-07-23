import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a1a' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (token && user) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
