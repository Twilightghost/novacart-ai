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
  },
  { timestamps: true }
);
productSchema.index({ title: 'text', description: 'text', category: 'text' });
export default mongoose.model('Product', productSchema);