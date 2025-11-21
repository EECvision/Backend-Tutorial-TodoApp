const todoService = require('../services/todo.service');

/**
 * Get all todos from all users (admin only)
 */
async function getAllTodos(req, res) {
    try {
        const todos = await todoService.getAllTodos();
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllTodos
};
