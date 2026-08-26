import Product from '../models/Product.js';
import { getSimilarProducts } from '../../ai-services/recommendations/similarProducts.js';
import { getFrequentlyBoughtTogether } from '../../ai-services/recommendations/frequentlyBoughtTogether.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const products = await Product.find(filter).sort({ createdAt: -1 }).select('-embedding');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-embedding');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [similarProducts, frequentlyBoughtTogether] = await Promise.all([
      getSimilarProducts(req.params.id, 5),
      getFrequentlyBoughtTogether(req.params.id, 5),
    ]);

    res.json({ ...product.toObject(), similarProducts, frequentlyBoughtTogether });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};