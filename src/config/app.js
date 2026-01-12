/**
 * AI Chatbot Configuration
 * Centralized place for prompts, UI text, and business data
 */

export const BRANDING = {
    NAME: 'AI Assistant',
    SHORT_NAME: 'AI',
    GREETING: '👋 Hello! How can I help you today?',
    PLACEHOLDER: 'Type your message...',
};

export const PROMPTS = {
    SYSTEM_MAIN: `You are a helpful customer support assistant. 
Be friendly, professional, and concise. 
Use the provided FAQ information if relevant to give accurate answers. 
If you don't know something based on the context, politely say so and offer to connect them to a human agent.`,

    CONTEXT_PREFIX: "\n\nUse this FAQ information if relevant:",
    ERROR_MESSAGE: '⚠️ Sorry, I encountered an error. Please try again later.',
};

export const FAQ_DATA = [
    ['How long does shipping take?', 'Standard 5-7 days, Express 2-3 days, Same-day in select areas.'],
    ['What is your return policy?', '30-day returns for unused items. Electronics 15 days if defective.'],
    ['Do you offer free shipping?', 'Yes! Orders over $50 get free standard shipping.'],
    ['How can I track my order?', 'Check your email for tracking or log into your account.'],
    ['What payment methods do you accept?', 'Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay.'],
    ['Do you have a warranty?', 'All products have manufacturer warranty. Extended plans available.'],
    ['Can I cancel my order?', 'Within 1 hour if not processed. Otherwise return after delivery.'],
    ['Do you ship internationally?', 'Yes, we ship to over 50 countries. Delivery usually takes 7-14 days.'],
];

export const SETTINGS = {
    SESSION_TTL: 30 * 24 * 60 * 60, // 30 days in seconds
    MAX_HISTORY_MESSAGES: 10,       // Number of messages to send to LLM for context
    COOKIE_NAME: 'chatbot_session',
};
