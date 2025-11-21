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
    const userA = { username: `userA_${timestamp}`, password: 'password' };
    const userB = { username: `userB_${timestamp}`, password: 'password' };

    console.log('1. Registering User A...');
    await request({
        hostname: 'localhost', port: 8080, path: '/auth/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, userA);

    console.log('2. Registering User B...');
    await request({
        hostname: 'localhost', port: 8080, path: '/auth/signup', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, userB);

    console.log('3. Logging in User A...');
    const loginA = await request({
        hostname: 'localhost', port: 8080, path: '/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, userA);
    const tokenA = loginA.body.token;
    console.log('   Token A received');

    console.log('4. Logging in User B...');
    const loginB = await request({
        hostname: 'localhost', port: 8080, path: '/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, userB);
    const tokenB = loginB.body.token;
    console.log('   Token B received');

    console.log('5. User A creates a todo...');
    await request({
        hostname: 'localhost', port: 8080, path: '/todos', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` }
    }, { task: 'User A Task', priority: 1 });

    console.log('6. User B fetches todos (should be empty)...');
    const todosB = await request({
        hostname: 'localhost', port: 8080, path: '/todos', method: 'GET',
        headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    console.log('   User B Todos:', todosB.body.length);

    console.log('7. User A fetches todos (should have 1)...');
    const todosA = await request({
        hostname: 'localhost', port: 8080, path: '/todos', method: 'GET',
        headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    console.log('   User A Todos:', todosA.body.length);

    if (todosB.body.length === 0 && todosA.body.length === 1) {
        console.log('SUCCESS: Multi-user isolation verified!');
    } else {
        console.error('FAILURE: Isolation check failed.');
    }
}

verify().catch(console.error);
