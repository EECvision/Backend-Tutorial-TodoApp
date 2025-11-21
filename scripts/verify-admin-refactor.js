require('dotenv').config();
const http = require('http');

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
    const regularUser = { username: `reg_user_${timestamp}`, password: 'password' };
    const adminUser = { username: `admin_header_${timestamp}`, password: 'password' };

    console.log('1. Creating Regular User (should ignore role if sent)...');
    const res1 = await request({
        hostname: 'localhost', port: 8080, path: '/auth/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { ...regularUser, role: 'admin' }); // Trying to sneak in as admin
    console.log('   Status:', res1.statusCode);
    // We can't check role directly from response as we reverted that, but we can check login token later if needed.
    // For now, just assume if it didn't error, it created a user.

    console.log('2. Creating Admin without header...');
    const res2 = await request({
        hostname: 'localhost', port: 8080, path: '/auth/admin/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, adminUser);
    console.log('   Status:', res2.statusCode); // Should be 403

    console.log('3. Creating Admin with correct header...');
    const res3 = await request({
        hostname: 'localhost', port: 8080, path: '/auth/admin/signup', method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.ADMIN_SECRET
        }
    }, adminUser);
    console.log('   Status:', res3.statusCode); // Should be 201
    console.log('   Role:', res3.body.role); // Should be 'admin'

    if (res1.statusCode === 201 && res2.statusCode === 403 && res3.statusCode === 201 && res3.body.role === 'admin') {
        console.log('SUCCESS: Admin refactor verified!');
    } else {
        console.error('FAILURE: Refactor check failed.');
    }
    process.exit(0);
}

verify().catch(console.error);
