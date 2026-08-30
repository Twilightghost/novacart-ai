import connectDB, { mongoose } from '../../server/config/db.js';
import User from '../../server/models/User.js';
import Product from '../../server/models/Product.js';
import Review from '../../server/models/Review.js';

const reviewsByProductTitle = {
  'AeroFlex Running Shoes': [
    { rating: 5, comment: 'Incredibly lightweight, my feet feel great even after a 10k run. Cushioning is excellent.' },
    { rating: 4, comment: 'Great shoes overall, though they run slightly small. Order half a size up.' },
    { rating: 5, comment: 'Best running shoes I have owned. Breathable mesh keeps feet cool.' },
    { rating: 2, comment: 'Sole started peeling after two months of regular use. Disappointed for the price.' },
  ],
  'PixelBook Pro 14 Laptop': [
    { rating: 5, comment: 'Fast, light, and the battery genuinely lasts all day of coding. Highly recommend for developers.' },
    { rating: 4, comment: 'Great performance but gets a bit warm under heavy compilation workloads.' },
    { rating: 5, comment: 'Perfect for programming on the go. Keyboard feels great too.' },
    { rating: 3, comment: 'Good laptop but the price feels steep compared to similar specs elsewhere.' },
  ],
  'HydroFlow Steel Water Bottle': [
    { rating: 5, comment: 'Keeps water cold literally all day, even in summer heat. Exactly as advertised.' },
    { rating: 5, comment: 'No leaks, solid build quality, and the size is perfect for daily use.' },
    { rating: 4, comment: 'Works great, only wish it came in more colors.' },
  ],
  'ComfortFit Ergonomic Chair': [
    { rating: 5, comment: 'My back pain disappeared within a week of using this chair for work.' },
    { rating: 4, comment: 'Very comfortable, assembly took a while but worth it.' },
    { rating: 2, comment: 'Armrests feel flimsy and started wobbling after a month.' },
  ],
  'YogaFlex Non-Slip Mat': [
    { rating: 5, comment: 'Thick, comfortable, and genuinely non-slip even during sweaty sessions.' },
    { rating: 4, comment: 'Good mat, slight rubber smell initially but faded after airing out.' },
  ],
};

const run = async () => {
  try {
    await connectDB();
    await Review.deleteMany({});
    console.log('Cleared old reviews');

    const users = await User.find({ email: /\.seed@example\.com$/ });
    if (users.length === 0) {
      console.log('No seed users found — run seedOrders.js first');
      await mongoose.disconnect();
      return;
    }

    let count = 0;
    for (const [title, reviews] of Object.entries(reviewsByProductTitle)) {
      const product = await Product.findOne({ title });
      if (!product) continue;

      for (let i = 0; i < reviews.length; i++) {
        const user = users[i % users.length];
        await Review.create({
          product: product._id,
          user: user._id,
          rating: reviews[i].rating,
          comment: reviews[i].comment,
        });
        count++;
      }
    }

    console.log(`Created ${count} seed reviews`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Review seeding failed:', error.message);
    process.exit(1);
  }
};

run();