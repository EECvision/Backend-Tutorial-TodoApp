const db = require('../db');

/**
 * Get all todos for a specific user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of todo objects
 */
async function getUserTodos(userId) {
    const result = await db.query(
        'SELECT * FROM todos WHERE user_id = $1 ORDER BY priority DESC, id ASC',
        [userId]
    );
    return result.rows;
}

/**
 * Create a new todo for a user
 * @param {number} userId - User ID
 * @param {string} task - Task description
 * @param {number} priority - Priority level (default: 1)
 * @returns {Promise<Object>} Created todo object
 */
async function createTodo(userId, task, priority = 1) {
    const result = await db.query(
        'INSERT INTO todos (task, priority, user_id) VALUES ($1, $2, $3) RETURNING *',
        [task, priority, userId]
    );
    return result.rows[0];
}

/**
 * Update a todo for a user
 * @param {number} userId - User ID
 * @param {number} todoId - Todo ID
 * @param {Object} updates - Object containing task, completed, and/or priority
 * @returns {Promise<Object|null>} Updated todo object or null if not found
 */
async function updateTodo(userId, todoId, updates) {
    const { task, completed, priority } = updates;
    const result = await db.query(
        'UPDATE todos SET task = COALESCE($1, task), completed = COALESCE($2, completed), priority = COALESCE($3, priority) WHERE id = $4 AND user_id = $5 RETURNING *',
        [task, completed, priority, todoId, userId]
    );
    return result.rows[0] || null;
}

/**
 * Delete a todo for a user
 * @param {number} userId - User ID
 * @param {number} todoId - Todo ID
 * @returns {Promise<Object|null>} Deleted todo object or null if not found
 */
async function deleteTodo(userId, todoId) {
    const result = await db.query(
        'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
        [todoId, userId]
    );
    return result.rows[0] || null;
}

/**
 * Get all todos from all users (admin only)
 * @returns {Promise<Array>} Array of todo objects with username
 */
async function getAllTodos() {
    const result = await db.query(
        'SELECT t.*, u.username FROM todos t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC'
    );
    return result.rows;
}

module.exports = {
    getUserTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    getAllTodos
};
