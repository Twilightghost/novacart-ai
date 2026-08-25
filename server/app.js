import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check route — lets us verify the backend is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NovaCart AI server is running' });
});

export default app;