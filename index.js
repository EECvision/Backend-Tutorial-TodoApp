// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 8080;

// Import Swagger configuration
const swaggerSpec = require('./config/swagger');

// Import routes
const routes = require('./routes');

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

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Todo API! Try GET /todos or visit /api-docs for documentation');
});

// Mount all routes
app.use('/', routes);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
