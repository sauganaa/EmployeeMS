const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/employees
 * List all employees with optional search and department filters.
 * Joins with departments table to include department_name.
 */
router.get('/', async (req, res) => {
    try {
        const { search, department } = req.query;

        let query = `
            SELECT e.*, d.department_name 
            FROM employees e 
            LEFT JOIN departments d ON e.department_id = d.id
        `;
        const params = [];
        const conditions = [];

        if (search) {
            conditions.push('(e.fullname LIKE ? OR e.employee_id LIKE ? OR e.email LIKE ? OR e.designation LIKE ?)');
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (department) {
            conditions.push('e.department_id = ?');
            params.push(department);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY e.created_at DESC';

        const [employees] = await pool.query(query, params);

        return res.status(200).json({
            success: true,
            message: 'Employees retrieved successfully.',
            data: employees
        });
    } catch (error) {
        console.error('Get employees error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * GET /api/employees/:id
 * Get a single employee by ID with department info.
 */
router.get('/:id', async (req, res) => {
    try {
        const [employees] = await pool.query(
            `SELECT e.*, d.department_name 
             FROM employees e 
             LEFT JOIN departments d ON e.department_id = d.id 
             WHERE e.id = ?`,
            [req.params.id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Employee retrieved successfully.',
            data: employees[0]
        });
    } catch (error) {
        console.error('Get employee error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * POST /api/employees
 * Create a new employee (Admin only).
 * Supports image file upload via 'image' field.
 */
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { employee_id, fullname, email, phone, gender, address, dob, join_date, department_id, designation, salary } = req.body;

        // Validate required fields
        if (!employee_id || !fullname || !email) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID, full name, and email are required.'
            });
        }

        // Check for duplicate employee_id
        const [existing] = await pool.query('SELECT id FROM employees WHERE employee_id = ?', [employee_id]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'An employee with this Employee ID already exists.'
            });
        }

        const image = req.file ? req.file.filename : null;

        const [result] = await pool.query(
            `INSERT INTO employees (employee_id, fullname, email, phone, gender, address, dob, join_date, department_id, designation, salary, image) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [employee_id, fullname, email, phone || null, gender || null, address || null, dob || null, join_date || null, department_id || null, designation || null, salary || null, image]
        );

        // Fetch the created employee with department info
        const [created] = await pool.query(
            `SELECT e.*, d.department_name 
             FROM employees e 
             LEFT JOIN departments d ON e.department_id = d.id 
             WHERE e.id = ?`,
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: 'Employee created successfully.',
            data: created[0]
        });
    } catch (error) {
        console.error('Create employee error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * PUT /api/employees/:id
 * Update an existing employee (Admin only).
 * Supports optional image file upload.
 */
router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { employee_id, fullname, email, phone, gender, address, dob, join_date, department_id, designation, salary } = req.body;

        // Check if employee exists
        const [existing] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.'
            });
        }

        const image = req.file ? req.file.filename : existing[0].image;

        await pool.query(
            `UPDATE employees 
             SET employee_id = ?, fullname = ?, email = ?, phone = ?, gender = ?, address = ?, dob = ?, join_date = ?, department_id = ?, designation = ?, salary = ?, image = ?
             WHERE id = ?`,
            [
                employee_id || existing[0].employee_id,
                fullname || existing[0].fullname,
                email || existing[0].email,
                phone || existing[0].phone,
                gender || existing[0].gender,
                address || existing[0].address,
                dob || existing[0].dob,
                join_date || existing[0].join_date,
                department_id || existing[0].department_id,
                designation || existing[0].designation,
                salary || existing[0].salary,
                image,
                req.params.id
            ]
        );

        // Fetch the updated employee
        const [updated] = await pool.query(
            `SELECT e.*, d.department_name 
             FROM employees e 
             LEFT JOIN departments d ON e.department_id = d.id 
             WHERE e.id = ?`,
            [req.params.id]
        );

        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully.',
            data: updated[0]
        });
    } catch (error) {
        console.error('Update employee error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

/**
 * DELETE /api/employees/:id
 * Delete an employee (Admin only).
 */
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT id FROM employees WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found.'
            });
        }

        await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);

        return res.status(200).json({
            success: true,
            message: 'Employee deleted successfully.'
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

module.exports = router;
