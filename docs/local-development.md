# Nexus AI | Local Development

Guide for modifying the Liquid Neural Interface and testing local intelligence simulations.

## 1. Startup Protocols

```bash
# Optimized for local emulation
npm run dev
```

The system will start at `http://localhost:8787`.

---

## 2. Configuration Simulation

Nexus AI features a real-time **Config Dashboard** on the landing page. 
1. Open the landing page at `localhost:8787`.
2. Click **"Widget Configuration"** in the top navigation.
3. Modify Agent Name, Greeting, or Bio-Colors (Hex).
4. Click **"SYNC SYSTEM"** to apply changes instantly.

*Note: In local dev mode, these settings persist in the `.wrangler/state/v3` directory.*

---

## 3. Design System (Vanilla CSS)

Unlike traditional SaaS widgets, Nexus AI uses **Avant-Garde Vanilla CSS** for zero-latency rendering.

- **Global Tokens**: Managed in `public/styles.css` using CSS Variables (`--acid-lime`, `--void-depth`).
- **Widget Specifics**: Styles are injected dynamically via `public/widget.js` to ensure the widget remains lightweight and independent.
- **Modifying UI**: Edit the `<style>` block inside the `init()` function of `public/widget.js`.

---

## 4. RAG Testing (Knowledge Retrieval)

To test how well the AI answers based on your data:
1. Ensure the server is running.
2. Run `npm run seed` to populate the local vector store.
3. Ask questions in the widget.
4. If the backend is unavailable or not seeded, the widget will enter **Neural Simulation Mode** (Demo Mode) to demonstrate UI interactions.

---

## 5. Directory Mapping

- `src/api/config.js`: Logic for the system configuration sync.
- `src/core/faq.js`: Orchestration for Vectorize and LLM queries.
- `public/config/default.json`: Static defaults for zero-latency initial load.
