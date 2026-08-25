import { generateEmbedding } from '../embeddings/generateEmbedding.js';
import { getProductCollection } from './chromaClient.js';

export const semanticSearch = async (query, topK = 10) => {
  const queryEmbedding = await generateEmbedding(query);
  const collection = await getProductCollection();

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
  });

  return results.ids[0].map((id, index) => ({
    productId: id,
    title: results.documents[0][index],
    category: results.metadatas[0][index].category,
    price: results.metadatas[0][index].price,
    distance: results.distances[0][index],
  }));
};