const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const todoRoutes = require('./todo.routes');
const adminRoutes = require('./admin.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
