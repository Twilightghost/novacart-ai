import connectDB, { mongoose } from '../../server/config/db.js';
import Product from '../../server/models/Product.js';

const products = [
  { title: 'AeroFlex Running Shoes', description: 'Lightweight running shoes with breathable mesh and responsive cushioning, ideal for daily runs and long distances.', category: 'Footwear', price: 3499, stock: 50, brand: 'NovaCart Sport' },
  { title: 'UrbanStep Casual Sneakers', description: 'Comfortable everyday sneakers with a minimalist design, suitable for walking and casual outings.', category: 'Footwear', price: 2299, stock: 40, brand: 'NovaCart Sport' },
  { title: 'TrailBlaze Hiking Boots', description: 'Durable waterproof hiking boots with reinforced ankle support for rough terrain.', category: 'Footwear', price: 4599, stock: 25, brand: 'NovaCart Outdoor' },
  { title: 'CodeCraft Mechanical Keyboard', description: 'Compact mechanical keyboard with tactile switches, ideal for programming and typing-heavy work.', category: 'Electronics', price: 3999, stock: 30, brand: 'NovaCart Tech' },
  { title: 'PixelBook Pro 14 Laptop', description: 'Lightweight laptop with a fast processor and long battery life, suitable for coding and everyday productivity.', category: 'Electronics', price: 68999, stock: 15, brand: 'NovaCart Tech' },
  { title: 'SoundWave Wireless Earbuds', description: 'Noise-isolating wireless earbuds with clear sound and a compact charging case.', category: 'Electronics', price: 2499, stock: 60, brand: 'NovaCart Tech' },
  { title: 'FocusView 27" Monitor', description: '27-inch IPS monitor with sharp resolution, great for coding, design, and multitasking.', category: 'Electronics', price: 15999, stock: 20, brand: 'NovaCart Tech' },
  { title: 'PowerCore 20000mAh Power Bank', description: 'High-capacity portable charger with fast charging support for phones and tablets.', category: 'Electronics', price: 1799, stock: 80, brand: 'NovaCart Tech' },
  { title: 'ComfortFit Ergonomic Chair', description: 'Adjustable office chair with lumbar support, designed for long working hours.', category: 'Furniture', price: 8999, stock: 18, brand: 'NovaCart Home' },
  { title: 'StudyDesk Compact Table', description: 'Space-saving study desk with a sturdy frame, suitable for small rooms and home offices.', category: 'Furniture', price: 4499, stock: 22, brand: 'NovaCart Home' },
  { title: 'CozyNight Memory Foam Pillow', description: 'Contoured memory foam pillow that supports neck alignment for better sleep.', category: 'Home', price: 999, stock: 100, brand: 'NovaCart Home' },
  { title: 'BrewMaster Drip Coffee Maker', description: 'Programmable coffee maker with a 12-cup capacity, perfect for daily brewing routines.', category: 'Kitchen', price: 3299, stock: 35, brand: 'NovaCart Home' },
  { title: 'ChopEase Chef Knife Set', description: 'Stainless steel knife set with ergonomic handles, suited for everyday kitchen prep.', category: 'Kitchen', price: 1899, stock: 45, brand: 'NovaCart Home' },
  { title: 'HydroFlow Steel Water Bottle', description: 'Insulated stainless steel bottle that keeps drinks cold for 24 hours or hot for 12.', category: 'Lifestyle', price: 799, stock: 120, brand: 'NovaCart Lifestyle' },
  { title: 'FitTrack Smart Watch', description: 'Fitness tracker with heart-rate monitoring, step counting, and smartphone notifications.', category: 'Electronics', price: 4999, stock: 28, brand: 'NovaCart Tech' },
  { title: 'ReadLight Clip-On Book Lamp', description: 'Rechargeable clip lamp with adjustable brightness, ideal for reading at night.', category: 'Lifestyle', price: 599, stock: 70, brand: 'NovaCart Lifestyle' },
  { title: 'BackPack Pro 30L Travel Bag', description: 'Durable 30-liter backpack with laptop compartment, built for travel and daily commuting.', category: 'Lifestyle', price: 2799, stock: 33, brand: 'NovaCart Lifestyle' },
  { title: 'YogaFlex Non-Slip Mat', description: 'Extra-thick non-slip yoga mat suitable for yoga, stretching, and floor workouts.', category: 'Sports', price: 1299, stock: 55, brand: 'NovaCart Sport' },
  { title: 'RunLight Reflective Jacket', description: 'Lightweight windbreaker with reflective strips, designed for evening runs and outdoor activity.', category: 'Sports', price: 2199, stock: 27, brand: 'NovaCart Sport' },
  { title: 'DeskPad XL Mouse Mat', description: 'Extra-large desk mat providing a smooth surface for both mouse and keyboard.', category: 'Electronics', price: 699, stock: 90, brand: 'NovaCart Tech' },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products`);

    await mongoose.disconnect();
    console.log('Done — disconnected');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedProducts();