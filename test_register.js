const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)).catch(() => {
    // Fallback to global fetch if node-fetch is not installed (Node 18+)
    return globalThis.fetch(...args);
});

async function run() {
    try {
        console.log("Sending registration request...");
        const res = await fetch("http://localhost:5001/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "testuser1",
                email: "test1@example.com",
                password: "password123"
            })
        });
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Response:", data);
    } catch (err) {
        console.error("Error connecting to server:", err.message);
    }
}

run();
