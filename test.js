// Built-in fetch used

async function testApi() {
    const baseUrl = 'http://localhost:8080';

    console.log('--- Testing GET /todos ---');
    let response = await fetch(`${baseUrl}/todos`);
    let data = await response.json();
    console.log(data);

    console.log('\n--- Testing POST /todos ---');
    response = await fetch(`${baseUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Test Todo from Script' })
    });
    data = await response.json();
    console.log(data);
    const newId = data.id;

    console.log(`\n--- Testing PUT /todos/${newId} ---`);
    response = await fetch(`${baseUrl}/todos/${newId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true })
    });
    data = await response.json();
    console.log(data);

    console.log(`\n--- Testing DELETE /todos/${newId} ---`);
    response = await fetch(`${baseUrl}/todos/${newId}`, {
        method: 'DELETE'
    });
    data = await response.json();
    console.log(data);

    console.log('\n--- Final GET /todos ---');
    response = await fetch(`${baseUrl}/todos`);
    data = await response.json();
    console.log(data);
}

testApi().catch(console.error);
