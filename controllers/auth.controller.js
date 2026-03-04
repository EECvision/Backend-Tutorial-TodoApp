const authService = require('../services/auth.service');
const respond = require('../utils/response');

/**
 * Handle user signup
 */
async function signup(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return respond.error(res, { status: 400, message: 'Username and password are required' });
    }

    try {
        const user = await authService.createUser(username, password, 'user');
        return respond.success(res, {
            status: 201,
            message: 'Account created successfully',
            data: { user }
        });
    } catch (err) {
        if (err.code === '23505') {
            return respond.error(res, { status: 400, message: 'Username already exists' });
        }
        console.error(err);
        return respond.error(res, { status: 500, message: 'Internal server error' });
    }
}


/**
 * Handle user login
 */
async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return respond.error(res, { status: 400, message: 'Username and password are required' });
    }

    try {
        const data = await authService.authenticateUser(username, password);
        return respond.success(res, {
            status: 200,
            message: 'Login successful',
            data
        });
    } catch (err) {
        if (err.message === 'Invalid credentials') {
            return respond.error(res, { status: 401, message: 'Invalid username or password' });
        }
        console.error(err);
        return respond.error(res, { status: 500, message: 'Internal server error' });
    }
}

/**
 * Refresh an access token
 */
async function refresh(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return respond.error(res, { status: 400, message: 'Refresh token is required' });
    }

    try {
        const data = authService.refreshAccessToken(refreshToken);
        return respond.success(res, {
            status: 200,
            message: 'Access token refreshed',
            data
        });
    } catch (err) {
        return respond.error(res, { status: 401, message: 'Invalid or expired refresh token' });
    }
}

module.exports = { signup, login, refresh };
