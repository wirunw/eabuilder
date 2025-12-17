const jwt = require('jsonwebtoken');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'ea-flow-builder-secret-key-2024';

// Typhoon API Configuration
const TYPHOON_API_URL = 'https://api.opentyphoon.ai/v1/chat/completions';
const TYPHOON_API_KEY = process.env.TYPHOON_API_KEY || 'your-typhoon-api-key-here';
const TYPHOON_MODEL = process.env.TYPHOON_MODEL || 'typhoon-v2.5-30b-a3b-instruct';

// Rate limiting (simple in-memory store)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per user

function checkRateLimit(userId) {
    const now = Date.now();
    const userRequests = rateLimitStore.get(userId) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => 
        now - timestamp < RATE_LIMIT_WINDOW
    );
    
    if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }
    
    // Add current request
    validRequests.push(now);
    rateLimitStore.set(userId, validRequests);
    
    return true;
}

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        // Get Authorization header
        const authHeader = event.headers.authorization || event.headers.Authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    error: 'Authentication required' 
                })
            };
        }

        // Extract and verify token
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check rate limiting
        if (!checkRateLimit(decoded.userId)) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ 
                    error: 'Rate limit exceeded. Please try again later.' 
                })
            };
        }

        // Get request body
        const requestBody = JSON.parse(event.body);

        // Validate request body
        if (!requestBody.messages || !Array.isArray(requestBody.messages)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid request: messages array is required' 
                })
            };
        }

        // Prepare Typhoon API request
        const typhoonRequest = {
            model: requestBody.model || TYPHOON_MODEL,
            messages: requestBody.messages,
            temperature: typeof requestBody.temperature === 'number' ? requestBody.temperature : 0.7,
            top_p: typeof requestBody.top_p === 'number' ? requestBody.top_p : 0.6,
            frequency_penalty: typeof requestBody.frequency_penalty === 'number' ? requestBody.frequency_penalty : 0,
            max_completion_tokens: requestBody.max_completion_tokens || 4000,
            stream: !!requestBody.stream
        };

        // Call Typhoon API
        const response = await fetch(TYPHOON_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TYPHOON_API_KEY}`
            },
            body: JSON.stringify(typhoonRequest)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Typhoon API error:', errorData);
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: 'Typhoon API error',
                    details: errorData
                })
            };
        }

        const typhoonResponse = await response.json();

        // Return successful response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: typhoonResponse
            })
        };

    } catch (error) {
        console.error('Typhoon proxy error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    error: 'Authentication token expired' 
                })
            };
        }
        
        if (error.name === 'JsonWebTokenError') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid authentication token' 
                })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
