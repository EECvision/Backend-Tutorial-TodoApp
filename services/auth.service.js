const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Create a new user in the database
 * @param {string} username - Username
 * @param {string} password - Plain text password (will be hashed)
 * @param {string} role - User role ('user' or 'admin')
 * @returns {Promise<Object>} Created user object
 */
async function createUser(username, password, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
        [username, hashedPassword, role]
    );
    return result.rows[0];
}

/**
 * Authenticate a user and generate access + refresh tokens
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} Object containing accessToken, refreshToken, and user
 * @throws {Error} If credentials are invalid
 */
async function authenticateUser(username, password) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username, role: user.role };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    return {
        accessToken,
        refreshToken,
        user: { id: user.id, username: user.username, role: user.role }
    };
}

/**
 * Refresh an access token using a valid refresh token
 * @param {string} refreshToken - The refresh token
 * @returns {Object} Object containing a new accessToken
 * @throws {Error} If the refresh token is invalid or expired
 */
function refreshAccessToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const payload = { id: decoded.id, username: decoded.username, role: decoded.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    return { accessToken };
}

module.exports = {
    createUser,
    authenticateUser,
    refreshAccessToken
};
