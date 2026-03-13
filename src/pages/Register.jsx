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
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 px-4">
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-8 w-full max-w-md">

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Join ShopZone today</p>
      </div>

      <div className="flex flex-col gap-4">

        <div>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition cursor-pointer"
        >
          Create Account
        </button>

      </div>

      <p className="text-sm text-center mt-5 text-gray-400 dark:text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">
          Login
        </Link>
      </p>

    </div>
  </div>
);
}