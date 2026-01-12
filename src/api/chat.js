import { getFaqContext } from '../core/faq.js';
import { MODELS } from '../config/models.js';
import { PROMPTS, SETTINGS } from '../config/app.js';
import { json, getSessionId, corsHeaders } from '../utils/shared.js';

export async function chat(req, env) {
    const { message } = await req.json();

    if (!message || message.trim() === '') {
        return json({ error: 'Message content is required' }, 400);
    }

    let sessionId = getSessionId(req);
    let isNewSession = !sessionId;

    let sessionData = sessionId ? await env.CHAT_SESSIONS.get(sessionId, 'json') : null;

    if (!sessionData) {
        sessionId = `sess_${crypto.randomUUID()}`;
        sessionData = {
            id: sessionId,
            messages: [],
            createdAt: Date.now(),
        };
        isNewSession = true;
    }

    sessionData.messages.push({
        role: 'user',
        content: message.trim(),
        timestamp: Date.now(),
    });

    const context = await getFaqContext(env, message);

    const llmMessages = [
        {
            role: 'system',
            content: PROMPTS.SYSTEM_MAIN + (context ? `${PROMPTS.CONTEXT_PREFIX}\n${context}` : ''),
        },
        ...sessionData.messages.slice(-SETTINGS.MAX_HISTORY_MESSAGES).map((m) => ({
            role: m.role,
            content: m.content,
        })),
    ];

    const stream = await env.AI.run(MODELS.CHAT, {
        messages: llmMessages,
        stream: true,
    });

    let fullResponse = '';
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
        async transform(chunk, controller) {
            const text = decoder.decode(chunk);
            const lines = text.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ') && line.slice(6).trim() !== '[DONE]') {
                    try {
                        const data = JSON.parse(line.slice(6));
                        fullResponse += data.response || '';
                    } catch (e) { }
                }
            }
            controller.enqueue(chunk);
        },
        async flush() {
            if (fullResponse) {
                sessionData.messages.push({
                    role: 'assistant',
                    content: fullResponse,
                    timestamp: Date.now(),
                });
                sessionData.updatedAt = Date.now();
                await env.CHAT_SESSIONS.put(sessionId, JSON.stringify(sessionData), {
                    expirationTtl: SETTINGS.SESSION_TTL,
                });
            }
        },
    });

    const responseStream = stream.pipeThrough(transformStream);

    const headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...corsHeaders,
    };

    if (isNewSession) {
        headers['Set-Cookie'] = `${SETTINGS.COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SETTINGS.SESSION_TTL}`;
    }

    return new Response(responseStream, { headers });
}
