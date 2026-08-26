import Interaction from '../models/Interaction.js';

export const logInteraction = async (req, res) => {
  try {
    const { userId, productId, type } = req.body;

    if (!userId || !productId || !type) {
      return res.status(400).json({ message: 'userId, productId, and type are required' });
    }

    const interaction = await Interaction.create({ user: userId, product: productId, type });
    res.status(201).json(interaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to log interaction', error: error.message });
  }
};