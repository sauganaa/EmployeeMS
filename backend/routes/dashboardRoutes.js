const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics (Admin only).
 * Returns total employees, departments, active employees, recent employees, and department breakdown.
 */
router.get('/stats', isAdmin, async (req, res) => {
    try {
        // Total employees count
        const [empCount] = await pool.query('SELECT COUNT(*) AS total FROM employees');

        // Total departments count
        const [deptCount] = await pool.query('SELECT COUNT(*) AS total FROM departments');

        // Total active employees (currently same as total)
        const totalActive = empCount[0].total;

        // Recently added employees (last 5)
        const [recentEmployees] = await pool.query(`
            SELECT e.*, d.department_name 
            FROM employees e 
            LEFT JOIN departments d ON e.department_id = d.id 
            ORDER BY e.created_at DESC 
            LIMIT 5
        `);

        // Employees grouped by department
        const [employeesByDept] = await pool.query(`
            SELECT d.department_name, COUNT(e.id) AS count 
            FROM departments d 
            LEFT JOIN employees e ON d.id = e.department_id 
            GROUP BY d.id, d.department_name 
            ORDER BY count DESC
        `);

        return res.status(200).json({
            success: true,
            message: 'Dashboard stats retrieved successfully.',
            data: {
                totalEmployees: empCount[0].total,
                totalDepartments: deptCount[0].total,
                activeEmployees: totalActive,
                recentEmployees,
                employeesByDepartment: employeesByDept
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});

module.exports = router;
