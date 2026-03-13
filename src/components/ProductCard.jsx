import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

const categoryColors = {
  Electronics: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  Clothing: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  Shoes: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  Sports: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Books: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const badgeColor = categoryColors[product.category] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (wishlisted) {
      await removeFromWishlist(product.id);
      showToast(`${product.name} removed from wishlist!`, "error");
    } else {
      await addToWishlist(product);
      showToast(`${product.name} added to wishlist!`, "success");
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-300 group flex flex-col relative"
    >

      {/* Heart Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full border transition cursor-pointer ${
          wishlisted
            ? "bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800"
            : "bg-white/80 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-800"
        }`}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>

      {/* Image */}
      <div className="h-48 overflow-hidden bg-gray-50 dark:bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg w-fit ${badgeColor}`}>
          {product.category}
        </span>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-2 leading-snug">
          {product.name}
        </h3>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            ${product.price.toLocaleString()}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
            product.stock <= 5
              ? "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400"
              : "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
          }`}>
            {product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
          className="mt-3 w-full py-2 rounded-xl border border-indigo-200 dark:border-indigo-900 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition cursor-pointer"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}