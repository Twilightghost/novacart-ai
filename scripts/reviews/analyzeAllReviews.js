import connectDB, { mongoose } from '../../server/config/db.js';
import Product from '../../server/models/Product.js';
import Review from '../../server/models/Review.js';
import { analyzeProductReviews } from '../../ai-services/reviews/analyzeReviews.js';

const run = async () => {
  try {
    await connectDB();

    const products = await Product.find({});
    let analyzedCount = 0;

    for (const product of products) {
      if (product.reviewAnalysis && product.reviewAnalysis.analyzedAt) {
        console.log(`Skipping (already analyzed): ${product.title}`);
        continue;
      }

      const reviews = await Review.find({ product: product._id });
      if (reviews.length === 0) continue;

      console.log(`Analyzing ${reviews.length} reviews for: ${product.title}`);
      const analysis = await analyzeProductReviews(product.title, reviews);

      product.reviewAnalysis = {
        ...analysis,
        analyzedAt: new Date(),
      };
      await product.save();
      analyzedCount++;
      console.log(`  → Sentiment: ${analysis.sentiment}`);
    }

    console.log(`\nAnalyzed ${analyzedCount} products with reviews`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Review analysis failed:', error.message);
    process.exit(1);
  }
};

run();