# 🏢 Employee Management System (EmployeeMS)

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License"/>
</p>

A modern, full-stack **Employee Management System** built with **React (Vite)** on the frontend and **Node.js + Express + MySQL** on the backend. Designed to streamline administrative workflows, track departmental organizational structures, manage employee profiles, and provide role-based dashboards.

---

## ✨ Features

- 🔐 **Role-Based Authentication**: Secure JWT-backed registration and login supporting both **Admin** and **Employee** roles.
- 📊 **Interactive Admin Dashboard**: Live summary metrics (Total Employees, Total Departments, Salary Costs, Reports).
- 👔 **Employee Management**: Full CRUD capabilities for adding, updating, searching, filtering, and removing employee records.
- 🏢 **Department Management**: Create, view, and organize corporate departments dynamically.
- 📁 **Profile & Image Uploads**: Integrated profile picture file uploads for staff and admins via Multer.
- 📱 **Responsive UI**: Clean modern CSS interface built for both desktop displays and mobile viewports.
- 🛡️ **Protected Routing**: React Router guards ensuring strict security for admin and member routes.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite build tool)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with interceptors
- **Icons & Styling**: React Icons, Modular Vanilla CSS, React Toastify notifications

### **Backend**
- **Runtime**: Node.js & Express.js framework
- **Database**: MySQL / MariaDB (SQL schema with relational constraints)
- **Authentication**: bcryptjs password hashing & JSON Web Tokens (JWT)
- **File Storage**: Multer middleware for media file handling

---

## 📂 Project Architecture

```
EmployeeMS/
├── backend/
│   ├── config/          # Database connection configuration
│   ├── middleware/      # Authentication & File upload middleware
│   ├── routes/          # API endpoint routes (Auth, Employee, Dept, User, Dashboard)
│   ├── uploads/         # Static avatar image directory
│   ├── db.sql           # Database schema & initial seeding queries
│   ├── server.js        # Express application entry point
│   └── package.json     # Node backend dependencies
├── frontend/
│   ├── src/
│   │   ├── assets/      # Static images and icons
│   │   ├── components/  # Reusable UI (Navbar, Sidebar, Layout, ProtectedRoute)
│   │   ├── context/     # Auth Context provider
│   │   ├── pages/       # Dashboard, Login, Register, Profile, Admin Pages
│   │   ├── utils/       # Axios API client setup
│   │   └── main.jsx     # React root entry point
│   ├── index.html       # HTML entry point
│   └── vite.config.js   # Vite configuration
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.x or higher)
- MySQL Server / XAMPP / MariaDB

### 1. Database Setup
1. Import `backend/db.sql` into your MySQL server (e.g. via phpMyAdmin or MySQL CLI):
```bash
mysql -u root -p < backend/db.sql
```
This creates the `employeems` database and requisite tables (`users`, `employees`, `departments`).

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure your environment variables in `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=employeems
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
npm run dev # or node server.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 📡 API Endpoint Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | User login & return JWT token | ❌ |
| `GET` | `/api/dashboard/stats` | Admin metrics & totals | 🔒 Admin |
| `GET` | `/api/employees` | Fetch list of employees | 🔒 Auth |
| `POST` | `/api/employees` | Create employee record | 🔒 Admin |
| `PUT` | `/api/employees/:id` | Update employee profile | 🔒 Admin |
| `DELETE` | `/api/employees/:id` | Remove employee record | 🔒 Admin |
| `GET` | `/api/departments` | Fetch departments | 🔒 Auth |
| `POST` | `/api/departments` | Create new department | 🔒 Admin |

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
