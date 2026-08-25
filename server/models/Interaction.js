import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: {
      type: String,
      enum: ['view', 'click', 'add_to_cart', 'wishlist', 'purchase'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Interaction', interactionSchema);