import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiPieChart, FiUsers, FiClock } from 'react-icons/fi';
import api from '../../utils/api';
import './Reports.css';

const Reports = () => {
  const [stats, setStats] = useState(null);
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
      console.error('Failed to load report data:', error);
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

  const colors = ['--accent-blue', '--accent-violet', '--accent-magenta', '--accent-green', '--accent-orange'];

  return (
    <div className="reports-page">
      <div className="mb-24">
        <h1 className="title-section mb-8">System Reports & Analytics</h1>
        <p className="subtitle">Comprehensive insights and breakdowns of your organization.</p>
      </div>

      <div className="grid-2 mb-24">
        {/* Department Breakdown Visual */}
        <div className="glass-card report-card">
          <div className="card-header border-bottom pb-16">
            <h3 className="flex items-center gap-8"><FiPieChart /> Employees by Department</h3>
          </div>
          
          <div className="report-chart-container mt-16">
            {stats.employeesByDepartment.length > 0 ? (
              <div className="pie-chart-mockup">
                {stats.employeesByDepartment.map((dept, index) => {
                  const percentage = stats.totalEmployees > 0 
                    ? Math.round((dept.count / stats.totalEmployees) * 100) 
                    : 0;
                  return (
                    <div key={dept.department_name} className="chart-legend-item">
                      <div className="legend-color" style={{ background: `var(${colors[index % colors.length]})` }}></div>
                      <div className="legend-label">{dept.department_name}</div>
                      <div className="legend-value">{percentage}% ({dept.count})</div>
                      <div className="legend-bar-container">
                        <div className="legend-bar-fill" style={{ width: `${percentage}%`, background: `var(${colors[index % colors.length]})` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted text-center py-4">No data available.</p>
            )}
          </div>
        </div>

        {/* System Summary */}
        <div className="glass-card report-card">
          <div className="card-header border-bottom pb-16">
            <h3 className="flex items-center gap-8"><FiTrendingUp /> Executive Summary</h3>
          </div>
          
          <div className="summary-grid mt-16">
            <div className="summary-item">
              <div className="summary-icon blue"><FiUsers size={20} /></div>
              <div className="summary-details">
                <h4>Total Staff</h4>
                <p>{stats.totalEmployees} Employees</p>
              </div>
            </div>
            
            <div className="summary-item">
              <div className="summary-icon violet"><FiClock size={20} /></div>
              <div className="summary-details">
                <h4>Recent Hires</h4>
                <p>{stats.recentEmployees.length} in the last month</p>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon green"><FiPieChart size={20} /></div>
              <div className="summary-details">
                <h4>Average Dept Size</h4>
                <p>
                  {stats.totalDepartments > 0 
                    ? Math.round(stats.totalEmployees / stats.totalDepartments) 
                    : 0} Employees/Dept
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Recent Hires Table */}
      <div className="glass-card report-card w-full">
        <div className="card-header border-bottom pb-16 mb-16">
          <h3 className="flex items-center gap-8"><FiClock /> Recently Onboarded Employees</h3>
        </div>
        
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEmployees.length > 0 ? (
                stats.recentEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td className="font-mono">{emp.employee_id}</td>
                    <td>{emp.fullname}</td>
                    <td>{emp.department_name || 'N/A'}</td>
                    <td>{emp.designation || 'N/A'}</td>
                    <td>{new Date(emp.join_date || emp.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No recent employees</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Reports;
