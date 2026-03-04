const baseUrl = 'http://localhost:8080';

async function testSignup() {
    console.log('--- Testing POST /auth/signup ---');
    console.log('Creating a random user...');
    const randomUser = 'user_' + Math.random().toString(36).substring(7);
    const password = 'testpassword123';

    try {
        const response = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: randomUser, password })
        });

        const data = await response.json();
        console.log('Status code:', response.status);
        console.log('Response body:', data);
    } catch (err) {
        console.error('Error during fetch:', err);
    }
}

testSignup();
