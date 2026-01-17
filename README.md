# Nexus AI Widget 🧪

A high-performance "Liquid Neural Interface" chatbot built on **Cloudflare Workers**, **Workers AI**, and **Vectorize**. Nexus AI utilizes an avant-garde aesthetic combined with RAG (Retrieval-Augmented Generation) to deliver an elite support experience.

---

## ✨ Key Features

- **🌊 Liquid Neural Interface**: An avant-garde "Bioluminescent Deep Sea" aesthetic featuring obsidian depths and acid-lime accents.
- **🚀 Edge-Native Engine**: Powered by Cloudflare Workers for global performance and 0ms cold starts.
- **⚙️ Zero-Latency Dynamic Config**: Real-time system configuration (Name, Greeting, Theme, Icons) powered by a write-through KV cache with static JSON fallbacks.
- **🧠 Intelligent RAG Protocol**: Context-aware precision using Llama 3 and high-dimensional vector search.
- **🛠 Zero-Dependency Styling**: Built with pure Vanilla CSS for maximum performance and artistic control—no Tailwind bloat.

---

## 📂 Project Structure

```text
├── docs/              # Technical guides
├── public/            
│   ├── config/        # Static system defaults (JSON)
│   ├── widget.js      # The Liquid Interface logic
│   ├── styles.css     # Design system (Avant-Garde CSS)
│   └── index.html     # Landing page & config dashboard
├── src/
│   ├── api/           # Endpoints (Chat, Config, Seed)
│   ├── core/          # RAG Orchestration
│   ├── utils/         # Performance helpers
├── wrangler.jsonc     # Cloudflare Infrastructure
└── package.json       # Ecosystem commands
```

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Infrastructure Setup
You must provision KV namespaces and Vectorize indices before deployment.
👉 **[Read the Setup Guide](./docs/setup-guide.md)**

### 3. Development
```bash
# Start the Neural Simulation (Local Dev)
npm run dev
```
👉 **[Read the Development Guide](./docs/local-development.md)**

### 4. Knowledge Uplink
Populate your vector database with intelligence:
```bash
npm run seed
```

---

## 🎨 System Configuration

The widget features a built-in **Configuration Dashboard** accessible via the "Widget Configuration" link on the landing page. This allows real-time synchronization of:
- Agent Identity (Name & Greeting)
- Bio-Theme (Custom Colors)
- Visual Signature (Avatars & Launcher Icons)

---

## 🏗 Deployment
```bash
npm run deploy
```

---

## ⚖️ License
MIT License - Nexus AI Ecosystem.
