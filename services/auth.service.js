const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
 * Authenticate a user and generate JWT token
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} Object containing JWT token
 * @throws {Error} If credentials are invalid
 */
async function authenticateUser(username, password) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );

    return { token };
}

module.exports = {
    createUser,
    authenticateUser
};
