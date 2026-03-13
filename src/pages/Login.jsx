// 
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
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
      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrors({ password: err.message });
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 px-4">
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-8 w-full max-w-md">

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Login to your ShopZone account</p>
      </div>

      <div className="flex flex-col gap-4">

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

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition cursor-pointer"
        >
          Login
        </button>

      </div>

      <p className="text-sm text-center mt-5 text-gray-400 dark:text-gray-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">
          Register
        </Link>
      </p>

    </div>
  </div>
);
}