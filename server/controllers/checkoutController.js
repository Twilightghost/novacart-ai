import Stripe from 'stripe';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { items, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.title },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cart`,
      metadata: {
        userId: userId || 'guest',
        items: JSON.stringify(items.map((i) => ({ id: i._id, qty: i.quantity, price: i.price }))),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, items } = session.metadata;

    if (userId && userId !== 'guest') {
      try {
        const parsedItems = JSON.parse(items);
        await Order.create({
          user: userId,
          items: parsedItems.map((i) => ({
            product: i.id,
            quantity: i.qty,
            priceAtPurchase: i.price,
          })),
          totalAmount: session.amount_total / 100,
          status: 'paid',
        });
        console.log('Order created for user:', userId);
      } catch (error) {
        console.error('Failed to create order:', error.message);
      }
    }
  }

  res.json({ received: true });
};