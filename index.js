// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const db = require('./db');

// Middleware to parse JSON bodies
app.use(express.json());

// Configure CORS to allow multiple domains
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://example.com', 'http://localhost:3000'];
const corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: process.env.API_TITLE || 'Todo API',
            version: process.env.API_VERSION || '1.0.0',
            description: process.env.API_DESCRIPTION || 'A simple Express Todo API'
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    apis: ['./index.js'], // Files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root route to avoid 404
app.get('/', (req, res) => {
    res.send('Welcome to the Todo API! Try GET /todos or visit /api-docs for documentation');
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Retrieve a list of todos
 *     responses:
 *       200:
 *         description: A list of todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   task:
 *                     type: string
 *                   completed:
 *                     type: boolean
 */
app.get('/todos', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM todos ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
app.post('/todos', async (req, res) => {
    const { task } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO todos (task) VALUES ($1) RETURNING *',
            [task]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
app.put('/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { task, completed } = req.body;

    try {
        const result = await db.query(
            'UPDATE todos SET task = COALESCE($1, task), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *',
            [task, completed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
app.delete('/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize DB and start server
async function startServer() {
    try {
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        await db.query(schemaSql);
        console.log('Database initialized successfully');

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
