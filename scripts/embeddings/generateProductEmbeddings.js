import connectDB, { mongoose } from '../../server/config/db.js';
import Product from '../../server/models/Product.js';
import { generateEmbedding } from '../../ai-services/embeddings/generateEmbedding.js';

const run = async () => {
  try {
    await connectDB();
    const products = await Product.find({});
    console.log(`Found ${products.length} products to embed`);

    for (const product of products) {
      const text = `${product.title}. ${product.description}. Category: ${product.category}. Brand: ${product.brand}.`;
      const embedding = await generateEmbedding(text);
      product.embedding = embedding;
      await product.save();
      console.log(`Embedded: ${product.title}`);
    }

    console.log('All products embedded successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Embedding generation failed:', error.message);
    process.exit(1);
  }
};

run();