import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform cursor-pointer">
        <div className="bg-gray-700 rounded-md h-40 flex items-center justify-center text-gray-500 text-sm">
          No image
        </div>
        <h3 className="text-white font-semibold text-sm">{product.title}</h3>
        <p className="text-gray-400 text-xs">{product.category}</p>
        <p className="text-white font-bold">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

export default ProductCard;