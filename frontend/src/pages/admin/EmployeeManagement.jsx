import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiSearch, FiUserPlus, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // For delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.get(`/employees?search=${searchTerm}`);
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error searching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      const response = await api.delete(`/employees/${employeeToDelete.id}`);
      if (response.data.success) {
        toast.success('Employee deleted successfully');
        setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="employee-mgmt-page">
      <div className="flex-row-between mb-24">
        <div>
          <h1 className="title-section mb-8">Employee Management</h1>
          <p className="subtitle">View, search, edit and delete employee records.</p>
        </div>
        
        <Link to="/admin/employees/add" className="btn btn-primary">
          <FiUserPlus size={18} /> Add New Employee
        </Link>
      </div>

      <div className="glass-card mb-24 filter-card">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search by name, ID, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
          {searchTerm && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                fetchEmployees();
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="table-container mb-24">
        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee ID</th>
                <th>Name & Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      {emp.image ? (
                        <img src={`http://localhost:5000/uploads/${emp.image}`} alt={emp.fullname} className="table-avatar" />
                      ) : (
                        <div className="table-avatar-placeholder">
                          {emp.fullname.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="font-mono">{emp.employee_id}</td>
                    <td>
                      <div className="emp-name-email">
                        <strong>{emp.fullname}</strong>
                        <span>{emp.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-employee">
                        {emp.department_name || 'Unassigned'}
                      </span>
                    </td>
                    <td>{emp.designation || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/employees/edit/${emp.id}`} className="action-btn edit" title="Edit">
                          <FiEdit2 size={16} />
                        </Link>
                        <button 
                          className="action-btn delete" 
                          onClick={() => openDeleteModal(emp)}
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No employees found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-slideUp">
            <h3 className="modal-title">Delete Employee</h3>
            <p className="modal-body">
              Are you sure you want to delete <strong>{employeeToDelete?.fullname}</strong> ({employeeToDelete?.employee_id})? 
              This action cannot be undone and will permanently remove their records.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
