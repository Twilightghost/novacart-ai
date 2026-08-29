import express from 'express';
import { getRecommendationsForUser } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/:userId', getRecommendationsForUser);

export default router;