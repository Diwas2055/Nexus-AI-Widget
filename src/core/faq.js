import { MODELS } from '../config/models.js';

export async function getFaqContext(env, query) {
    try {
        const embeddingResponse = await env.AI.run(MODELS.EMBEDDING, {
            text: [query],
        });

        if (!embeddingResponse.data || embeddingResponse.data.length === 0) {
            return '';
        }

        const queryVector = embeddingResponse.data[0];

        const matches = await env.VECTORIZE.query(queryVector, {
            topK: 3,
            returnMetadata: 'all',
        });

        if (!matches.matches || matches.matches.length === 0) {
            return '';
        }

        return matches.matches
            .map((m) => `Question: ${m.metadata?.question}\nAnswer: ${m.metadata?.answer}`)
            .join('\n\n');
    } catch (error) {
        console.error('Vector Search Error:', error);
        return '';
    }
}
