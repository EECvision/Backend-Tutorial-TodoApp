const fs = require('fs');
const path = require('path');
const swaggerSpec = require('../config/swagger');

const outputPath = path.join(__dirname, '..', 'openapi.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
console.log(`✅ OpenAPI documentation successfully generated at: ${outputPath}`);
