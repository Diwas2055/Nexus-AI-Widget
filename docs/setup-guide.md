# Nexus AI | Detailed Setup Guide

This guide covers the initial configuration and Cloudflare environment setup required to run the Nexus AI Chatbot Widget.

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **Cloudflare Account**: [Sign up here](https://dash.cloudflare.com/sign-up)
- **Wrangler CLI**: Installed globally (`npm install -g wrangler`)

---

## 2. Cloudflare Infrastructure Setup

Nexus AI relies on three core Cloudflare services. You must create these resources before the application can function.

### A. Authentication
First, authenticate your local machine with your Cloudflare account:
```bash
npx wrangler login
```

### B. KV Namespace (Session Storage)
Create the Key-Value storage for chat histories:
```bash
npx wrangler kv:namespace create CHAT_SESSIONS
```
**Required Action:** Copy the `id` from the output and paste it into `wrangler.jsonc` under the `kv_namespaces` section.

### C. Vectorize Index (RAG Engine)
Create the vector database for the FAQ knowledge base:
```bash
npx wrangler vectorize create faq-vectors --dimensions=768 --metric=cosine
```
*Note: We use 768 dimensions to match the `bge-base-en-v1.5` embedding model.*

---

## 3. Configuration

### Project Bindings (`wrangler.jsonc`)
Ensure your `wrangler.jsonc` matches your created resources:
```jsonc
{
  "name": "nexus-ai-widget",
  "compatibility_date": "2026-01-12",
  "kv_namespaces": [
    {
      "binding": "CHAT_SESSIONS",
      "id": "YOUR_KV_ID_HERE"
    }
  ],
  "vectorize": [
    {
      "binding": "VECTORIZE",
      "index_name": "faq-vectors"
    }
  ],
  "ai": {
    "binding": "AI"
  }
}
```

### AI Models & Prompts
- **Models**: Managed in `src/config/models.js`
- **Prompts & FAQ**: Managed in `src/config/app.js`

---

## 4. Deployment to Cloudflare

Deploy the worker to the global edge network:

```bash
# Build styles and deploy
npm run deploy
```

Once deployed, your backend API and static assets (the widget) will be live at `https://nexus-ai-widget.[your-subdomain].workers.dev`.

---

## 5. Seeding the Knowledge Base

After deployment (or while running `npm run dev:remote`), you must "seed" the vector database with your FAQ data:

```bash
# Uses the 'seed' script in package.json
npm run seed
```
This will take the data from `src/config/app.js`, generate embeddings, and upload them to Cloudflare Vectorize.
