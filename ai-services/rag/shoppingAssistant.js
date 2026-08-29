import { GoogleGenAI } from '@google/genai';
import { semanticSearch } from '../retrieval/semanticSearch.js';
import { keywordSearch } from '../retrieval/keywordSearch.js';
import { reciprocalRankFusion } from '../retrieval/rrf.js';
import { buildProductContext } from './buildContext.js';
import Product from '../../server/models/Product.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are the NovaCart AI shopping assistant. You help customers find products from the NovaCart catalog.

STRICT RULES — follow these exactly:
1. Only recommend or discuss products that appear in the CONTEXT section below. Never invent product names, prices, or features.
2. If the context doesn't contain relevant products for the question, say so clearly and suggest the customer try a different search — do not make something up.
3. Always mention the exact product name and price when recommending something.
4. Keep answers concise and helpful — 2-4 sentences unless the customer asks for detail.
5. You only discuss NovaCart products and shopping-related questions. If asked something unrelated (general knowledge, other companies, personal advice), politely decline and redirect to how you can help with shopping.
6. Never claim to know the customer's order history, account details, or anything not explicitly provided to you in context.`;

export const askShoppingAssistant = async (question) => {
  const [semanticResults, keywordResults] = await Promise.all([
    semanticSearch(question, 8).then((results) => results.filter((r) => r.distance <= 0.9)),
    keywordSearch(question, 8).catch(() => []),
  ]);

  const fused = reciprocalRankFusion([semanticResults, keywordResults]);
  const topIds = fused.slice(0, 6).map((f) => f.productId);

  const products = await Product.find({ _id: { $in: topIds } }).select('-embedding');
  const context = buildProductContext(products);

  const prompt = `${SYSTEM_INSTRUCTION}

CONTEXT (available products):
${context}

CUSTOMER QUESTION: ${question}

Answer the customer's question using only the products listed above.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  });

  return {
    answer: response.text,
    sources: products.map((p) => ({ id: p._id, title: p.title, price: p.price })),
  };
};