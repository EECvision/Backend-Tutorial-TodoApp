const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @swagger
 * /admin/todos:
 *   get:
 *     summary: Retrieve all todos from all users (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all todos with user information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   task:
 *                     type: string
 *                     example: Buy groceries
 *                   completed:
 *                     type: boolean
 *                     example: false
 *                   priority:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   username:
 *                     type: string
 *                     example: johndoe
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User does not have admin role
 *       500:
 *         description: Internal server error
 */
router.get('/todos', auth, admin, adminController.getAllTodos);

module.exports = router;
