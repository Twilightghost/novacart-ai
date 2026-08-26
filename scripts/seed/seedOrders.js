import connectDB, { mongoose } from '../../server/config/db.js';
import User from '../../server/models/User.js';
import Product from '../../server/models/Product.js';
import Order from '../../server/models/Order.js';

const dummyUsers = [
  { firebaseUid: 'seed-uid-1', name: 'Aisha Verma', email: 'aisha.seed@example.com' },
  { firebaseUid: 'seed-uid-2', name: 'Rohan Mehta', email: 'rohan.seed@example.com' },
  { firebaseUid: 'seed-uid-3', name: 'Priya Nair', email: 'priya.seed@example.com' },
  { firebaseUid: 'seed-uid-4', name: 'Karan Shah', email: 'karan.seed@example.com' },
  { firebaseUid: 'seed-uid-5', name: 'Divya Rao', email: 'divya.seed@example.com' },
];

// Each entry: which product TITLES tend to get bought together (simulates realistic bundles)
const orderBundles = [
  ['AeroFlex Running Shoes', 'RunLight Reflective Jacket', 'FitTrack Smart Watch'],
  ['AeroFlex Running Shoes', 'YogaFlex Non-Slip Mat'],
  ['CodeCraft Mechanical Keyboard', 'FocusView 27" Monitor', 'DeskPad XL Mouse Mat'],
  ['CodeCraft Mechanical Keyboard', 'PixelBook Pro 14 Laptop'],
  ['PixelBook Pro 14 Laptop', 'DeskPad XL Mouse Mat', 'SoundWave Wireless Earbuds'],
  ['ComfortFit Ergonomic Chair', 'StudyDesk Compact Table'],
  ['BrewMaster Drip Coffee Maker', 'ChopEase Chef Knife Set'],
  ['HydroFlow Steel Water Bottle', 'YogaFlex Non-Slip Mat', 'RunLight Reflective Jacket'],
  ['UrbanStep Casual Sneakers', 'BackPack Pro 30L Travel Bag'],
  ['TrailBlaze Hiking Boots', 'BackPack Pro 30L Travel Bag', 'HydroFlow Steel Water Bottle'],
  ['SoundWave Wireless Earbuds', 'PowerCore 20000mAh Power Bank'],
  ['CozyNight Memory Foam Pillow', 'ReadLight Clip-On Book Lamp'],
];

const run = async () => {
  try {
    await connectDB();

    await Order.deleteMany({});
    await User.deleteMany({ email: /\.seed@example\.com$/ });
    console.log('Cleared old seed orders/users');

    const users = await User.insertMany(dummyUsers);
    console.log(`Created ${users.length} seed users`);

    const allProducts = await Product.find({});
    const productByTitle = Object.fromEntries(allProducts.map((p) => [p.title, p]));

    let orderCount = 0;
    for (let i = 0; i < orderBundles.length; i++) {
      const bundle = orderBundles[i];
      const user = users[i % users.length];

      const items = bundle
        .map((title) => productByTitle[title])
        .filter(Boolean)
        .map((product) => ({
          product: product._id,
          quantity: 1,
          priceAtPurchase: product.price,
        }));

      if (items.length === 0) continue;

      const totalAmount = items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

      await Order.create({
        user: user._id,
        items,
        totalAmount,
        status: 'delivered',
      });
      orderCount++;
    }

    console.log(`Created ${orderCount} seed orders`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Order seeding failed:', error.message);
    process.exit(1);
  }
};

run();