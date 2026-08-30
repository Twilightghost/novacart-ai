import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { logInteraction } from '../services/interactionService';
import ProductCard from '../components/ProductCard';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, cartCount } = useCart();
  const { dbUser } = useAuth();

  useEffect(() => {
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
        if (dbUser) {
          logInteraction(dbUser._id, id, 'view');
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, dbUser]);

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
          onClick={() => {
            addToCart(product);
            if (dbUser) {
              logInteraction(dbUser._id, product._id, 'add_to_cart');
            }
          }}
          className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-md"
        >
          Add to Cart
        </button>

        {product.reviewAnalysis && product.reviewAnalysis.analyzedAt && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-semibold">Customer sentiment:</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  product.reviewAnalysis.sentiment === 'positive'
                    ? 'bg-green-900 text-green-300'
                    : product.reviewAnalysis.sentiment === 'negative'
                    ? 'bg-red-900 text-red-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}
              >
                {product.reviewAnalysis.sentiment}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{product.reviewAnalysis.summary}</p>
            {product.reviewAnalysis.pros.length > 0 && (
              <div className="mb-2">
                <p className="text-green-400 text-sm font-semibold mb-1">Pros:</p>
                <ul className="text-gray-300 text-sm list-disc list-inside">
                  {product.reviewAnalysis.pros.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.reviewAnalysis.cons.length > 0 && (
              <div>
                <p className="text-red-400 text-sm font-semibold mb-1">Cons:</p>
                <ul className="text-gray-300 text-sm list-disc list-inside">
                  {product.reviewAnalysis.cons.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {product.similarProducts && product.similarProducts.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="text-white text-lg font-semibold mb-4">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {product.similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {product.frequentlyBoughtTogether && product.frequentlyBoughtTogether.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10 mb-10">
          <h2 className="text-white text-lg font-semibold mb-4">Frequently bought together</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {product.frequentlyBoughtTogether.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;