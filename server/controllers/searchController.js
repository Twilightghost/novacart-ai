import { semanticSearch } from '../../ai-services/retrieval/semanticSearch.js';
import Product from '../models/Product.js';

const DISTANCE_THRESHOLD = 0.85;

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = await semanticSearch(q, 10);
    console.log(results.map((r) => ({ title: r.title, distance: r.distance })));
    const relevant = results.filter((r) => r.distance <= DISTANCE_THRESHOLD);
    const productIds = relevant.map((r) => r.productId);

    const products = await Product.find({ _id: { $in: productIds } }).select('-embedding');

    const ordered = productIds
      .map((id) => products.find((p) => p._id.toString() === id))
      .filter(Boolean);

    res.json(ordered);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};