import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiDatabase, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import api from '../../utils/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    activeEmployees: 0,
    recentEmployees: [],
    employeesByDepartment: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="flex-row-between mb-24">
        <div>
          <h1 className="title-section mb-8">Admin Dashboard</h1>
          <p className="subtitle">System overview and key performance metrics.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/admin/employees/add" className="btn btn-primary">
            <FiUserPlus size={16} /> Add Employee
          </Link>
          <Link to="/admin/departments" className="btn btn-secondary">
            <FiDatabase size={16} /> Manage Depts
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4 mb-24">
        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper blue">
            <FiUsers size={24} />
          </div>
          <div className="kpi-info">
            <h3>{stats.totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper violet">
            <FiDatabase size={24} />
          </div>
          <div className="kpi-info">
            <h3>{stats.totalDepartments}</h3>
            <p>Total Departments</p>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper green">
            <FiUserCheck size={24} />
          </div>
          <div className="kpi-info">
            <h3>{stats.activeEmployees}</h3>
            <p>Active Employees</p>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrapper magenta">
            <FiUserPlus size={24} />
          </div>
          <div className="kpi-info">
            <h3>{stats.recentEmployees.length}</h3>
            <p>New This Month</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Employees */}
        <div className="glass-card dashboard-table-card">
          <div className="card-header">
            <h3>Recently Added Employees</h3>
            <Link to="/admin/employees" className="link-view-all">View All</Link>
          </div>
          
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEmployees.length > 0 ? (
                  stats.recentEmployees.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <div className="emp-name-cell">
                          {emp.image ? (
                            <img src={`http://localhost:5000/uploads/${emp.image}`} alt="" className="table-avatar-small" />
                          ) : (
                            <div className="table-avatar-small placeholder">{emp.fullname.charAt(0)}</div>
                          )}
                          <span>{emp.fullname}</span>
                        </div>
                      </td>
                      <td>{emp.department_name || 'N/A'}</td>
                      <td>{new Date(emp.join_date || emp.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">No recent employees</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="glass-card dashboard-chart-card">
          <div className="card-header">
            <h3>Employees by Department</h3>
          </div>
          
          <div className="dept-bars-container mt-16">
            {stats.employeesByDepartment.length > 0 ? (
              stats.employeesByDepartment.map((dept, index) => {
                const percentage = stats.totalEmployees > 0 
                  ? Math.round((dept.count / stats.totalEmployees) * 100) 
                  : 0;
                
                // Cycle through accent colors
                const colors = ['--accent-blue', '--accent-violet', '--accent-magenta', '--accent-green', '--accent-orange'];
                const colorVar = colors[index % colors.length];

                return (
                  <div key={dept.department_name} className="dept-bar-item">
                    <div className="dept-bar-info">
                      <span className="dept-bar-name">{dept.department_name}</span>
                      <span className="dept-bar-count">{dept.count} ({percentage}%)</span>
                    </div>
                    <div className="dept-bar-track">
                      <div 
                        className="dept-bar-fill" 
                        style={{ width: `${percentage}%`, background: `var(${colorVar})` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted mt-24">No department data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
