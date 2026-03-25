import { useNavigate, useLocation } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const total    = state?.total    || 0;
  const items    = state?.items    || [];
  const address  = state?.address  || null;
  const orderId  = state?.orderId  || null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="bg-white border border-sky-100 rounded-2xl p-8 flex flex-col items-center gap-5 max-w-lg w-full text-center shadow-lg shadow-sky-100/50">

        {/* Success Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(16,185,129,0.1))",
          }}
        >
          ✅
        </div>

        {/* Heading */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
            Success
          </p>
          <h1 className="text-2xl font-extrabold text-[#0c2340] tracking-tight mb-2">
            Order Placed!
          </h1>
          <p className="text-sky-900/40 text-sm font-light leading-relaxed">
            Your order has been confirmed and will be delivered soon.
          </p>
          {orderId && (
            <p className="text-[10px] uppercase tracking-widest text-sky-400 mt-2">
              Order #{orderId}
            </p>
          )}
        </div>

        {/* Product Details */}
        {items.length > 0 && (
          <div className="w-full text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-2">
              Items Ordered
            </p>
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2.5"
                >
                  {/* Product image or placeholder */}
                  {item.image || item.imageUrl ? (
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-sky-100"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg flex-shrink-0 bg-white border border-sky-100 flex items-center justify-center text-lg">
                      📦
                    </div>
                  )}

                  {/* Name & qty */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0c2340] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-sky-900/40">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <span className="text-sm font-bold text-[#0c2340] flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amount Paid */}
        <div className="w-full bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-0.5">
            Amount Paid
          </p>
          <p className="text-lg font-extrabold text-[#0c2340]">
            ₹{total.toLocaleString("en-IN")} 🎉
          </p>
        </div>

        {/* Delivery Address */}
        {address && (
          <div className="w-full text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-2">
              Delivery Address
            </p>
            <div className="bg-sky-50 border border-sky-100 rounded-xl px-4 py-3 flex gap-3 items-start">
              <span className="text-lg mt-0.5">📍</span>
              <div className="flex flex-col gap-0.5">
                {address.name && (
                  <p className="text-sm font-semibold text-[#0c2340]">
                    {address.name}
                  </p>
                )}
                {address.phone && (
                  <p className="text-xs text-sky-900/50">{address.phone}</p>
                )}
                {address.line1 && (
                  <p className="text-xs text-sky-900/50">{address.line1}</p>
                )}
                {address.line2 && (
                  <p className="text-xs text-sky-900/50">{address.line2}</p>
                )}
                {(address.city || address.state || address.pincode) && (
                  <p className="text-xs text-sky-900/50">
                    {[address.city, address.state, address.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 text-white py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/products")}
            className="flex-1 border border-sky-100 text-sky-900/50 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 hover:border-sky-200 transition cursor-pointer"
          >
            Shop More
          </button>
        </div>

      </div>
    </div>
  );
}