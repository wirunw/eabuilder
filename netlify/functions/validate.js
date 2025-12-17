const jwt = require('jsonwebtoken');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'ea-flow-builder-secret-key-2024';

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get Authorization header
        const authHeader = event.headers.authorization || event.headers.Authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    valid: false, 
                    error: 'No token provided' 
                })
            };
        }

        // Extract token
        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid: true,
                user: {
                    userId: decoded.userId,
                    username: decoded.username,
                    role: decoded.role
                }
            })
        };

    } catch (error) {
        console.error('Validation error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    valid: false, 
                    error: 'Token expired' 
                })
            };
        }
        
        if (error.name === 'JsonWebTokenError') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    valid: false, 
                    error: 'Invalid token' 
                })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                valid: false, 
                error: 'Internal server error' 
            })
        };
    }
};
