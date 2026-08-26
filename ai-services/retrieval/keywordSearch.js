import Product from '../../server/models/Product.js';

export const keywordSearch = async (query, topK = 10) => {
  const results = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(topK);

  return results.map((p) => ({ productId: p._id.toString(), title: p.title }));
};