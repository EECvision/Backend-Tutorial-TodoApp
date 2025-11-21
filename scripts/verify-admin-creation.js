require('dotenv').config();
const http = require('http');
const db = require('../db');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, res => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verify() {
    const timestamp = Date.now();
    const adminUser = { username: `new_admin_${timestamp}`, password: 'password', role: 'admin' };

    console.log('1. Creating Admin without secret...');
    const res1 = await request({
        hostname: 'localhost', port: 8080, path: '/auth/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, adminUser);
    console.log('   Status:', res1.statusCode); // Should be 403

    console.log('2. Creating Admin with wrong secret...');
    const res2 = await request({
        hostname: 'localhost', port: 8080, path: '/auth/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { ...adminUser, adminSecret: 'wrong_secret' });
    console.log('   Status:', res2.statusCode); // Should be 403

    console.log('3. Creating Admin with correct secret...');
    const res3 = await request({
        hostname: 'localhost', port: 8080, path: '/auth/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { ...adminUser, adminSecret: process.env.ADMIN_SECRET });
    console.log('   Status:', res3.statusCode); // Should be 201
    console.log('   Role:', res3.body.role); // Should be 'admin'

    if (res1.statusCode === 403 && res2.statusCode === 403 && res3.statusCode === 201 && res3.body.role === 'admin') {
        console.log('SUCCESS: Admin creation secured and verified!');
    } else {
        console.error('FAILURE: Admin creation check failed.');
    }
    process.exit(0);
}

verify().catch(console.error);
