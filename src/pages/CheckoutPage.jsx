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
    address: "",
    city: "",
    pincode: "",
    cardNumber: "",
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
      status: "Confirmed",
    };

    await API.post("/orders", order);

    const captured = totalPrice;
    await clearCart();
    navigate("/order-success", { state: { total: captured } });
  };

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-5">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xl font-bold dark:text-white">Processing Payment...</p>
        <p className="text-sm text-gray-400">Please don't close this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">🧾 Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 dark:text-white">📦 Delivery Details</h2>
            <div className="flex flex-col gap-3">
              <Field label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
              <Field label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="123, Street Name" />
              <div className="flex gap-3">
                <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="Mumbai" />
                <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} placeholder="400001" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 dark:text-white">💳 Payment Details</h2>
            <div className="flex flex-col gap-3">
              <Field label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} error={errors.cardNumber} placeholder="1234 5678 9012 3456" />
              <div className="flex gap-3">
                <Field label="Expiry" name="expiry" value={form.expiry} onChange={handleChange} error={errors.expiry} placeholder="MM/YY" />
                <Field label="CVV" name="cvv" value={form.cvv} onChange={handleChange} error={errors.cvv} placeholder="123" type="password" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-80">
          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
            <div className="flex flex-col gap-3 mb-4 max-h-52 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
                  <span className="truncate w-40">{item.name} × {item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <hr className="border-gray-200 dark:border-gray-600 mb-4" />
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Subtotal</span>
              <span className="font-medium dark:text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Delivery</span>
              <span className="text-green-500 font-medium text-sm">FREE</span>
            </div>
            <hr className="border-gray-200 dark:border-gray-600 my-3" />
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold dark:text-white">Total</span>
              <span className="text-2xl font-black text-blue-500">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 active:scale-95 transition"
            >
              Pay Now ⚡
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="w-full mt-3 py-2.5 rounded-xl text-sm text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-2.5 rounded-xl border text-sm dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition ${
          error
            ? "border-red-400 bg-red-50 dark:bg-red-900/20"
            : "border-gray-200 dark:border-gray-500"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}