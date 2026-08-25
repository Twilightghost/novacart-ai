import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NovaCart AI server is running' });
});

app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);

export default app;