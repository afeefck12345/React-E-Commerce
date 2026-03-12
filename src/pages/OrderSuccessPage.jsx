import { useNavigate, useLocation } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const total = state?.total || 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-6 p-6">
      <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-xl p-10 flex flex-col items-center gap-5 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-5xl animate-bounce">
          ✅
        </div>
        <h1 className="text-3xl font-black dark:text-white">Order Placed!</h1>
        <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
          Your order has been confirmed and will be delivered soon.
        </p>
        <div className="w-full bg-green-50 dark:bg-green-900/30 rounded-2xl p-4">
          <p className="text-green-600 dark:text-green-400 font-bold text-lg">
            ₹{total.toLocaleString("en-IN")} paid successfully 🎉
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/products")}
            className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition"
          >
            Shop More
          </button>
        </div>
      </div>
    </div>
  );
}