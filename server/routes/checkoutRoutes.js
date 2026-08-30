import express from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/', createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;