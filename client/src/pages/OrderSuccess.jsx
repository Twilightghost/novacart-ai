import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

function OrderSuccess() {
  const { setCart } = useCart();

  useEffect(() => {
    localStorage.removeItem('novacart_cart');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Order placed successfully! 🎉</h1>
        <p className="text-gray-400 mb-6">Thank you for shopping with NovaCart AI.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;