import { useNavigate, useLocation } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const total = state?.total || 0;
return (
  <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex flex-col items-center justify-center gap-6 p-6">
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-3xl p-10 flex flex-col items-center gap-5 max-w-md w-full text-center">

     
      <div className="w-20 h-20 bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900 rounded-full flex items-center justify-center text-5xl animate-bounce">
        ✅
      </div>

      
      <h1 className="text-3xl font-black text-gray-900 dark:text-white">Order Placed!</h1>
      <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed">
        Your order has been confirmed and will be delivered soon.
      </p>

      
      <div className="w-full bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900 rounded-2xl p-4">
        <p className="text-green-600 dark:text-green-400 font-bold text-lg">
          ₹{total.toLocaleString("en-IN")} paid successfully 🎉
        </p>
      </div>

     
      <div className="flex gap-3 w-full">
        <button
          onClick={() => navigate("/orders")}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition cursor-pointer"
        >
          View Orders
        </button>
        <button
          onClick={() => navigate("/products")}
          className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-xl font-bold hover:bg-white/60 dark:hover:bg-gray-800 transition cursor-pointer"
        >
          Shop More
        </button>
      </div>

    </div>
  </div>
);
}