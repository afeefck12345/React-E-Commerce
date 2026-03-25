import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetailPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product && next > product.stock) return product.stock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (!user) { navigate("/login"); return; }
    if (!product) return;
    try {
       const result = await addToCart(product, quantity);
       if (result === "out_of_stock") {   
      showToast("Not enough stock available!", "error");
      return;
    }
      showToast(`${product.name} added to cart! 🎉`);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error("Failed to add to cart", err);
      showToast("Failed to add to cart", "error");
    }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate("/login"); return; }
    if (!product) return;
    try {
      await addToCart(product, quantity);
      navigate("/cart");
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const handleWishlist = async () => {
    if (!user) { navigate("/login"); return; }
    if (isWishlisted(product.id)) {
      await removeFromWishlist(product.id);
      showToast(`${product.name} removed from wishlist!`, "error");
    } else {
      await addToWishlist(product);
      showToast(`${product.name} added to wishlist! ❤️`, "success");
    }
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          Loading product...
        </p>
      </div>
    </div>
  );
}

if (!product) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
      <p className="text-6xl">😔</p>
      <p className="text-red-400 text-xl font-bold tracking-tight">Product not found</p>
      <button
        onClick={() => navigate("/products")}
        className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2.5 text-sm font-bold uppercase tracking-widest transition"
      >
        ← Back to Products
      </button>
    </div>
  );
}

const totalPrice = (product.price * quantity).toLocaleString("en-IN");
const wishlisted = isWishlisted(product.id);
return (
  <div className="min-h-screen bg-white">

    {/* Breadcrumb */}
    <div className="flex items-center gap-2 px-6 pt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-900/35">
      <button onClick={() => navigate("/")} className="hover:text-sky-500 transition">Home</button>
      <span>/</span>
      <button onClick={() => navigate("/products")} className="hover:text-sky-500 transition">Products</button>
      <span>/</span>
      <span className="text-[#0c2340] truncate">{product.name}</span>
    </div>

    {/* Product Detail */}
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-5xl bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-xl shadow-sky-100/40">
        <div className="flex flex-col md:flex-row">

          {/* Left: Image */}
          <div
            className="md:w-5/12 relative flex items-center"
            style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.06), rgba(16,185,129,0.08))" }}
          >
            {/* Stock + Category badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
              {product.stock > 0 ? (
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-400 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-full">
                  Out of Stock
                </span>
              )}
              <span
                className="text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-full"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
              >
                {product.category}
              </span>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full border transition cursor-pointer ${
                wishlisted
                  ? "bg-red-50 border-red-200"
                  : "bg-white/80 backdrop-blur-sm border-sky-200/60 hover:border-sky-300"
              }`}
            >
              <span style={{ fontSize: "14px" }}>{wishlisted ? "❤️" : "🤍"}</span>
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 md:h-full md:min-h-[320px] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x400?text=No+Image";
              }}
            />
          </div>

          {/* Right: Details */}
          <div className="md:w-7/12 p-6 flex flex-col gap-4">

            {/* Title + Rating */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-400 mb-1">
                SKU: {product.id}
              </p>
              <h1 className="text-2xl font-extrabold text-[#0c2340] leading-snug mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm tracking-tight">★★★★☆</span>
                <span className="text-xs text-sky-900/35 font-light">(4.0 / 5) · 128 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span
                className="text-3xl font-extrabold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-sky-900/30 line-through mb-1 font-light">
                ₹{Math.round(product.price * 1.2).toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-emerald-500 font-bold mb-1">20% off</span>
            </div>

            <div className="h-px bg-gradient-to-r from-sky-100 to-transparent" />

            {/* Description */}
            <p className="text-sky-900/50 text-sm leading-relaxed font-light">
              {product.description}
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2" >
              {[
                { icon: "📦", label: "Free Delivery" },
                { icon: "🔄", label: "7 Day Return" },
                { icon: "🛡️", label: "1 Year Warranty" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="border border-sky-100 p-2 text-center rounded-xl"
                  style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.04), rgba(16,185,129,0.04))" }}
                >
                  <p className="text-lg">{icon}</p>
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-sky-900/40 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Stock Status */}
            <p className="text-sm">
              {product.stock > 0 ? (
                <span className="text-emerald-500 font-semibold uppercase tracking-wide text-[10px]">
                  ✓ In Stock — {product.stock} units left
                </span>
              ) : (
                <span className="text-red-400 font-semibold uppercase tracking-wide text-[10px]">
                  ✗ Out of Stock
                </span>
              )}
            </p>
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-[10px] text-orange-400 font-semibold uppercase tracking-wide -mt-2">
                ⚠️ Hurry! Only {product.stock} left in stock.
              </p>
            )}

            <div className="h-px bg-gradient-to-r from-sky-100 to-transparent" />

            {/* Quantity + Total */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-900/35 mb-2">
                  Quantity
                </p>
                <div className="flex items-center border border-sky-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 text-lg font-bold text-sky-500 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-extrabold text-[#0c2340] border-x border-sky-200 h-10 flex items-center justify-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 text-lg font-bold text-sky-500 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-900/35 mb-1">
                  Total
                </p>
                <p
                  className="text-2xl font-extrabold bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                >
                  ₹{totalPrice}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Wishlist toggle */}
              <button
                onClick={handleWishlist}
                className={`w-12 h-11 flex items-center justify-center rounded-xl border-2 transition cursor-pointer ${
                  wishlisted
                    ? "bg-red-50 border-red-200"
                    : "border-sky-200 hover:border-sky-400"
                }`}
              >
                <span style={{ fontSize: "14px" }}>{wishlisted ? "❤️" : "🤍"}</span>
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl border-2 transition duration-300 ${
                  added
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : product.stock === 0
                    ? "bg-sky-50 border-sky-100 text-sky-300 cursor-not-allowed"
                    : "border-sky-300 text-sky-600 hover:bg-sky-50"
                }`}
              >
                {added ? "✓ Added!" : "🛒 Add to Cart"}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className={`flex-1 py-3 text-[11px] font-semibold uppercase tracking-widest text-white rounded-xl transition duration-300 border-none ${
                  product.stock === 0 ? "opacity-40 cursor-not-allowed" : "hover:-translate-y-px"
                }`}
                style={product.stock > 0
                  ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)" }
                  : { background: "#cbd5e1" }
                }
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate("/products")}
              className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest text-sky-900/40 border border-sky-100 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition"
            >
              ← Continue Shopping
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
);
}