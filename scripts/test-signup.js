const baseUrl = 'http://localhost:8080';

async function run() {
    // --- Signup ---
    const randomUser = 'user_' + Math.random().toString(36).substring(7);
    const password = 'testpassword123';

    console.log(`\n--- POST /auth/signup (${randomUser}) ---`);
    let res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: randomUser, password })
    });
    let body = await res.json();
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(body, null, 2));

    // --- Login ---
    console.log(`\n--- POST /auth/login ---`);
    res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: randomUser, password })
    });
    body = await res.json();
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(body, null, 2));

    const accessToken = body?.data?.accessToken;
    if (!accessToken) { console.error('\n❌ No accessToken found!'); return; }
    console.log('\n✅ accessToken present');
    if (!body?.data?.refreshToken) { console.error('❌ No refreshToken found!'); return; }
    console.log('✅ refreshToken present');

    // --- Create Todo ---
    console.log('\n--- POST /todos ---');
    res = await fetch(`${baseUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ task: 'Test Task', priority: 2 })
    });
    body = await res.json();
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(body, null, 2));

    const todoId = body?.data?.id;

    // --- Get Todos ---
    console.log('\n--- GET /todos ---');
    res = await fetch(`${baseUrl}/todos`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    body = await res.json();
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(body, null, 2));

    // --- Update Todo ---
    if (todoId) {
        console.log(`\n--- PUT /todos/${todoId} ---`);
        res = await fetch(`${baseUrl}/todos/${todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
            body: JSON.stringify({ completed: true })
        });
        body = await res.json();
        console.log('Status:', res.status);
        console.log('Body:', JSON.stringify(body, null, 2));

        // --- Delete Todo ---
        console.log(`\n--- DELETE /todos/${todoId} ---`);
        res = await fetch(`${baseUrl}/todos/${todoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        body = await res.json();
        console.log('Status:', res.status);
        console.log('Body:', JSON.stringify(body, null, 2));
    }

    console.log('\n✅ All tests complete!');
}

run().catch(console.error);
