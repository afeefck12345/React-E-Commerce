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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">🛒 Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-4 flex gap-4 items-center"
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
                <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">
                  {item.category}
                </p>
                <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">
                  {item.name}
                </h3>
                <p className="text-blue-500 font-bold text-lg mt-1">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-9 h-9 text-lg font-bold text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-extrabold dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 text-lg font-bold text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-500 transition"
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
                  className="text-xs text-red-400 hover:text-red-600 transition"
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>

            <div className="flex flex-col gap-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
                  <span className="truncate w-40">{item.name} × {item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 dark:border-gray-600 mb-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold dark:text-white">Total</span>
              <span className="text-2xl font-black text-blue-500">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>


            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 active:scale-95 transition"
            >
              Proceed to Checkout ⚡
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full mt-3 py-2.5 rounded-xl text-sm text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}