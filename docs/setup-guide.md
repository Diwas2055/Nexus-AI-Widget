# Nexus AI | Technical Setup Guide

This guide covers the infrastructure required to run the Nexus AI "Liquid Neural" environment on Cloudflare.

## 1. Prerequisites

- **Node.js**: v18.0.0+
- **Cloudflare Account**: [Sign up](https://dash.cloudflare.com/sign-up)
- **Wrangler CLI**: `npm install -g wrangler`

---

## 2. Infrastructure Provisioning

### A. KV Namespaces
Nexus AI requires two KV namespaces: one for user sessions and one for dynamic system configuration.

```bash
# 1. Session Storage
npx wrangler kv namespace create CHAT_SESSIONS

# 2. System Configuration
npx wrangler kv namespace create CONFIG_STORE
```
**Action:** Copy the IDs from the output and paste them into `wrangler.jsonc` under `kv_namespaces`.

### B. Vectorize Index (Intelligence Layer)
Create the high-dimensional vector database:
```bash
npx wrangler vectorize create faq-vectors --dimensions=768 --metric=cosine
```
*Note: Dimensions are matched to the `bge-base-en-v1.5` model.*

---

## 3. Configuration Binding

Update your `wrangler.jsonc` bindings to match your new resources:

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "CHAT_SESSIONS",
      "id": "SESSION_KV_ID"
    },
    {
      "binding": "CONFIG_STORE",
      "id": "CONFIG_KV_ID"
    }
  ],
  "vectorize": [
    { "binding": "VECTORIZE", "index_name": "faq-vectors" }
  ],
  "ai": { "binding": "AI" }
}
```

---

## 4. Seeding the Neural Network

Once infrastructure is bound, you must upload your knowledge base:

```bash
npm run seed
```
This processes documentation from `src/config/app.js` (or your chosen source), generates embeddings, and populates the `faq-vectors` index.

---

## 5. Deployment

Push your interface to the global edge:

```bash
npm run deploy
```
Your widget script will be available at: `https://[your-worker-url]/widget.js`
