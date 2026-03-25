// 

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.name || form.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!/[A-Z]/.test(form.password))
      newErrors.password = "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(form.password))
      newErrors.password = "Password must contain at least one number";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
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
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setErrors({ email: err.message });
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-white px-4">
    <div className="bg-white border border-sky-100 rounded-2xl p-8 w-full max-w-md shadow-lg shadow-sky-100/50">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Get Started
        </p>
        <h2 className="text-2xl font-extrabold text-[#0c2340] tracking-tight">
          Create Account
        </h2>
        <p className="text-sky-900/40 text-sm mt-1 font-light">
          Join ShopHub today
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-0">

        <div className="flex flex-col mb-6">
          <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
            Full Name
          </label>
          <input
            name="name"
            placeholder="Your full name"
            onChange={handleChange}
            className={`border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-[#0c2340] placeholder-sky-900/20 outline-none transition
              ${errors.name ? "border-red-300 focus:border-red-400" : "border-sky-100 focus:border-sky-400"}`}
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name}</p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={handleChange}
            className={`border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-[#0c2340] placeholder-sky-900/20 outline-none transition
              ${errors.email ? "border-red-300 focus:border-red-400" : "border-sky-100 focus:border-sky-400"}`}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            onChange={handleChange}
            className={`border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-[#0c2340] placeholder-sky-900/20 outline-none transition
              ${errors.password ? "border-red-300 focus:border-red-400" : "border-sky-100 focus:border-sky-400"}`}
          />
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex flex-col mb-8">
          <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
            Confirm Password
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            onChange={handleChange}
            className={`border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-[#0c2340] placeholder-sky-900/20 outline-none transition
              ${errors.confirmPassword ? "border-red-300 focus:border-red-400" : "border-sky-100 focus:border-sky-400"}`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full text-white py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px cursor-pointer border-none"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
        >
          Create Account
        </button>

      </div>

      <p className="text-sm text-center mt-6 text-sky-900/40 font-light">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-sky-500 hover:text-sky-600 font-semibold text-xs uppercase tracking-widest"
        >
          Login
        </Link>
      </p>

    </div>
  </div>
);
}