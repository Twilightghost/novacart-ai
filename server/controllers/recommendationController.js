import { getPersonalizedRecommendations } from '../../ai-services/recommendations/personalizedRecommendations.js';

export const getRecommendationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await getPersonalizedRecommendations(userId, 8);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get recommendations', error: error.message });
  }
};