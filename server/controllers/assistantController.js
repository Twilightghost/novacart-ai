import { askShoppingAssistant } from '../../ai-services/rag/shoppingAssistant.js';

export const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || question.trim() === '') {
      return res.status(400).json({ message: 'Question is required' });
    }

    const result = await askShoppingAssistant(question);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Assistant failed to respond', error: error.message });
  }
};