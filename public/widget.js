/**
 * AI Chatbot Widget - Nexus AI Premium Edition
 * Version: 2.1.0
 */
(function () {
  'use strict';

  // Configuration
  const config = {
    baseUrl: window.CHATBOT_BASE_URL || '',
    title: window.CHATBOT_TITLE || 'Nexus AI',
    placeholder: window.CHATBOT_PLACEHOLDER || 'Type your inquiry...',
    greeting: window.CHATBOT_GREETING || '👋 Hello! How can I assist you today?',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nexus',
    icon: ''
  };

  // State
  let isOpen = false;
  let messages = [];
  let isTyping = false;

  const $ = (id) => document.getElementById(id);

  function init() {
    // Inject Fonts
    if (!document.getElementById('nexus-fonts')) {
      const fonts = document.createElement('style');
      fonts.id = 'nexus-fonts';
      fonts.textContent = `
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@500,600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
      `;
      document.head.appendChild(fonts);
    }

    // Fetch Dynamic Config
    fetch(config.baseUrl + '/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.name) config.title = data.name;
        if (data.greeting) config.greeting = data.greeting;
        if (data.color) {
          document.documentElement.style.setProperty('--acid-lime', data.color);
          const win = $('nexus-window');
          if (win) win.style.setProperty('--lime', data.color);
          const btn = $('nexus-launcher');
          if (btn) {
            btn.style.setProperty('--lime', data.color);
            btn.style.borderColor = data.color;
            btn.style.color = data.color;
          }
        }

        // Update Avatar and Icon
        if (data.avatar) {
          const logo = document.querySelector('.nexus-logo-box');
          if (logo) logo.innerHTML = `<img src="${data.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        }
        if (data.icon) {
          const launcher = $('nexus-launcher');
          if (launcher) launcher.innerHTML = `<img src="${data.icon}" style="width:24px; height:24px; object-fit:contain;">`;
        }

        // Update UI Text
        const titleEl = document.querySelector('#nexus-window h3');
        if (titleEl) titleEl.innerText = config.title;
      })
      .catch(err => console.warn('Using default config', err));

    const container = document.createElement('div');
    container.id = 'nexus-widget';
    container.className = 'nexus-ai-root';
    container.innerHTML = `
      <style>
        #nexus-widget * { box-sizing: border-box; }
        .nexus-theme-root {
          --void: #050505;
          --panel: #0a0a0a;
          --lime: #ccff00;
          --steel: #333;
          --text: #e0e0e0;
          --font-display: 'Clash Display', sans-serif;
          --font-tech: 'Space Mono', monospace;
          font-family: var(--font-tech);
        }

        .nexus-window-frame {
            position: fixed;
            bottom: 0; right: 0;
            width: 100%; height: 100dvh;
            background: var(--panel);
            border: 1px solid var(--steel);
            box-shadow: 0 0 50px rgba(0,0,0,0.9);
            display: flex; flex-direction: column;
            z-index: 99999;
            transform: translateY(110%);
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
            opacity: 0; pointer-events: none;
        }
        .nexus-window-frame.is-open { transform: translateY(0); opacity: 1; pointer-events: all; }

        @media (min-width: 768px) {
            .nexus-window-frame {
                bottom: 30px; right: 30px;
                width: 420px; height: 700px;
                max-height: calc(100vh - 60px);
            }
        }

        .nexus-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 20px; background: var(--void);
            border-bottom: 1px solid var(--steel);
            font-family: var(--font-display);
        }
        .nexus-brand-group { display: flex; align-items: center; gap: 15px; }
        .nexus-logo-box {
            width: 32px; height: 32px;
            background: var(--lime);
            display: flex; align-items: center; justify-content: center;
            color: #000; font-weight: 700; font-size: 18px;
            border-radius: 50%; overflow: hidden;
        }

        .nexus-messages-area {
            flex: 1; overflow-y: auto;
            padding: 24px; background: var(--panel);
            display: flex; flex-direction: column; gap: 20px;
            scrollbar-width: none;
        }
        .nexus-messages-area::-webkit-scrollbar { display: none; }

        .msg-row { display: flex; width: 100%; }
        .msg-row.ai { justify-content: flex-start; }
        .msg-row.user { justify-content: flex-end; }
        .nexus-msg-bot {
            max-width: 90%; background: transparent;
            border-left: 2px solid var(--lime);
            color: var(--text); padding: 10px 15px;
            font-size: 14px; line-height: 1.5;
        }
        .nexus-msg-user {
            max-width: 90%; background: var(--lime);
            color: #000; font-weight: 700;
            padding: 12px 18px; font-size: 14px;
            box-shadow: 6px 6px 0 var(--void);
        }

        .nexus-footer { background: var(--void); border-top: 1px solid var(--steel); }
        .nexus-input-form { display: flex; position: relative; width: 100%; }
        .nexus-input-field {
            width: 100%; background: transparent; border: none;
            color: #fff; padding: 25px 20px;
            font-family: var(--font-tech); font-size: 14px; outline: none;
        }
        .nexus-send-btn {
            position: absolute; right: 0; top: 0; height: 100%; width: 60px;
            background: transparent; border: none; color: #444;
            cursor: pointer; transition: color 0.3s;
        }
        .nexus-send-btn:hover { color: var(--lime); }

        .nexus-launcher-btn {
            position: fixed; bottom: 30px; right: 30px;
            width: 48px; height: 48px;
            background-color: #000; border: 2px solid var(--lime);
            color: var(--lime); cursor: pointer; z-index: 999999;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 0 15px rgba(204, 255, 0, 0.3);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .nexus-launcher-btn:hover {
            transform: scale(1.05);
            background-color: var(--lime) !important;
            color: var(--void) !important;
        }
        .nexus-launcher-btn svg { transition: transform 0.3s; }
        .nexus-launcher-btn:hover svg { transform: scale(1.1); color: var(--void) !important; }
        .hidden { display: none !important; }
        .blink { animation: nexus-blink 1s infinite; }
        @keyframes nexus-blink { 50% { opacity: 0; } }
      </style>

      <button id="nexus-launcher" class="nexus-launcher-btn">
        <svg style="width:24px; height:24px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </button>

      <div id="nexus-window" class="nexus-theme-root nexus-window-frame">
        <header class="nexus-header">
          <div class="nexus-brand-group">
            <div class="nexus-logo-box">N</div>
            <div>
              <h3 style="color:white; font-size:14px; letter-spacing:1px; margin:0; text-transform:uppercase;">${config.title}</h3>
              <div style="display:flex; align-items:center; margin-top:4px;">
                <span style="width:6px; height:6px; background:var(--lime); border-radius:50%; margin-right:6px;" class="blink"></span>
                <span style="font-size:9px; letter-spacing:2px; color:#666;" class="uppercase">Online</span>
              </div>
            </div>
          </div>
          <div style="display:flex; gap:15px; align-items:center;">
             <button id="nexus-clear" style="background:none; border:none; color:#666; font-size:10px; cursor:pointer;">Reset</button>
             <button id="nexus-close-header" style="background:none; border:none; color:#666; cursor:pointer;">
                <svg style="width:18px; height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
             </button>
          </div>
        </header>

        <main id="nexus-messages" class="nexus-messages-area">
          <div style="text-align:center; color:var(--lime); font-size:10px; letter-spacing:3px; opacity:0.7; text-transform:uppercase; margin-bottom:20px;">
             Neural Uplink Active
          </div>
        </main>

        <div id="nexus-typing" class="hidden" style="padding: 10px 24px; background:var(--panel);">
            <span style="color:var(--lime); font-size:10px;" class="blink">> PROCESSING...</span>
        </div>

        <footer class="nexus-footer">
          <form id="nexus-form" class="nexus-input-form">
            <input id="nexus-input" type="text" class="nexus-input-field" placeholder="${config.placeholder}" autocomplete="off" />
            <button type="submit" id="nexus-send" class="nexus-send-btn">
              <svg style="width:20px; height:20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </form>
        </footer>
      </div>
    `;

    document.body.appendChild(container);

    $('nexus-launcher').onclick = toggle;
    $('nexus-form').onsubmit = send;
    $('nexus-clear').onclick = () => { messages = []; render(); };
    $('nexus-close-header').onclick = toggle;

    // Accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) toggle();
    });

    loadHistory();
  }

  function toggle() {
    isOpen = !isOpen;
    const win = $('nexus-window');
    const launcher = $('nexus-launcher');
    if (isOpen) {
      win.classList.add('is-open');
      launcher.classList.add('hidden');
      $('nexus-input').focus();
      if (!messages.length) setTimeout(() => add('assistant', config.greeting), 600);
    } else {
      win.classList.remove('is-open');
      launcher.classList.remove('hidden');
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
        <div class="msg-row ${isAI ? 'ai' : 'user'}">
          <div class="${isAI ? 'nexus-msg-bot' : 'nexus-msg-user'}">
            <div id="msg-${i}" style="white-space:pre-wrap;">${escape(m.content)}</div>
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
      if (!res.ok) throw new Error();
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
      setTimeout(() => {
        isTyping = false;
        $('nexus-typing').classList.add('hidden');
        add('assistant', `[DEMO_MODE] Backend connection simulation. I hear you loud and clear. (Live uplink failed)`);
      }, 1000);
    } finally {
      if (!isTyping) $('nexus-send').disabled = false;
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
