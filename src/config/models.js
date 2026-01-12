/**
 * AI Model Configuration
 * Centralized place to manage Cloudflare Workers AI models
 */

export const MODELS = {
    // Large Language Model for chat completions
    CHAT: '@cf/meta/llama-3-8b-instruct',

    // Embedding model for vector search / RAG
    EMBEDDING: '@cf/baai/bge-base-en-v1.5',

    // Optional: Alternative models for easy switching
    // CHAT_LARGE: '@cf/meta/llama-3-70b-instruct',
    // CHAT_SMALL: '@cf/meta/llama-2-7b-chat-int8',
};
