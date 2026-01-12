# Nexus AI | Local Development Guide

Learn how to run, test, and modify the Nexus AI widget on your local machine.

## 1. Local Installation

Clone the repository and install the development dependencies:

```bash
npm install
```

---

## 2. Running Local Development

Nexus AI supports two modes of local development depending on your needs.

### A. Full Local Emulation
To run entirely on your local machine (using local emulators for KV and Vectorize):

```bash
npm run dev
```
*Note: In this mode, data is stored in `.wrangler/state`. You will need to run `npm run seed` while the server is running to populate your local database.*

### B. Remote Development (Hybrid)
To run local code but connect to **remote** Cloudflare AI, KV, and Vectorize:

```bash
npm run dev:remote
```
*This is the recommended way to test RAG accuracy with real production data.*

---

## 3. Project Structure & Architecture

Nexus AI uses a modern, modular design:

- **`src/api/`**: Route handlers for chat, history, and seeding.
- **`src/core/`**: Orchestration logic and Vector search (RAG).
- **`src/config/`**: Centralized models (`models.js`) and app settings (`app.js`).
- **`src/utils/`**: Shared helpers and middleware.
- **`public/`**: The widget frontend (`widget.js`) and landing page.

---

## 4. Testing the Widget

1. Start the development server (`npm run dev`).
2. Open `http://localhost:8787` in your browser.
3. You will see the **Nexus AI** landing page.
4. Use the chat bubble in the bottom-right corner to interact with the AI.

---

## 5. Modifying Styles

The project uses Tailwind CSS. To modify the design:
1. Edit `src/input.css` or the class names in `public/index.html` and `public/widget.js`.
2. The `dev` script will automatically recompile `public/styles.css`.
3. To manually build production CSS:
   ```bash
   npm run build:css
   ```
