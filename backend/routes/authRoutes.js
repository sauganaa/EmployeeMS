const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const upload = require('../middleware/upload');

/**
 * POST /api/auth/register
 * Register a new user account.
 */
router.post('/register', upload.single('profile_image'), async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Validate required fields
        if (!fullname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and password are required.'
            });
        }

        // Check if email already exists
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Handle image upload if present
        const profileImage = req.file ? req.file.filename : null;

        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO users (fullname, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)',
            [fullname, email, hashedPassword, 'employee', profileImage]
        );

        // Also create a basic employee record so they show up in the admin panel
        const employeeId = 'EMP' + Math.floor(1000 + Math.random() * 9000);
        await pool.query(
            'INSERT INTO employees (employee_id, fullname, email, image) VALUES (?, ?, ?, ?)',
            [employeeId, fullname, email, profileImage]
        );

        return res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token.
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        // Find user by email
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role,
                    profile_image: user.profile_image
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

module.exports = router;
