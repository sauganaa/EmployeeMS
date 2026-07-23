import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiSave, FiUploadCloud, FiUser } from 'react-icons/fi';
import api from '../../utils/api';
import './MyProfile.css';

const MyProfile = () => {
  const { user, updateProfileState } = useContext(AuthContext);
  const [formData, setFormData] = useState({ fullname: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({ fullname: user.fullname || '' });
      if (user.profile_image) {
        setPreviewUrl(`http://localhost:5000/uploads/${user.profile_image}`);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File is too large. Max size is 5MB.');
        return;
      }
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname.trim()) {
      toast.error('Full name is required.');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('fullname', formData.fullname);
    if (profileImage) {
      data.append('profile_image', profileImage);
    }

    try {
      const response = await api.put('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        updateProfileState(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="mb-24">
        <h1 className="title-section">My Profile</h1>
        <p className="subtitle">Manage your account settings and profile picture.</p>
      </div>

      <div className="glass-card profile-settings-card">
        <form onSubmit={handleSubmit} className="profile-form">
          
          <div className="profile-photo-section">
            <div className="photo-preview-wrapper" onClick={triggerFileInput}>
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <FiUser size={40} />
                </div>
              )}
              <div className="photo-overlay">
                <FiUploadCloud size={24} />
                <span>Upload</span>
              </div>
            </div>
            <div className="photo-instructions">
              <h4>Profile Picture</h4>
              <p>Click the image to upload a new photo. Allowed formats: JPG, PNG, GIF. Max size 5MB.</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png, image/gif" 
              style={{ display: 'none' }} 
            />
          </div>

          <hr className="divider mt-24 mb-24" />

          <div className="form-group">
            <label className="form-label">Email Address (Read Only)</label>
            <input 
              type="email" 
              className="form-input read-only" 
              value={user?.email || ''} 
              readOnly 
              disabled 
            />
            <small className="form-help">Your email is used for login and cannot be changed here.</small>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="fullname" 
              className="form-input" 
              value={formData.fullname} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="form-actions mt-24">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : <><FiSave size={18} /> Save Changes</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MyProfile;
