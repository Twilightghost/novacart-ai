export const buildProductContext = (products) => {
  if (products.length === 0) return 'No matching products were found in the catalog.';

  return products
    .map(
      (p, i) =>
        `[${i + 1}] ${p.title} — ₹${p.price} — Category: ${p.category} — ${p.description} (Stock: ${p.stock})`
    )
    .join('\n');
};