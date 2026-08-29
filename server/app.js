import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import interactionRoutes from './routes/interactionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NovaCart AI server is running' });
});

app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/assistant', assistantRoutes);

export default app;