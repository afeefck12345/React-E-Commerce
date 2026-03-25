import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  confirmed: { label: "Confirmed", color: "bg-blue-50 text-blue-600 border-blue-200" },
  shipped:   { label: "Shipped",   color: "bg-purple-50 text-purple-600 border-purple-200" },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600 border-red-200" },
};

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user?.loginAt]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/orders`);
      const userOrders = res.data.filter((order) => order.userId === user.id);
      const sorted = userOrders.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setOrders(sorted);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImages = async (items) => {
    const unfetched = items.filter(
      (item) => item.productId && !productImages[item.productId]
    );
    if (unfetched.length === 0) return;

    const results = await Promise.allSettled(
      unfetched.map((item) => API.get(`/products/${item.productId}`))
    );

    const newImages = {};
    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        const product = result.value.data;
        const imageUrl = product.image || product.imageUrl || product.thumbnail || null;
        if (imageUrl) newImages[unfetched[idx].productId] = imageUrl;
      }
    });

    setProductImages((prev) => ({ ...prev, ...newImages }));
  };

  const handleExpand = (order) => {
    const newId = expandedId === order.id ? null : order.id;
    setExpandedId(newId);
    if (newId) fetchProductImages(order.items);
  };

  // ✅ Loading
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

  // ✅ Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(16,185,129,0.1))",
          }}
        >
          📦
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#0c2340] tracking-tight">
            No orders yet
          </h2>
          <p className="text-sky-900/40 text-sm mt-1 font-light">
            Your order history will appear here.
          </p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="text-white px-8 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none mt-2"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
        >
          Start Shopping →
        </button>
      </div>
    );
  }

  // ✅ Orders list
  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
            History
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-sky-900/40 mt-1 font-light">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const status = order.status.toLowerCase() || "pending";
            const isCancelled = status === "cancelled";
            const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
            const currentStep = STATUS_STEPS.indexOf(status);

            const date = new Date(order.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            const time = new Date(order.date).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order.id}
                className="bg-white border border-sky-100 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-sky-100/50"
              >
                {/* Header Row */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 gap-2 cursor-pointer hover:bg-sky-50/50 transition"
                  onClick={() => handleExpand(order)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-sky-900/35">
                      Order #{order.id}
                    </span>
                    <p className="text-sm text-sky-900/50">
                      {date} at {time}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusCfg.color}`}
                    >
                      {statusCfg.label}
                    </span>
                    <span className="font-bold">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t px-3 sm:px-5 py-4 flex flex-col gap-4">

                    {/* Status Stepper */}
                    {!isCancelled ? (
                      <div className="flex items-center gap-0 mb-1">
                        {STATUS_STEPS.map((step, idx) => {
                          const isCompleted = currentStep >= idx;
                          const isLast = idx === STATUS_STEPS.length - 1;
                          const stepLabels = {
                            pending: "Pending",
                            confirmed: "Confirmed",
                            shipped: "Shipped",
                            delivered: "Delivered",
                          };
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex flex-col items-center flex-1">
                                {/* Circle */}
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                    isCompleted
                                      ? "bg-sky-500 border-sky-500 text-white"
                                      : "bg-white border-sky-200 text-sky-200"
                                  }`}
                                >
                                  {isCompleted ? (
                                    // checkmark
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    idx + 1
                                  )}
                                </div>
                                {/* Label */}
                                <span
                                  className={`text-[9px] mt-1 font-medium hidden xs:block sm:block ${isCompleted ? "text-sky-500" : "text-sky-200"}`}
                                >
                                  {stepLabels[step]}
                                </span>
                              </div>

                              {/* Connector line */}
                              {!isLast && (
                                <div
                                  className={`h-0.5 flex-1 mb-4 transition-all ${
                                    currentStep > idx ? "bg-sky-500" : "bg-sky-100"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Cancelled notice
                      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-xs text-red-500 font-medium">
                          This order was cancelled.
                        </p>
                      </div>
                    )}

                    {/* Items */}
                    <div className="flex flex-col gap-3">
                      {order.items.map((item, idx) => {
                        const imageUrl =
                          item.image ||
                          item.imageUrl ||
                          (item.productId && productImages[item.productId]) ||
                          null;

                        return (
                          <div key={idx} className="flex items-center gap-3">
                            {/* Product image */}
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-sky-100"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-sky-50 flex items-center justify-center text-xl border border-sky-100">
                                📦
                              </div>
                            )}

                            {/* Name & qty */}
                            <span className="flex-1 text-sm">
                              {item.name} × {item.quantity}
                            </span>

                            {/* Price */}
                            <span className="text-sm font-medium">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Total */}
                    <div className="flex justify-between items-center border-t pt-3 mt-1">
                      <span className="text-xs text-sky-900/40 font-medium uppercase tracking-wider">
                        Order Total
                      </span>
                      <span className="font-extrabold text-[#0c2340]">
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
    </div>
  );
}