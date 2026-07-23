import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import MyProfile from './pages/employee/MyProfile';
import DepartmentInfo from './pages/employee/DepartmentInfo';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import AddEmployee from './pages/admin/AddEmployee';
import EditEmployee from './pages/admin/EditEmployee';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import Reports from './pages/admin/Reports';

function App() {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Employee Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<MyProfile />} />
          <Route path="/employee/departments" element={<DepartmentInfo />} />
        </Route>
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<EmployeeManagement />} />
          <Route path="/admin/employees/add" element={<AddEmployee />} />
          <Route path="/admin/employees/edit/:id" element={<EditEmployee />} />
          <Route path="/admin/departments" element={<DepartmentManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
