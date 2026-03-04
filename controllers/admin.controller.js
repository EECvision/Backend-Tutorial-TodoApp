const todoService = require('../services/todo.service');
const respond = require('../utils/response');

/**
 * Get all todos from all users (admin only)
 */
async function getAllTodos(req, res) {
    try {
        const todos = await todoService.getAllTodos();
        return respond.success(res, { message: 'All todos retrieved', data: todos });
    } catch (err) {
        console.error(err);
        return respond.error(res, { status: 500, message: 'Internal server error' });
    }
}

module.exports = { getAllTodos };
