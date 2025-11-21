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
    const adminUser = { username: `admin_${timestamp}`, password: 'password' };
    const regularUser = { username: `user_${timestamp}`, password: 'password' };

    console.log('1. Registering Admin User...');
    const adminReg = await request({
        hostname: 'localhost', port: 8080, path: '/auth/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, adminUser);

    // Manually promote to admin
    await db.query("UPDATE users SET role = 'admin' WHERE username = $1", [adminUser.username]);
    console.log('   Promoted to admin');

    console.log('2. Registering Regular User...');
    await request({
        hostname: 'localhost', port: 8080, path: '/auth/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, regularUser);

    console.log('3. Logging in Admin...');
    const loginAdmin = await request({
        hostname: 'localhost', port: 8080, path: '/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, adminUser);
    const tokenAdmin = loginAdmin.body.token;

    console.log('4. Logging in Regular User...');
    const loginUser = await request({
        hostname: 'localhost', port: 8080, path: '/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, regularUser);
    const tokenUser = loginUser.body.token;

    console.log('5. Regular User tries to access admin endpoint...');
    const accessUser = await request({
        hostname: 'localhost', port: 8080, path: '/admin/todos', method: 'GET',
        headers: { 'Authorization': `Bearer ${tokenUser}` }
    });
    console.log('   Status Code:', accessUser.statusCode);

    console.log('6. Admin tries to access admin endpoint...');
    const accessAdmin = await request({
        hostname: 'localhost', port: 8080, path: '/admin/todos', method: 'GET',
        headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
    console.log('   Status Code:', accessAdmin.statusCode);
    console.log('   Todos count:', accessAdmin.body.length);

    if (accessUser.statusCode === 403 && accessAdmin.statusCode === 200) {
        console.log('SUCCESS: Admin access control verified!');
    } else {
        console.error('FAILURE: Access control check failed.');
    }
    process.exit(0);
}

verify().catch(console.error);
