const todoService = require('../services/todo.service');

/**
 * Get all todos for the authenticated user
 */
async function getTodos(req, res) {
    try {
        const todos = await todoService.getUserTodos(req.user.id);
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Create a new todo for the authenticated user
 */
async function createTodo(req, res) {
    const { task, priority = 1 } = req.body;
    try {
        const todo = await todoService.createTodo(req.user.id, task, priority);
        res.status(201).json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Update a todo for the authenticated user
 */
async function updateTodo(req, res) {
    const id = parseInt(req.params.id);
    const { task, completed, priority } = req.body;

    try {
        const todo = await todoService.updateTodo(req.user.id, id, { task, completed, priority });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Delete a todo for the authenticated user
 */
async function deleteTodo(req, res) {
    const id = parseInt(req.params.id);
    try {
        const todo = await todoService.deleteTodo(req.user.id, id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
};
