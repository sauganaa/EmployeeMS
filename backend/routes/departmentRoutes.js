const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/departments
 * List all departments with employee count for each.
 */
router.get('/', async (req, res) => {
    try {
        const [departments] = await pool.query(`
            SELECT d.*, COUNT(e.id) AS employee_count 
            FROM departments d 
            LEFT JOIN employees e ON d.id = e.department_id 
            GROUP BY d.id 
            ORDER BY d.department_name ASC
        `);

        return res.status(200).json({
            success: true,
            message: 'Departments retrieved successfully.',
            data: departments
        });
    } catch (error) {
        console.error('Get departments error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * POST /api/departments
 * Create a new department (Admin only).
 */
router.post('/', isAdmin, async (req, res) => {
    try {
        const { department_name, description } = req.body;

        if (!department_name) {
            return res.status(400).json({
                success: false,
                message: 'Department name is required.'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO departments (department_name, description) VALUES (?, ?)',
            [department_name, description || null]
        );

        const [created] = await pool.query('SELECT * FROM departments WHERE id = ?', [result.insertId]);

        return res.status(201).json({
            success: true,
            message: 'Department created successfully.',
            data: created[0]
        });
    } catch (error) {
        console.error('Create department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * PUT /api/departments/:id
 * Update a department (Admin only).
 */
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { department_name, description } = req.body;

        // Check if department exists
        const [existing] = await pool.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Department not found.'
            });
        }

        await pool.query(
            'UPDATE departments SET department_name = ?, description = ? WHERE id = ?',
            [department_name || existing[0].department_name, description !== undefined ? description : existing[0].description, req.params.id]
        );

        const [updated] = await pool.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);

        return res.status(200).json({
            success: true,
            message: 'Department updated successfully.',
            data: updated[0]
        });
    } catch (error) {
        console.error('Update department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * DELETE /api/departments/:id
 * Delete a department (Admin only).
 */
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT id FROM departments WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Department not found.'
            });
        }

        await pool.query('DELETE FROM departments WHERE id = ?', [req.params.id]);

        return res.status(200).json({
            success: true,
            message: 'Department deleted successfully.'
        });
    } catch (error) {
        console.error('Delete department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

module.exports = router;
