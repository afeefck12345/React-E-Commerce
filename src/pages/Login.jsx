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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="flex flex-col gap-4">

          <div>
            <input name="email" type="email" placeholder="Email" onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input name="password" type="password" placeholder="Password" onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button onClick={handleSubmit}
            className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Login
          </button>
        </div>
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}