import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
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
      className="bg-white border border-sky-100 hover:border-sky-300 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/60 group flex flex-col relative"
    >

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full border transition cursor-pointer ${
          wishlisted
            ? "bg-red-50 border-red-200"
            : "bg-white/80 backdrop-blur-sm border-sky-200/60 hover:border-sky-300"
        }`}
      >
        <span style={{ fontSize: "14px" }}>{wishlisted ? "❤️" : "🤍"}</span>
      </button>

      {/* Product Image */}
      <div
        className="h-48 overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.06), rgba(16,185,129,0.08))" }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">

        {/* Category */}
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-500">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-sm font-bold text-[#0c2340] mt-1.5 leading-snug">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-sky-900/40 mt-1 line-clamp-2 leading-relaxed flex-1 font-light">
          {product.description}
        </p>

        {/* Price + Stock */}
        <div className="flex items-center justify-between gap-1 flex-wrap mt-3 pt-3 border-t border-sky-100/60">
          <span
            className="text-base font-extrabold bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
          >
            ${product.price.toLocaleString()}
          </span>
          <span className={`text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full text-centerl ${
            product.stock <= 5
              ? "bg-red-50 text-red-400"
              : "bg-emerald-50 text-emerald-500"
          }`}>
            {product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </span>
        </div>

        {/* View Details Button */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
          className="mt-3 w-full py-2 text-[11px] font-semibold uppercase tracking-widest text-white rounded-lg transition-all hover:-translate-y-px cursor-pointer border-none"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
        >
          View Details →
        </button>

      </div>
    </div>
  );
}