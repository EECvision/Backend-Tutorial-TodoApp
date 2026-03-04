const todoService = require('../services/todo.service');
const respond = require('../utils/response');

/**
 * Get all todos for the authenticated user
 */
async function getTodos(req, res) {
    try {
        const todos = await todoService.getUserTodos(req.user.id);
        return respond.success(res, { message: 'Todos retrieved', data: todos });
    } catch (err) {
        console.error(err);
        return respond.error(res, { status: 500, message: 'Internal server error' });
    }
}

/**
 * Create a new todo for the authenticated user
 */
async function createTodo(req, res) {
    const { task, priority = 1 } = req.body;

    if (!task) {
        return respond.error(res, { status: 400, message: 'Task is required' });
    }

    try {
        const todo = await todoService.createTodo(req.user.id, task, priority);
        return respond.success(res, { status: 201, message: 'Todo created', data: todo });
    } catch (err) {
        console.error(err);
        return respond.error(res, { status: 500, message: 'Internal server error' });
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
            return respond.error(res, { status: 404, message: 'Todo not found' });
        }
        return respond.success(res, { message: 'Todo updated', data: todo });
    } catch (err) {
        console.error(err);
        return respond.error(res, { status: 500, message: 'Internal server error' });
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
            return respond.error(res, { status: 404, message: 'Todo not found' });
        }
        return respond.success(res, { message: 'Todo deleted', data: todo });
    } catch (err) {
        console.error(err);
        return respond.error(res, { status: 500, message: 'Internal server error' });
    }
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
