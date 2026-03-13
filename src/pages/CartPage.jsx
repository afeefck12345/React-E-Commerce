import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function CartPage() {
  const { cartItems, loading, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">🛒</p>
        <p className="text-2xl font-bold dark:text-white">Your cart is empty</p>
        <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }
return (
  <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 px-4 py-10">
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex gap-4 items-center"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/100?text=No+Image")
                }
              />

              {/* Details */}
              <div className="flex-1">
                <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">
                  {item.category}
                </p>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">
                  {item.name}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mt-1">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-9 h-9 text-lg font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-extrabold text-gray-800 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 text-lg font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>

                <button
                  onClick={async () => {
                    await removeFromCart(item.id);
                    showToast(`${item.name} removed from cart!`, "error");
                  }}
                  className="text-xs text-red-400 hover:text-red-500 transition"
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="truncate w-40">{item.name} × {item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 dark:border-gray-700 mb-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold active:scale-95 transition"
            >
              Proceed to Checkout ⚡
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full mt-3 py-2.5 rounded-xl text-sm text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-gray-800 transition"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
)
}