import { ChromaClient } from 'chromadb';

const chromaClient = new ChromaClient({
  host: process.env.CHROMA_HOST || 'localhost',
  port: process.env.CHROMA_PORT || 8000,
  ssl: process.env.CHROMA_SSL === 'true',
});

export const getProductCollection = async () => {
  return await chromaClient.getOrCreateCollection({
    name: 'products',
  });
};

export default chromaClient;