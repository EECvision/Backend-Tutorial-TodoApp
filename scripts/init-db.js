require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../db');

async function initDb() {
    try {
        const schemaPath = path.join(__dirname, '../db/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema.sql...');
        await db.query(schemaSql);
        console.log('Database initialized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
}

initDb();
