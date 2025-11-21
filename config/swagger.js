const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: process.env.API_TITLE || 'Todo API',
            version: process.env.API_VERSION || '1.0.0',
            description: process.env.API_DESCRIPTION || 'A simple Express Todo API with authentication and admin features'
        },
        servers: [
            {
                url: process.env.API_URL || `http://localhost:${process.env.PORT || 8080}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to route files with Swagger annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
