import { chat } from './api/chat.js';
import { seed } from './api/seed.js';
import { getHistory } from './api/history.js';
import { getConfig } from './api/config.js';
import { json, corsHeaders } from './utils/shared.js';

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          ...corsHeaders,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      if (path === '/api/chat' && req.method === 'POST') {
        return await chat(req, env);
      }

      if (path === '/api/history' && req.method === 'GET') {
        return await getHistory(req, env);
      }

      if (path === '/api/seed' && req.method === 'POST') {
        return await seed(req, env);
      }

      if (path === '/api/config') {
        return await getConfig(req, env);
      }

      if (path === '/api/health') {
        return json({ status: 'ok', timestamp: Date.now() });
      }

      if (env.ASSETS) {
        return await env.ASSETS.fetch(req);
      }

      return json({ error: 'Not Found' }, 404);
    } catch (err) {
      console.error(err);
      return json({ error: 'Internal Server Error', message: err.message }, 500);
    }
  },
};
