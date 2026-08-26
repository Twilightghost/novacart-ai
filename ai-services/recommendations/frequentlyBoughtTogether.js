import Order from '../../server/models/Order.js';
import Product from '../../server/models/Product.js';
import mongoose from 'mongoose';

export const getFrequentlyBoughtTogether = async (productId, topK = 5) => {
  const objectId = new mongoose.Types.ObjectId(productId);

  const orders = await Order.find({ 'items.product': objectId });

  const coOccurrence = {};

  for (const order of orders) {
    const otherProductIds = order.items
      .map((item) => item.product.toString())
      .filter((id) => id !== productId);

    for (const id of otherProductIds) {
      coOccurrence[id] = (coOccurrence[id] || 0) + 1;
    }
  }

  const sortedIds = Object.entries(coOccurrence)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([id]) => id);

  if (sortedIds.length === 0) return [];

  return await Product.find({ _id: { $in: sortedIds } }).select('-embedding');
};