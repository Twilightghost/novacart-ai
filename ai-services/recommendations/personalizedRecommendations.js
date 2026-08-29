import Interaction from '../../server/models/Interaction.js';
import Product from '../../server/models/Product.js';
import { getProductCollection } from '../retrieval/chromaClient.js';

const TYPE_WEIGHTS = {
  view: 1,
  click: 1,
  add_to_cart: 3,
  wishlist: 2,
  purchase: 5,
};

export const getPersonalizedRecommendations = async (userId, topK = 8) => {
  const interactions = await Interaction.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('product', 'embedding');

  if (interactions.length === 0) return [];

  const validInteractions = interactions.filter(
    (i) => i.product && i.product.embedding && i.product.embedding.length > 0
  );
  if (validInteractions.length === 0) return [];

  const dimensions = validInteractions[0].product.embedding.length;
  const weightedSum = new Array(dimensions).fill(0);
  let totalWeight = 0;

  for (const interaction of validInteractions) {
    const weight = TYPE_WEIGHTS[interaction.type] || 1;
    totalWeight += weight;
    interaction.product.embedding.forEach((value, index) => {
      weightedSum[index] += value * weight;
    });
  }

  const preferenceVector = weightedSum.map((sum) => sum / totalWeight);

  const interactedProductIds = new Set(
    validInteractions.map((i) => i.product._id.toString())
  );

  const collection = await getProductCollection();
  const results = await collection.query({
    queryEmbeddings: [preferenceVector],
    nResults: topK + interactedProductIds.size,
  });

  const recommendedIds = results.ids[0]
    .filter((id) => !interactedProductIds.has(id))
    .slice(0, topK);

  if (recommendedIds.length === 0) return [];

  return await Product.find({ _id: { $in: recommendedIds } }).select('-embedding');
};