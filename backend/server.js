require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────────

// CORS configuration — allow frontend dev server
app.use(cors({
    origin: true,
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Ensure uploads directory exists ────────────────────────────────────────────

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── API Routes ─────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Health check endpoint ──────────────────────────────────────────────────────

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Employee Management System API is running.' });
});

// ── Initialize default admin user ──────────────────────────────────────────────

async function initializeAdmin() {
    try {
        const [rows] = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
        if (rows.length === 0) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            await pool.query(
                'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin User', 'admin@admin.com', hashedPassword, 'admin']
            );
            console.log('✅ Default admin user created (admin@admin.com / admin123)');
        } else {
            console.log('ℹ️  Admin user already exists.');
        }
    } catch (error) {
        console.error('⚠️  Could not initialize admin user:', error.message);
        console.log('   Make sure the database is set up. Run db.sql first.');
    }
}

// ── Start Server ───────────────────────────────────────────────────────────────

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    await initializeAdmin();
});
