import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiUploadCloud } from 'react-icons/fi';
import api from '../../utils/api';
import './AddEmployee.css';

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    fullname: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    dob: '',
    join_date: '',
    department_id: '',
    designation: '',
    salary: ''
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      toast.error('Could not load departments');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.fullname || !formData.email) {
      toast.error('Employee ID, Full Name, and Email are required.');
      return;
    }

    setLoading(true);
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (image) {
      submitData.append('image', image);
    }

    try {
      const response = await api.post('/employees', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        toast.success('Employee added successfully!');
        navigate('/admin/employees');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error(error.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-page">
      <div className="flex-row-between mb-24">
        <div>
          <h1 className="title-section mb-8">Add New Employee</h1>
          <p className="subtitle">Fill in the details to create a new employee record.</p>
        </div>
        
        <Link to="/admin/employees" className="btn btn-secondary">
          <FiArrowLeft size={16} /> Back to List
        </Link>
      </div>

      <div className="glass-card form-card">
        <form onSubmit={handleSubmit}>
          {/* Photo Upload Section */}
          <div className="photo-upload-section mb-24">
            <div className="photo-preview-wrapper" onClick={() => document.getElementById('emp-image').click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <FiUploadCloud size={32} />
                  <span>Upload Photo</span>
                </div>
              )}
            </div>
            <div className="photo-instructions">
              <h4>Employee Profile Picture</h4>
              <p>Upload a clear, professional photo. (Max 5MB)</p>
            </div>
            <input 
              type="file" 
              id="emp-image" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
          </div>

          <hr className="divider mb-24" />

          {/* Form Fields Grid */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Employee ID *</label>
              <input 
                type="text" 
                name="employee_id" 
                className="form-input" 
                value={formData.employee_id} 
                onChange={handleChange} 
                placeholder="e.g. EMP-001"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                name="fullname" 
                className="form-input" 
                value={formData.fullname} 
                onChange={handleChange} 
                placeholder="John Doe"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                name="email" 
                className="form-input" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="email@company.com"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                className="form-input" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select 
                name="gender" 
                className="form-select" 
                value={formData.gender} 
                onChange={handleChange}
              >
                <option value="">Select Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <div className="flex-row-between" style={{ marginBottom: '8px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Department</label>
                <Link to="/admin/departments" className="auth-link" style={{ fontSize: '12px' }}>+ Create Department</Link>
              </div>
              <select 
                name="department_id" 
                className="form-select" 
                value={formData.department_id} 
                onChange={handleChange}
              >
                <option value="">Select Department...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                className="form-input" 
                value={formData.dob} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input 
                type="date" 
                name="join_date" 
                className="form-input" 
                value={formData.join_date} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input 
                type="text" 
                name="designation" 
                className="form-input" 
                value={formData.designation} 
                onChange={handleChange} 
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Salary (Annual)</label>
              <input 
                type="number" 
                name="salary" 
                className="form-input" 
                value={formData.salary} 
                onChange={handleChange} 
                placeholder="60000"
              />
            </div>
          </div>
          
          <div className="form-group mt-8">
            <label className="form-label">Home Address</label>
            <textarea 
              name="address" 
              className="form-textarea" 
              value={formData.address} 
              onChange={handleChange} 
              rows="3"
              placeholder="Full residential address"
            ></textarea>
          </div>

          <div className="form-actions mt-24">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/employees')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : <><FiSave size={18} /> Save Employee</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
