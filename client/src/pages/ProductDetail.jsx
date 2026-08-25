import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/productService';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-white text-center mt-10">Loading product...</p>;
  if (error) return <p className="text-red-400 text-center mt-10">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-blue-400 text-sm">&larr; Back to products</Link>
        <Link to="/cart" className="text-white text-sm">Cart ({cartCount})</Link>
      </div>
      <div className="max-w-2xl mx-auto mt-6 bg-gray-800 rounded-lg p-6">
        <div className="bg-gray-700 rounded-md h-64 flex items-center justify-center text-gray-500 mb-4">
          No image
        </div>
        <h1 className="text-2xl font-bold text-white">{product.title}</h1>
        <p className="text-gray-400 text-sm mt-1">{product.category} · {product.brand}</p>
        <p className="text-white text-xl font-bold mt-4">₹{product.price.toLocaleString()}</p>
        <p className="text-gray-300 mt-4">{product.description}</p>
        <p className="text-gray-500 text-sm mt-4">{product.stock} in stock</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;