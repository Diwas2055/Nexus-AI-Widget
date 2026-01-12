/**
 * AI Chatbot Widget - Nexus AI Premium Edition
 * Version: 2.0.0
 */
(function () {
  'use strict';

  // Configuration
  const config = {
    baseUrl: window.CHATBOT_BASE_URL || '',
    title: window.CHATBOT_TITLE || 'Nexus AI',
    placeholder: window.CHATBOT_PLACEHOLDER || 'Type your inquiry...',
    greeting: window.CHATBOT_GREETING || '👋 Hello! How can I assist you today?',
  };

  // State
  let isOpen = false;
  let messages = [];
  let isTyping = false;
  let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || true; // Default dark for demo

  // Helpers
  const $ = (id) => document.getElementById(id);

  function init() {
    // Inject Styles
    if (!document.querySelector('link[href*="styles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = config.baseUrl + '/styles.css';
      document.head.appendChild(link);
    }

    const container = document.createElement('div');
    container.id = 'nexus-widget';
    container.className = 'nexus-ai-root';
    container.innerHTML = `
      <style>
        .nexus-glass { background: rgba(15, 23, 42, 0.8) !important; backdrop-filter: blur(16px) saturate(180%) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }
        .nexus-gradient { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important; }
        .nexus-message-ai { background: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; color: #f1f5f9 !important; }
        .nexus-message-user { background: #6366f1 !important; color: white !important; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important; }
        @keyframes nexus-pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: nexus-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      </style>

      <!-- Launcher -->
      <button id="nexus-launcher" class="fixed bottom-6 right-6 w-16 h-16 nexus-gradient rounded-full shadow-[0_8px_32px_rgba(99,102,241,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 z-[99999]">
        <svg id="nx-open" class="w-8 h-8 text-white transition-all transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
        <svg id="nx-close" class="w-8 h-8 text-white absolute opacity-0 scale-50 transition-all transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <!-- Chat Window -->
      <div id="nexus-window" class="fixed bottom-28 right-6 w-[420px] max-w-[calc(100vw-3rem)] h-[640px] max-h-[calc(100vh-10rem)] rounded-[32px] shadow-2xl flex flex-col overflow-hidden z-[99999] opacity-0 scale-95 translate-y-8 pointer-events-none transition-all duration-500 nexus-glass text-slate-200">
        
        <!-- Header -->
        <header class="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 nexus-gradient rounded-2xl flex items-center justify-center shadow-lg">
                <span class="text-white font-black text-xl">N</span>
            </div>
            <div>
              <h3 class="font-bold text-lg tracking-tight">${config.title}</h3>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span class="text-[10px] uppercase font-black tracking-widest text-emerald-400">System Ready</span>
              </div>
            </div>
          </div>
          <button id="nexus-clear" class="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </header>

        <!-- Messages -->
        <main id="nexus-messages" class="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
          <div class="flex flex-col items-center text-center py-4 mb-4">
            <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15l-3-3m0 0l3-3m-3 3h8M3 20a6 6 0 0112 0v1h7V7a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H5a1 1 0 00-1 1v2H3a2 2 0 00-2 2v13z"/></svg>
            </div>
            <p class="text-xs font-medium text-slate-500 uppercase tracking-widest">End-to-End Encrypted</p>
          </div>
        </main>

        <!-- Loading -->
        <div id="nexus-typing" class="hidden px-8 py-4">
          <div class="flex items-center gap-2">
            <div class="flex gap-1.5">
              <span class="w-1.5 h-1.5 nexus-gradient rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 nexus-gradient rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-1.5 h-1.5 nexus-gradient rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
          </div>
        </div>

        <!-- Footer / Input -->
        <footer class="p-6">
          <form id="nexus-form" class="relative group">
            <input 
              id="nexus-input" 
              type="text" 
              class="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all transition-all placeholder:text-slate-600" 
              placeholder="${config.placeholder}" 
              autocomplete="off"
            />
            <button 
              type="submit" 
              id="nexus-send" 
              class="absolute right-2 top-2 bottom-2 px-4 nexus-gradient text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all font-bold"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>
            </button>
          </form>
          <div class="mt-4 flex items-center justify-center gap-1.5 opacity-30 text-[10px] font-black uppercase tracking-widest">
            <span>Powered by Nexus Edge AI</span>
          </div>
        </footer>
      </div>
    `;

    document.body.appendChild(container);
    bindEvents();
    loadHistory();
  }

  function bindEvents() {
    $('nexus-launcher').onclick = toggle;
    $('nexus-form').onsubmit = send;
    $('nexus-clear').onclick = () => { messages = []; render(); };
  }

  function toggle() {
    isOpen = !isOpen;
    const win = $('nexus-window'), o = $('nx-open'), c = $('nx-close');

    if (isOpen) {
      win.classList.remove('opacity-0', 'scale-95', 'translate-y-8', 'pointer-events-none');
      win.classList.add('opacity-100', 'scale-100', 'translate-y-0');
      o.classList.add('opacity-0', 'rotate-90', 'scale-50');
      c.classList.remove('opacity-0', 'scale-50');
      c.classList.add('opacity-100', 'scale-100');
      $('nexus-input').focus();
      if (!messages.length) setTimeout(() => add('assistant', config.greeting), 600);
    } else {
      win.classList.add('opacity-0', 'scale-95', 'translate-y-8', 'pointer-events-none');
      win.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
      o.classList.remove('opacity-0', 'rotate-90', 'scale-50');
      c.classList.add('opacity-0', 'scale-50');
      c.classList.remove('opacity-100', 'scale-100');
    }
  }

  function add(r, c) {
    messages.push({ role: r, content: c });
    render();
  }

  function render() {
    const list = $('nexus-messages');
    const welcome = list.firstElementChild.cloneNode(true);
    list.innerHTML = '';
    list.appendChild(welcome);

    list.innerHTML += messages.map((m, i) => {
      const isAI = m.role === 'assistant';
      return `
        <div class="flex ${isAI ? 'justify-start' : 'justify-end'} animate-pop">
          <div class="max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${isAI ? 'nexus-message-ai rounded-bl-none' : 'nexus-message-user rounded-br-none'}">
            <div id="msg-${i}" class="whitespace-pre-wrap">${escape(m.content)}</div>
          </div>
        </div>
      `;
    }).join('');
    list.scrollTop = list.scrollHeight;
  }

  async function send(e) {
    e.preventDefault();
    const input = $('nexus-input'), msg = input.value.trim();
    if (!msg || isTyping) return;

    add('user', msg);
    input.value = '';
    $('nexus-send').disabled = true;
    isTyping = true;
    $('nexus-typing').classList.remove('hidden');

    try {
      const res = await fetch(config.baseUrl + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
        credentials: 'include'
      });

      if (!res.ok) throw 0;
      const reader = res.body.getReader(), decoder = new TextDecoder();
      let full = '', idx = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunks = decoder.decode(value, { stream: true }).split('\n');
        for (const chunk of chunks) {
          if (!chunk.startsWith('data: ')) continue;
          const data = chunk.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.response) {
              full += parsed.response;
              if (idx === null) {
                isTyping = false;
                $('nexus-typing').classList.add('hidden');
                messages.push({ role: 'assistant', content: full });
                idx = messages.length - 1;
                render();
              } else {
                messages[idx].content = full;
                const el = $(`msg-${idx}`);
                if (el) el.innerHTML = escape(full);
                $('nexus-messages').scrollTop = $('nexus-messages').scrollHeight;
              }
            }
          } catch (e) { }
        }
      }
    } catch {
      $('nexus-typing').classList.add('hidden');
      add('assistant', '⚠️ Identification failed. Attempting to reconnect...');
    } finally {
      isTyping = false;
      $('nexus-typing').classList.add('hidden');
      $('nexus-send').disabled = false;
    }
  }

  async function loadHistory() {
    try {
      const res = await fetch(config.baseUrl + '/api/history', { credentials: 'include' });
      if (res.ok) {
        const d = await res.json();
        if (d.messages?.length) { messages = d.messages; render(); }
      }
    } catch { }
  }

  function escape(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
