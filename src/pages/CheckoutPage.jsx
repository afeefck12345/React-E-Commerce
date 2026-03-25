import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [form, setForm] = useState({
    name: user?.name || "",
    address: user?.address.street||"",
    city: user?.address.city||"",
    pincode: user?.address.pincode||"",
    cardNumber:"",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit pincode";
    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, "")))
      e.cardNumber = "Enter valid 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "Format: MM/YY";
    if (!/^\d{3}$/.test(form.cvv)) e.cvv = "Enter valid 3-digit CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") value = value.replace(/\D/g, "").slice(0, 3);
    if (name === "pincode") value = value.replace(/\D/g, "").slice(0, 6);
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

 const handleSubmit = async () => {
  if (!validate()) return;

  setStep("processing");
  await new Promise((res) => setTimeout(res, 2500));

  const order = {
    userId: user.id,
    items: cartItems,
    total: totalPrice,
    address: `${form.address}, ${form.city} - ${form.pincode}`,
    date: new Date().toISOString(),
    status: "pending",
  };

  const res = await API.post("/orders", order);

  const captured = totalPrice;
  const capturedItems = [...cartItems]; // snapshot before clearCart wipes it
  await clearCart();

  navigate("/order-success", {
    state: {
      orderId: res.data.id,
      total: captured,
      items: capturedItems,
      address: {
        name: form.name,
        line1: form.address,
        city: form.city,
        pincode: form.pincode,
      },
    },
  });
};

if (step === "processing") {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5">
      <div
        className="w-12 h-12 rounded-full animate-spin"
        style={{
          border: "3px solid rgba(14,165,233,0.15)",
          borderTop: "3px solid #0ea5e9",
        }}
      />
      <p className="text-xl font-extrabold text-[#0c2340] tracking-tight">
        Processing Payment...
      </p>
      <p className="text-[11px] text-sky-900/35 uppercase tracking-widest font-semibold">
        Please don't close this page
      </p>
    </div>
  );
}

return (
  <div className="min-h-screen bg-white px-4 py-8">
    <div className="max-w-5xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Final Step
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-tight">
          Checkout
        </h1>
        <p className="text-sm text-sky-900/40 mt-1 font-light">
          Complete your order below
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* Left: Forms */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Delivery Details */}
          <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm shadow-sky-100/40">
            <div
              className="px-6 py-4 border-b border-sky-100"
              style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500 mb-0.5">
                Step 1
              </p>
              <h2 className="text-sm font-bold text-[#0c2340]">
                📦 Delivery Details
              </h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-0">
              <Field label="Full Name"  name="name"    value={form.name}    onChange={handleChange} error={errors.name}    placeholder="John Doe" />
              <Field label="Address"    name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="123, Street Name" />
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                <Field label="City"    name="city"    value={form.city}    onChange={handleChange} error={errors.city}    placeholder="Mumbai" />
                <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} placeholder="400001" />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm shadow-sky-100/40">
            <div
              className="px-6 py-4 border-b border-sky-100"
              style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500 mb-0.5">
                Step 2
              </p>
              <h2 className="text-sm font-bold text-[#0c2340]">
                💳 Payment Details
              </h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-0">
              <Field label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} error={errors.cardNumber} placeholder="1234 5678 9012 3456" />
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
                <Field label="Expiry" name="expiry" value={form.expiry} onChange={handleChange} error={errors.expiry} placeholder="MM/YY" />
                <Field label="CVV"    name="cvv"    value={form.cvv}    onChange={handleChange} error={errors.cvv}    placeholder="123" type="password" />
              </div>
            </div>
          </div>

        </div>

        {/* Right: Order Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-sky-100 rounded-2xl sticky top-6 overflow-hidden shadow-xl shadow-sky-100/40">

            {/* Header */}
            <div
              className="px-5 py-4 border-b border-sky-100"
              style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500 mb-0.5">
                Review
              </p>
              <h2 className="text-sm font-bold text-[#0c2340]">
                Order Summary
              </h2>
            </div>

            {/* Items */}
            <div className="px-5 py-4 flex flex-col gap-3 max-h-52 overflow-y-auto">
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

            {/* Totals + Actions */}
            <div
              className="px-5 py-4 border-t border-sky-100 flex flex-col gap-3"
              style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.03), rgba(16,185,129,0.03))" }}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-900/35">
                  Subtotal
                </span>
                <span className="text-sm font-semibold text-[#0c2340]">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-sky-900/35">
                  Delivery
                </span>
                <span className="text-sm font-bold text-emerald-500 uppercase tracking-wide">
                  Free
                </span>
              </div>

              <div
                className="pt-3 flex justify-between items-center"
                style={{ borderTop: "1px solid rgba(14,165,233,0.15)" }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#0c2340]">
                  Total
                </span>
                <span
                  className="text-xl font-extrabold bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                >
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full text-white py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px cursor-pointer border-none mt-1"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
              >
                Pay Now ⚡
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full py-2.5 text-[11px] font-semibold uppercase tracking-widest text-sky-900/40 border border-sky-100 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition cursor-pointer"
              >
                ← Back to Cart
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
);
}

function Field({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col flex-1 mb-6">
      <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-900/40 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-[#0c2340] placeholder-sky-900/20 outline-none transition
          ${error ? "border-red-300 focus:border-red-400" : "border-sky-100 focus:border-sky-400"}`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
