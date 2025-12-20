const jwt = require('jsonwebtoken');

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'ea-flow-builder-secret-key-2024';

// OpenAI Responses API Configuration
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';

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

        if (!OPENAI_API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Missing OpenAI API key. Set OPENAI_API_KEY in environment variables.'
                })
            };
        }

        const temperature = typeof requestBody.temperature === 'number' ? requestBody.temperature : 0.7;
        const topP = typeof requestBody.top_p === 'number' ? requestBody.top_p : 0.8;
        const maxOutputTokens = typeof requestBody.max_output_tokens === 'number'
            ? requestBody.max_output_tokens
            : 1200;
        const textFormat = requestBody.text_format || 'text';
        const textVerbosity = requestBody.text_verbosity || 'medium';
        const reasoningEffort = requestBody.reasoning_effort || 'medium';
        const storeResponse = typeof requestBody.store === 'boolean' ? requestBody.store : true;
        const includeFields = Array.isArray(requestBody.include) && requestBody.include.length > 0
            ? requestBody.include
            : ["reasoning.encrypted_content", "web_search_call.action.sources"];

        const openAIRequest = {
            model: requestBody.model || OPENAI_MODEL,
            input: requestBody.messages.map(message => ({
                role: message.role,
                content: [
                    {
                        type: 'input_text',
                        text: typeof message.content === 'string'
                            ? message.content
                            : JSON.stringify(message.content)
                    }
                ]
            })),
            text: {
                format: { type: textFormat },
                verbosity: textVerbosity
            },
            reasoning: {
                effort: reasoningEffort,
                summary: 'auto'
            },
            tools: Array.isArray(requestBody.tools) ? requestBody.tools : [],
            store: storeResponse,
            include: includeFields,
            temperature: temperature,
            top_p: topP,
            max_output_tokens: Math.min(8000, maxOutputTokens)
        };

        // Call OpenAI Responses API
        const response = await fetch(OPENAI_RESPONSES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(openAIRequest)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API error:', errorData);
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: 'OpenAI API error',
                    details: errorData
                })
            };
        }

        const openAiResponse = await response.json();

        const extractedText = Array.isArray(openAiResponse.output)
            ? openAiResponse.output
                .filter(part => part.type === 'message')
                .map(part => {
                    const textChunks = Array.isArray(part.content)
                        ? part.content
                            .filter(chunk => chunk.type === 'output_text' || chunk.type === 'summary_text')
                            .map(chunk => chunk.text)
                        : [];
                    return textChunks.join('\n').trim();
                })
                .join('\n\n')
                .trim()
            : '';

        // Return successful response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: {
                    text: extractedText,
                    raw: openAiResponse
                }
            })
        };

    } catch (error) {
        console.error('OpenAI proxy error:', error);
        
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
