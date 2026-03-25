import { useState, useEffect } from "react";
import API from "../../services/api";

const STATUSES = ["Confirmed", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES = {
  Confirmed:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Pending:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Shipped:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Delivered:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Cancelled:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewOrder, setViewOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

    useEffect(()=>{
    setCurrentPage(1)
  },[filterStatus])

    useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (order, newStatus) => {  
    try {
      await API.patch(`/orders/${order.id}`, { status: newStatus.toLowerCase()  });
      
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
      if (viewOrder?.id === order.id) {
        setViewOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update status", err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/orders/${deleteOrder.id}`);
      setOrders(orders.filter((o) => o.id !== deleteOrder.id));
      setDeleteOrder(null);
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  const filtered =
  filterStatus === "all"
    ? orders
    : orders.filter(
        (o) =>
          o.status?.toLowerCase().trim() ===
          filterStatus.toLowerCase().trim()
      );

  const totalPages =Math.ceil(filtered.length/itemsPerPage);   
  const paginated=filtered.slice(
  (currentPage-1)* itemsPerPage,currentPage * itemsPerPage
 ) 

 return (
  <div className="mt-10">


    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Admin
        </p>
        <h2 className="text-3xl font-extrabold text-[#0c2340] tracking-tight">
          Orders
        </h2>
      </div>
      <p className="text-xs text-sky-900/40 uppercase tracking-widest font-semibold">
        {orders.length} total orders
      </p>
    </div>

    
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setFilterStatus("all")}
        className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest border rounded-xl transition cursor-pointer
          ${filterStatus === "all"
            ? "text-white border-transparent"
            : "border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500"
          }`}
        style={filterStatus === "all"
          ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)" }
          : {}}
      >
        All
      </button>
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => setFilterStatus(s)}
          className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest border rounded-xl transition cursor-pointer
            ${filterStatus === s
              ? "text-white border-transparent"
              : "border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500"
            }`}
          style={filterStatus === s
            ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)" }
            : {}}
        >
          {s}
        </button>
      ))}
    </div>

   
    {loading ? (
      <div className="flex flex-col items-center justify-center mt-24 gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-900/40">
          Loading orders...
        </p>
      </div>
    ) : (
      <>
      <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm shadow-sky-100/40">
         <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr
              className="border-b border-sky-100"
              style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
            >
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Order ID</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Items</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Total</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Status</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-sky-900/40 text-sm">
                  No orders found.
                </td>
              </tr>
            ) : (
              paginated.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-sky-100 hover:bg-sky-50/50 transition"
                >
                  <td className="px-5 py-3 font-bold text-[#0c2340]">
                    #{order.id}
                  </td>
                  <td className="px-5 py-3 text-sky-900/50">
                    {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-5 py-3 font-bold text-[#0c2340]">
                    ₹{order.total?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-500"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setDeleteOrder(order)}
                        className="border border-red-100 text-red-400 hover:bg-red-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
      {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-1 gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-900/40">
              Page {currentPage} of {totalPages} · {filtered.length} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border transition cursor-pointer ${
                    currentPage === page
                      ? "text-white border-none"
                      : "border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500"
                  }`}
                  style={currentPage === page ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)" } : {}}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </>
    )}

    
    {viewOrder && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
        <div className="bg-white border border-sky-100 rounded-2xl shadow-xl shadow-sky-100/50 p-5 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">

        
          <div
            className="flex items-center justify-between mb-6 pb-4 border-b border-sky-100 -mx-8 -mt-8 px-8 pt-6 rounded-t-2xl"
            style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-500 mb-0.5">
                Order Details
              </p>
              <h3 className="text-lg font-extrabold text-[#0c2340] tracking-tight">
                Order #{viewOrder.id}
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full ${STATUS_STYLES[viewOrder.status] ?? "bg-gray-100 text-gray-500"}`}
            >
              {viewOrder.status}
            </span>
          </div>

          {/* Date & Address */}
          <div className="mb-5 flex flex-col gap-1">
            <p className="text-xs text-sky-900/40">
              📅{" "}
              {new Date(viewOrder.date).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}{" "}
              at{" "}
              {new Date(viewOrder.date).toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
            {viewOrder.address && (
              <p className="text-xs text-sky-900/40">📍 {viewOrder.address}</p>
            )}
          </div>

         
          <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-3">
              Items
            </p>
            <div className="flex flex-col gap-2">
              {viewOrder.items?.length > 0 ? (
                viewOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2.5"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-11 h-11 object-cover rounded-lg flex-shrink-0 border border-sky-100"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/48?text=No+Image")
                        }
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      {item.category && (
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-500 mb-0.5">
                          {item.category}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-[#0c2340] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-sky-900/40">
                        ₹{item.price?.toLocaleString("en-IN")} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#0c2340] shrink-0">
                      ₹{(item.price * item.quantity)?.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-sky-900/40">No items found.</p>
              )}
            </div>
          </div>

          
          <div className="flex justify-between items-center mb-5 pt-3 border-t border-sky-100">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">
              Total
            </p>
            <p
              className="text-lg font-extrabold bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
            >
              ₹{viewOrder.total?.toLocaleString("en-IN")}
            </p>
          </div>

      
          <div className="mb-5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-2 block">
              Update Status
            </label>
            <select
              value={viewOrder.status}
              onChange={(e) => handleStatusChange(viewOrder, e.target.value)}
              className="w-full border border-sky-100 bg-white text-sm text-[#0c2340] px-3 py-2.5 rounded-xl outline-none focus:border-sky-400 transition cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setViewOrder(null)}
            className="w-full border border-sky-100 text-sky-900/50 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 hover:border-sky-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    )}

    
    {deleteOrder && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
        <div className="bg-white border border-sky-100 rounded-2xl shadow-xl shadow-sky-100/50 p-5 sm:p-8 w-full max-w-sm text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.12))" }}
          >
            🗑
          </div>
          <h3 className="text-lg font-extrabold text-[#0c2340] tracking-tight mb-2">
            Delete Order
          </h3>
          <p className="text-sky-900/40 text-sm mb-6 font-light">
            Are you sure you want to delete{" "}
            <span className="text-[#0c2340] font-semibold">
              Order #{deleteOrder.id}
            </span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteOrder(null)}
              className="flex-1 border border-sky-100 text-sky-900/50 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl transition cursor-pointer border-none"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
);
}