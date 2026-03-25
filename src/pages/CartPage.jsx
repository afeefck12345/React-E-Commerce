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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
   return (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">

    {/* Icon */}
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
      style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(16,185,129,0.1))" }}
    >
      🛒
    </div>

    {/* Text */}
    <div className="text-center">
      <h2 className="text-2xl font-extrabold text-[#0c2340] tracking-tight">
        Your cart is empty
      </h2>
      <p className="text-sky-900/40 text-sm mt-1 font-light">
        Looks like you haven't added anything yet.
      </p>
    </div>

    {/* Button */}
    <button
      onClick={() => navigate("/products")}
      className="text-white px-8 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none mt-2"
      style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
    >
      Browse Products →
    </button>

  </div>
);
  }

 return (
  <div className="min-h-screen bg-white px-4 py-8">
    <div className="max-w-6xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Your Bag
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-tight">
          Shopping Bag
        </h1>
        <p className="text-sm text-sky-900/40 mt-1 font-light">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your bag
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-sky-100 hover:border-sky-200 rounded-2xl p-4 flex gap-4 items-start transition-all duration-200 hover:shadow-lg hover:shadow-sky-100/50"
            >
              {/* Product image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-20 sm:w-24 sm:h-28 object-cover rounded-xl flex-shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x112?text=No+Image";
                }}
              />

              {/* Product details */}
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-500 mb-1">
                  {item.category}
                </p>
                <h3 className="font-bold text-[#0c2340] text-sm sm:text-base leading-tight mb-1">
                  {item.name}
                </h3>
                <p
                  className="text-lg font-extrabold bg-clip-text text-transparent mt-2"
                  style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                >
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
                {item.stock <= 5 && (
                  <p className="text-[10px] text-orange-400 font-semibold mt-1 uppercase tracking-wide">
                    ⚠️ Only {item.stock} left
                  </p>
                )}

                {/* Quantity + Remove */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-sky-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 text-base font-bold text-sky-500 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-[#0c2340] text-sm border-x border-sky-200 h-8 flex items-center justify-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 text-base font-bold text-sky-500 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={async () => {
                      await removeFromCart(item.id);
                      showToast(`${item.name} removed from cart!`, "error");
                    }}
                    className="text-[10px] font-semibold uppercase tracking-widest text-red-400 hover:text-red-500 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Item total */}
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-900/35 mb-1">
                  Total
                </p>
                <p className="text-base font-extrabold text-[#0c2340]">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-sky-100 rounded-2xl sticky top-6 overflow-hidden shadow-xl shadow-sky-100/40">

            {/* Header */}
            <div
              className="px-5 py-4 border-b border-sky-100"
              style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500 mb-0.5">
                Summary
              </p>
              <h2 className="text-sm font-bold text-[#0c2340]">
                Price Details
              </h2>
            </div>

            {/* Item breakdown */}
            <div className="px-5 py-4 flex flex-col gap-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-sky-900/45">
                  <span className="truncate w-40 font-light">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-[#0c2340]">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Total + Actions */}
            <div
              className="px-5 py-4 border-t border-sky-100"
              style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.03), rgba(16,185,129,0.03))" }}
            >
              <div className="flex justify-between items-center mb-5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0c2340]">
                  Total Amount
                </span>
                <span
                  className="text-xl font-extrabold bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                >
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full text-white py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => navigate("/products")}
                className="w-full mt-2 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-sky-900/40 border border-sky-100 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition"
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