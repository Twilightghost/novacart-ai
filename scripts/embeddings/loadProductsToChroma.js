import connectDB, { mongoose } from '../../server/config/db.js';
import Product from '../../server/models/Product.js';
import { getProductCollection } from '../../ai-services/retrieval/chromaClient.js';

const run = async () => {
  try {
    await connectDB();
    const products = await Product.find({ embedding: { $exists: true, $ne: [] } });
    console.log(`Found ${products.length} embedded products to load into Chroma`);

    const collection = await getProductCollection();

    await collection.add({
      ids: products.map((p) => p._id.toString()),
      embeddings: products.map((p) => p.embedding),
      metadatas: products.map((p) => ({
        title: p.title,
        category: p.category,
        price: p.price,
      })),
      documents: products.map((p) => p.title),
    });

    console.log('All products loaded into Chroma successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Loading to Chroma failed:', error.message);
    process.exit(1);
  }
};

run();