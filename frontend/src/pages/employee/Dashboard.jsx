import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiUser, FiBriefcase, FiCalendar, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import api from '../../utils/api';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get('/users/profile');
        if (response.data.success && response.data.data.employee) {
          setEmployeeData(response.data.data.employee);
        }
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="emp-dashboard-page">
      <div className="welcome-section mb-24">
        <h1 className="title-section">Welcome back, {user?.fullname}</h1>
        <p className="subtitle">Here is an overview of your employee profile.</p>
      </div>

      <div className="grid-2">
        {/* Profile Card */}
        <div className="glass-card profile-summary-card">
          <div className="profile-header">
            {user?.profile_image ? (
              <img 
                src={`http://localhost:5000/uploads/${user.profile_image}`} 
                alt={user.fullname} 
                className="dashboard-avatar" 
              />
            ) : (
              <div className="dashboard-avatar-placeholder">
                {user?.fullname?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="profile-titles">
              <h2>{user?.fullname}</h2>
              <span className="badge badge-employee">Employee</span>
            </div>
          </div>
          
          <div className="quick-links mt-24">
            <Link to="/employee/profile" className="btn btn-primary w-full text-center">Edit Profile</Link>
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="glass-card employee-info-card">
          <h3 className="card-title">Employee Details</h3>
          
          {employeeData ? (
            <div className="info-grid mt-16">
              <div className="info-row">
                <FiBriefcase className="info-icon" />
                <div>
                  <span className="info-label">Department</span>
                  <p className="info-value">{employeeData.department_name || 'Not assigned'}</p>
                </div>
              </div>
              <div className="info-row">
                <FiBriefcase className="info-icon" />
                <div>
                  <span className="info-label">Designation</span>
                  <p className="info-value">{employeeData.designation || 'N/A'}</p>
                </div>
              </div>
              <div className="info-row">
                <FiMail className="info-icon" />
                <div>
                  <span className="info-label">Email</span>
                  <p className="info-value">{employeeData.email}</p>
                </div>
              </div>
              <div className="info-row">
                <FiPhone className="info-icon" />
                <div>
                  <span className="info-label">Phone</span>
                  <p className="info-value">{employeeData.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="info-row">
                <FiCalendar className="info-icon" />
                <div>
                  <span className="info-label">Join Date</span>
                  <p className="info-value">
                    {employeeData.join_date ? new Date(employeeData.join_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="info-row">
                <FiMapPin className="info-icon" />
                <div>
                  <span className="info-label">Address</span>
                  <p className="info-value">{employeeData.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state mt-16">
              <FiUser size={40} className="mb-16" />
              <p>Your HR profile has not been completely set up yet. Please contact your administrator.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
