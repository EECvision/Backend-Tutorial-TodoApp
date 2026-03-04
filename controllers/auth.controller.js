const authService = require('../services/auth.service');

/**
 * Handle user signup
 */
async function signup(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await authService.createUser(username, password, 'user');
        res.status(201).json(user);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ message: 'Username already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

/**
 * Handle admin signup
 */
async function adminSignup(req, res) {
    const { username, password } = req.body;
    const adminSecret = req.headers['x-admin-secret'];

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret' });
    }

    try {
        const user = await authService.createUser(username, password, 'admin');
        res.status(201).json(user);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ message: 'Username already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

/**
 * Handle user login
 */
async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const result = await authService.authenticateUser(username, password);
        res.json(result);
    } catch (err) {
        if (err.message === 'Invalid credentials') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}

module.exports = {
    signup,
    adminSignup,
    login
};
