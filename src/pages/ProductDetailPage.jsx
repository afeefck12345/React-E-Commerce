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
      await addToCart(product, quantity);
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">😔</p>
        <p className="text-red-400 text-xl font-semibold">Product not found</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const totalPrice = (product.price * quantity).toLocaleString("en-IN");
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-6 pt-5 text-sm text-gray-400">
        <button onClick={() => navigate("/")} className="hover:text-indigo-500 transition">Home</button>
        <span>/</span>
        <button onClick={() => navigate("/products")} className="hover:text-indigo-500 transition">Products</button>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300 font-medium truncate">{product.name}</span>
      </div>

      {/* Main Card */}
      <div className="flex justify-center px-4 py-6">
        <div className="w-4/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* LEFT: Image */}
            <div className="md:w-5/12 relative bg-gray-50 dark:bg-gray-800 flex items-center">
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.stock > 0 ? (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    IN STOCK
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    OUT OF STOCK
                  </span>
                )}
                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

          
              <button
                onClick={handleWishlist}
                className={`absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full border transition cursor-pointer ${
                  wishlisted
                    ? "bg-pink-50 dark:bg-pink-950 border-pink-300 dark:border-pink-800"
                    : "bg-white/80 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800"
                }`}
              >
                {wishlisted ? "❤️" : "🤍"}
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 md:h-full object-cover"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/400x400?text=No+Image")
                }
              />
            </div>

           
            <div className="md:w-7/12 p-4 flex flex-col">
              <div>
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">
                  SKU: {product.id}
                </p>
                <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white leading-snug mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-400 text-sm tracking-tight">★★★★☆</span>
                  <span className="text-xs text-gray-400">(4.0 / 5) · 128 reviews</span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-gray-400 line-through mb-1">
                    ₹{Math.round(product.price * 1.2).toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-green-500 font-bold mb-1">20% off</span>
                </div>

                <hr className="border-gray-100 dark:border-gray-800 mb-3" />

                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-2">
                  {product.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-xl p-2 text-center">
                    <p className="text-lg">📦</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Free Delivery</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900 rounded-xl p-2 text-center">
                    <p className="text-lg">🔄</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">7 Day Return</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 border border-purple-100 dark:border-purple-900 rounded-xl p-2 text-center">
                    <p className="text-lg">🛡️</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">1 Year Warranty</p>
                  </div>
                </div>

                <p className="text-sm">
                  {product.stock > 0 ? (
                    <span className="text-green-500 font-medium">✓ In Stock — {product.stock} units left</span>
                  ) : (
                    <span className="text-red-400 font-medium">✗ Out of Stock</span>
                  )}
                </p>
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-xs text-orange-500 font-semibold mt-1">
                    ⚠️ Hurry! Only {product.stock} left in stock.
                  </p>
                )}
              </div>

              <div>
                <hr className="border-gray-100 dark:border-gray-800 my-2" />
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Quantity</p>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden w-fit">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 text-xl font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-lg font-extrabold text-gray-800 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 text-xl font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
                    <p className="text-2xl font-black text-gray-800 dark:text-white">₹{totalPrice}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                 
                  <button
                    onClick={handleWishlist}
                    className={`w-12 py-3 rounded-xl border-2 text-lg transition cursor-pointer ${
                      wishlisted
                        ? "bg-pink-50 dark:bg-pink-950 border-pink-300 dark:border-pink-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800"
                    }`}
                  >
                    {wishlisted ? "❤️" : "🤍"}
                  </button>

              
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition duration-300 border-2 ${
                      added
                        ? "bg-green-500 border-green-500 text-white"
                        : product.stock === 0
                        ? "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-transparent border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    }`}
                  >
                    {added ? "✓ Added!" : "🛒 Add to Cart"}
                  </button>

                 
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition duration-300 ${
                      product.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                    }`}
                  >
                    ⚡ Buy Now
                  </button>
                </div>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full mt-5 py-2.5 rounded-xl text-sm text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-gray-800 transition"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}