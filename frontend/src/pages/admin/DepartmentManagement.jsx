import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiDatabase, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './DepartmentManagement.css';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDeptId, setCurrentDeptId] = useState(null);
  
  const [formData, setFormData] = useState({
    department_name: '',
    description: ''
  });

  // For delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

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
      console.error('Failed to load departments', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ department_name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setIsEditMode(true);
    setCurrentDeptId(dept.id);
    setFormData({
      department_name: dept.department_name,
      description: dept.description || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ department_name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.department_name) {
      toast.error('Department name is required');
      return;
    }

    try {
      if (isEditMode) {
        const response = await api.put(`/departments/${currentDeptId}`, formData);
        if (response.data.success) {
          toast.success('Department updated successfully');
          fetchDepartments();
          closeModal();
        }
      } else {
        const response = await api.post('/departments', formData);
        if (response.data.success) {
          toast.success('Department added successfully');
          fetchDepartments();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error(error.response?.data?.message || 'Failed to save department');
    }
  };

  const openDeleteModal = (dept) => {
    setDeptToDelete(dept);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deptToDelete) return;
    try {
      const response = await api.delete(`/departments/${deptToDelete.id}`);
      if (response.data.success) {
        toast.success('Department deleted successfully');
        fetchDepartments();
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    } finally {
      setDeleteModalOpen(false);
      setDeptToDelete(null);
    }
  };

  return (
    <div className="dept-mgmt-page">
      <div className="flex-row-between mb-24">
        <div>
          <h1 className="title-section mb-8">Department Management</h1>
          <p className="subtitle">Add, edit, or remove company departments.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FiPlus size={18} /> Add Department
        </button>
      </div>

      {loading ? (
        <div className="loader-container"><div className="loader"></div></div>
      ) : (
        <div className="grid-3">
          {departments.map((dept) => (
            <div key={dept.id} className="glass-card dept-admin-card">
              <div className="dept-admin-header">
                <div className="dept-icon blue">
                  <FiDatabase size={24} />
                </div>
                <div className="dept-actions">
                  <button className="action-btn edit" onClick={() => openEditModal(dept)} title="Edit">
                    <FiEdit2 size={16} />
                  </button>
                  <button className="action-btn delete" onClick={() => openDeleteModal(dept)} title="Delete">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <h3>{dept.department_name}</h3>
              <p className="dept-admin-desc">
                {dept.description || 'No description available for this department.'}
              </p>

              <div className="dept-admin-footer">
                <div className="dept-count">
                  <FiUsers size={16} />
                  <span>{dept.employee_count || 0} Employees</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-slideUp">
            <h3 className="modal-title">{isEditMode ? 'Edit Department' : 'Add New Department'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Department Name *</label>
                <input 
                  type="text" 
                  name="department_name" 
                  className="form-input" 
                  value={formData.department_name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  name="description" 
                  className="form-textarea" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows="4"
                ></textarea>
              </div>
              <div className="modal-actions mt-24">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-slideUp">
            <h3 className="modal-title text-danger">Delete Department</h3>
            <p className="modal-body">
              Are you sure you want to delete <strong>{deptToDelete?.department_name}</strong>? 
              Employees associated with this department will have their department removed.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
