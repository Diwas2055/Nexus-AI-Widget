import { MODELS } from '../config/models.js';
import { FAQ_DATA } from '../config/app.js';
import { json } from '../utils/shared.js';

export async function seed(req, env) {
    const faqs = FAQ_DATA;

    try {
        const vectors = await Promise.all(
            faqs.map(async ([question, answer], i) => {
                const textToEmbed = `${question} ${answer}`;
                const embedding = await env.AI.run(MODELS.EMBEDDING, {
                    text: [textToEmbed],
                });

                return {
                    id: `faq-${i + 1}`,
                    values: embedding.data[0],
                    metadata: { question, answer },
                };
            })
        );

        await env.VECTORIZE.upsert(vectors);

        return json({
            success: true,
            message: `Successfully seeded ${faqs.length} FAQs into Vectorize index.`,
        });
    } catch (error) {
        console.error('Seed Error:', error);
        return json({ error: 'Failed to seed data', details: error.message }, 500);
    }
}
