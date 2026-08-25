import { ChromaClient } from 'chromadb';

const chromaClient = new ChromaClient({ host: 'localhost', port: 8000 });

export const getProductCollection = async () => {
  return await chromaClient.getOrCreateCollection({
    name: 'products',
  });
};

export default chromaClient;