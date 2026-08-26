import { getProductCollection } from '../retrieval/chromaClient.js';
import Product from '../../server/models/Product.js';

export const getSimilarProducts = async (productId, topK = 5) => {
  const product = await Product.findById(productId);
  if (!product || !product.embedding.length) return [];

  const collection = await getProductCollection();
  const results = await collection.query({
    queryEmbeddings: [product.embedding],
    nResults: topK + 1,
  });

  const similarIds = results.ids[0].filter((id) => id !== productId).slice(0, topK);
  return await Product.find({ _id: { $in: similarIds } }).select('-embedding');
};