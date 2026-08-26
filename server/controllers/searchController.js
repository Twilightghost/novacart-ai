import { semanticSearch } from '../../ai-services/retrieval/semanticSearch.js';
import { keywordSearch } from '../../ai-services/retrieval/keywordSearch.js';
import { reciprocalRankFusion } from '../../ai-services/retrieval/rrf.js';
import Product from '../models/Product.js';

const DISTANCE_THRESHOLD = 0.85;

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const semanticResults = await semanticSearch(q, 10);
    const relevantSemantic = semanticResults.filter((r) => r.distance <= DISTANCE_THRESHOLD);

    let keywordResults = [];
    try {
      keywordResults = await keywordSearch(q, 10);
    } catch {
      keywordResults = [];
    }

    const fused = reciprocalRankFusion([relevantSemantic, keywordResults]);
    const productIds = fused.map((f) => f.productId);

    const products = await Product.find({ _id: { $in: productIds } }).select('-embedding');

    const ordered = productIds
      .map((id) => products.find((p) => p._id.toString() === id))
      .filter(Boolean);

    res.json(ordered);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};