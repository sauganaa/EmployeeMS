const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/users
 * List all users (Admin only). Password field is excluded.
 */
router.get('/', isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, fullname, email, role, profile_image, created_at FROM users ORDER BY created_at DESC'
        );

        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully.',
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * GET /api/users/profile
 * Get current user's profile and their employee record (if exists, matched by email).
 */
router.get('/profile', async (req, res) => {
    try {
        // Get user profile (exclude password)
        const [users] = await pool.query(
            'SELECT id, fullname, email, role, profile_image, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const user = users[0];

        // Try to find matching employee record by email
        const [employees] = await pool.query(
            `SELECT e.*, d.department_name 
             FROM employees e 
             LEFT JOIN departments d ON e.department_id = d.id 
             WHERE e.email = ?`,
            [user.email]
        );

        return res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully.',
            data: {
                ...user,
                employee: employees.length > 0 ? employees[0] : null
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * PUT /api/users/profile
 * Update current user's profile (fullname, profile_image).
 * Supports optional image file upload via 'profile_image' field.
 * Also syncs changes to the employees table so admin panel stays in sync.
 */
router.put('/profile', upload.single('profile_image'), async (req, res) => {
    try {
        const { fullname } = req.body;

        // Get current user data
        const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const currentUser = existing[0];
        const updatedFullname = fullname || currentUser.fullname;
        const updatedImage = req.file ? req.file.filename : currentUser.profile_image;

        // Update users table
        await pool.query(
            'UPDATE users SET fullname = ?, profile_image = ? WHERE id = ?',
            [updatedFullname, updatedImage, req.user.id]
        );

        // Sync fullname AND image to employees table so admin panel reflects changes
        await pool.query(
            'UPDATE employees SET fullname = ?, image = ? WHERE email = ?',
            [updatedFullname, updatedImage, currentUser.email]
        );

        console.log(`Profile updated for user ${req.user.id} (${currentUser.email}): name="${updatedFullname}", image="${updatedImage}"`);

        // Fetch updated user (exclude password)
        const [updated] = await pool.query(
            'SELECT id, fullname, email, role, profile_image, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: updated[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * DELETE /api/users/:id
 * Delete a user (Admin only).
 */
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully.'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

module.exports = router;
