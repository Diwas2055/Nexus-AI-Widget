# Nexus AI Widget 🤖

A premium, high-performance AI chatbot widget built on **Cloudflare Workers**, **Workers AI**, and **Vectorize**. Nexus AI utilizes RAG (Retrieval-Augmented Generation) to provide accurate, context-aware support based on your knowledge base.

---

## ✨ Key Features

- **🚀 Global Edge Performance**: Powered by Cloudflare Workers for 0ms cold starts worldwide.
- **🧠 Intelligent RAG Engine**: Contextual answering using Llama 3 and Vectorize.
- **💎 Premium UI/UX**: Stunning glassmorphism design with smooth animations.
- **🛠 Modular Architecture**: Scalable folder structure and centralized configurations.
- **🍪 Smart Persistence**: Remembers user conversations across sessions.

---

## 📂 Project Structure

```text
├── docs/              # Detailed documentation
├── public/            # Static assets & Demo page
│   ├── widget.js      # The embeddable script
│   └── styles.css     # Premium styling
├── src/
│   ├── api/           # Endpoint handlers
│   ├── core/          # RAG & AI logic
│   ├── config/        # Centralized Settings
│   └── utils/         # Helper functions
├── wrangler.jsonc     # Cloudflare Project Config
└── package.json       # Build scripts & Dependencies
```

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Configuration & Setup
Before running the project, you must configure your Cloudflare environment.
👉 **[Read the Full Setup Guide](./docs/setup-guide.md)**

### 3. Local Development
```bash
# Run local dev server
npm run dev
```
👉 **[Read the Local Development Guide](./docs/local-development.md)**

### 4. Seed Data
Populate your vector database with FAQ knowledge:
```bash
npm run seed
```

---

## 🏗 Deployment

Deploy to Cloudflare's global network in one command:
```bash
npm run deploy
```

---

## ⚖️ License
MIT License - Created for Nexus AI Ecosystem.
