const jwt = require('jsonwebtoken');
const respond = require('../utils/response');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return respond.error(res, { status: 401, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (err) {
        respond.error(res, { status: 401, message: 'Invalid or expired token.' });
    }
};
