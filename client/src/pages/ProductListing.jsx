import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, searchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const results = await searchProducts(query);
      setProducts(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setLoading(true);
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  };

  if (loading) return <p className="text-white text-center mt-10">Loading products...</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">NovaCart AI — Products</h1>
        <Link to="/cart" className="text-white text-sm">Cart ({cartCount})</Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: comfortable shoes for running"
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-md outline-none placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={searching}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-semibold disabled:opacity-50"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Clear
          </button>
        )}
      </form>

      {error && <p className="text-red-400 mb-4">Error: {error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductListing;