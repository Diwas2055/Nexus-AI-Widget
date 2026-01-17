import { corsHeaders } from '../utils/shared.js';

// Default System Config (Bundled for zero latency)
const DEFAULT_CONFIG = {
  name: "Nexus AI",
  greeting: "👋 Hello! I am your optimized intelligence layer. How can I assist?",
  color: "#ccff00",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=nexus",
  icon: "https://api.dicebear.com/7.x/identicon/svg?seed=nexus"
};

export async function getConfig(req, env) {
  if (req.method === 'POST') {
    const data = await req.json();
    // Persist updates to KV
    await env.CONFIG_STORE.put('system_config', JSON.stringify(data));
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // GET: Fetch from KV with fallback to DEFAULT_CONFIG
  const stored = await env.CONFIG_STORE.get('system_config', 'json') || {};

  const config = {
    ...DEFAULT_CONFIG,
    ...stored
  };

  return new Response(JSON.stringify(config), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
