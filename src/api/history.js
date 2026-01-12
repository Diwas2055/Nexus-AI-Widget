import { json, getSessionId } from '../utils/shared.js';

export async function getHistory(req, env) {
    const sessionId = getSessionId(req);

    if (!sessionId) {
        return json({ messages: [] });
    }

    try {
        const sessionData = await env.CHAT_SESSIONS.get(sessionId, 'json');
        return json({
            messages: sessionData?.messages || [],
        });
    } catch (error) {
        console.error('History Fetch Error:', error);
        return json({ messages: [], error: 'Failed to fetch history' }, 500);
    }
}
