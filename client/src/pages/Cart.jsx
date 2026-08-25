import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <Link to="/" className="text-blue-400 text-sm">&larr; Continue shopping</Link>
      <h1 className="text-2xl font-bold text-white mt-4 mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="max-w-2xl">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center bg-gray-800 rounded-lg p-4 mb-3">
              <div>
                <p className="text-white font-semibold">{item.title}</p>
                <p className="text-gray-400 text-sm">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 text-sm hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right mt-4">
            <p className="text-white text-xl font-bold">Total: ₹{total.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;