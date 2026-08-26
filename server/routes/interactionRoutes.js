import express from 'express';
import { logInteraction } from '../controllers/interactionController.js';

const router = express.Router();

router.post('/', logInteraction);

export default router;