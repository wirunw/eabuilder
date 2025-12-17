const jwt = require('jsonwebtoken');

// User accounts (in production, use a proper database)
const users = [
    {
        id: 1,
        username: 'admin@eabuilder.com',
        password: 'admin123',
        name: 'Administrator',
        role: 'admin'
    },
    {
        id: 2,
        username: 'user1@eabuilder.com',
        password: 'user123',
        name: 'User 1',
        role: 'user'
    },
    {
        id: 3,
        username: 'user2@eabuilder.com',
        password: 'user123',
        name: 'User 2',
        role: 'user'
    }
];

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'ea-flow-builder-secret-key-2024';

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { username, password } = JSON.parse(event.body);

        // Find user
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid username or password' 
                })
            };
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role
                }
            })
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: 'Internal server error' 
            })
        };
    }
};
