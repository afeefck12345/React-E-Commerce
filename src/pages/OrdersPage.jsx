import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
  setLoading(true);
  try {
    const res = await API.get(`/orders`);
    const userOrders = res.data.filter((order) => order.userId === user.id); // filter manually
    const sorted = userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(sorted);
  } catch (err) {
    console.error("Failed to fetch orders", err);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">📦</p>
        <p className="text-2xl font-bold dark:text-white">No orders yet</p>
        <p className="text-gray-400 text-sm">Your order history will appear here.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">📦 My Orders</h1>

      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          const date = new Date(order.date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          });
          const time = new Date(order.date).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit",
          });

          return (
            <div key={order.id} className="bg-white dark:bg-gray-700 rounded-2xl shadow-md overflow-hidden">

              
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Order #{order.id}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{date} at {time}</p>
                  <p className="text-xs text-gray-400 mt-0.5">📍 {order.address}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-black text-blue-500">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-400">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs text-blue-400">
                    {isExpanded ? "▲ Hide" : "▼ Details"}
                  </span>
                </div>
              </div>

              
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-600 px-5 pb-5 pt-4 flex flex-col gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-600 rounded-xl p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/56?text=No+Image")
                        }
                      />
                      <div className="flex-1">
                        <p className="text-xs text-blue-500 font-semibold uppercase">{item.category}</p>
                        <p className="font-bold text-gray-800 dark:text-white text-sm leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-300 mt-0.5">
                          ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-gray-700 dark:text-white text-sm">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-600">
                    <span className="text-sm text-gray-400">Total Paid</span>
                    <span className="text-lg font-black text-blue-500">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}