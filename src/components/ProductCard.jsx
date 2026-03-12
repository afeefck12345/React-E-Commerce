import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
          {product.category}
        </span>
        <h3 className="text-lg font-bold mt-2 dark:text-white">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-300 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-blue-400">₹{product.price}</span>
          <span className="text-xs text-gray-400 dark:text-gray-300">Stock: {product.stock}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}