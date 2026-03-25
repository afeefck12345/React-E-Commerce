import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const loggedInUser = await login(form.email, form.password);
      if (loggedInUser.role !== "admin") {
        setErrors({ password: "Access denied! Admins only." });
        return;
      }
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setErrors({ password: err.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white border border-sky-100 rounded-2xl p-8 w-full max-w-md shadow-lg shadow-sky-100/50">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
            Admin Panel
          </p>
          <h2 className="text-2xl font-extrabold text-[#0c2340] tracking-tight">
            Admin Login
          </h2>
          <p className="text-sky-900/40 text-sm mt-1 font-light">
            Sign in to your ShopHub admin panel
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-0">

          <div className="flex flex-col mb-6">
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="admin@example.com"
              onChange={handleChange}
              className={`border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-[#0c2340] placeholder-sky-900/20 outline-none transition
                ${errors.email ? "border-red-300 focus:border-red-400" : "border-sky-100 focus:border-sky-400"}`}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col mb-8">
            <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Your password"
              onChange={handleChange}
              className={`border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-[#0c2340] placeholder-sky-900/20 outline-none transition
                ${errors.password ? "border-red-300 focus:border-red-400" : "border-sky-100 focus:border-sky-400"}`}
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full text-white py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px cursor-pointer border-none"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
          >
            Login
          </button>

        </div>

        {/* Back to user login */}
        <p className="text-sm text-center mt-6 text-sky-900/40 font-light">
          Not an admin?{" "}
          <a
            href="/login"
            className="text-sky-500 hover:text-sky-600 font-semibold text-xs uppercase tracking-widest"
          >
            User Login
          </a>
        </p>

      </div>
    </div>
  );
}