import { SETTINGS } from '../config/app.js';

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
};

export const json = (data, status = 200, headers = {}) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...headers,
        },
    });
};

export const getSessionId = (req) => {
    const cookie = req.headers.get('Cookie');
    if (!cookie) return null;
    const regex = new RegExp(`${SETTINGS.COOKIE_NAME}=([^;]+)`);
    const match = cookie.match(regex);
    return match ? match[1] : null;
};
