import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: 'object',
  properties: {
    sentiment: { type: 'string', enum: ['positive', 'mixed', 'negative'] },
    summary: { type: 'string', description: 'A 1-2 sentence overview of what customers think of this product.' },
    pros: { type: 'array', items: { type: 'string' }, description: 'Up to 4 short, specific positive points mentioned by reviewers.' },
    cons: { type: 'array', items: { type: 'string' }, description: 'Up to 4 short, specific negative points mentioned by reviewers. Empty array if none.' },
  },
  required: ['sentiment', 'summary', 'pros', 'cons'],
};

export const analyzeProductReviews = async (productTitle, reviews) => {
  const reviewText = reviews
    .map((r, i) => `Review ${i + 1} (${r.rating}/5 stars): ${r.comment}`)
    .join('\n');

  const prompt = `Analyze these customer reviews for "${productTitle}". Base your analysis STRICTLY on what is written in the reviews below — do not invent details not mentioned.

REVIEWS:
${reviewText}

Provide an overall sentiment, a brief summary, and specific pros/cons actually mentioned by reviewers.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  });

  return JSON.parse(response.text);
};