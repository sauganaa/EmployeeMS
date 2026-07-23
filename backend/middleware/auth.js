const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches decoded user (id, email, role) to req.user on success.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    // Expect format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Invalid token format.'
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};

/**
 * Middleware to check if the authenticated user has admin role.
 * Must be used after verifyToken.
 */
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

module.exports = { verifyToken, isAdmin };
