import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, default: '' },
    brand: { type: String, default: 'NovaCart' },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    embedding: { type: [Number], default: [] },
    reviewAnalysis: {
      sentiment: { type: String, enum: ['positive', 'mixed', 'negative', null], default: null },
      summary: { type: String, default: '' },
      pros: { type: [String], default: [] },
      cons: { type: [String], default: [] },
      analyzedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);