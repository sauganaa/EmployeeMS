import React, { useState, useEffect } from 'react';
import { FiDatabase, FiUsers, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import './DepartmentInfo.css';

const DepartmentInfo = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/departments');
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="department-info-page">
      <div className="flex-row-between mb-24">
        <div>
          <h1 className="title-section mb-8">Departments</h1>
          <p className="subtitle">View all company departments and capacities.</p>
        </div>

        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            className="form-input search-input" 
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {filteredDepartments.length === 0 ? (
            <div className="glass-card empty-state text-center">
              <FiDatabase size={48} className="mb-16 text-muted" />
              <h3>No departments found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filteredDepartments.map(dept => (
                <div key={dept.id} className="glass-card dept-card">
                  <div className="dept-icon-header">
                    <div className="dept-icon blue">
                      <FiDatabase size={24} />
                    </div>
                    <div className="dept-count" title="Employee Count">
                      <FiUsers size={16} />
                      <span>{dept.employee_count || 0}</span>
                    </div>
                  </div>
                  
                  <h3 className="dept-name">{dept.department_name}</h3>
                  <p className="dept-desc">
                    {dept.description || 'No description available for this department.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DepartmentInfo;
