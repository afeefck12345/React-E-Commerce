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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="flex flex-col gap-4">

          <div>
            <input name="name" placeholder="Full Name" onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

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

          <div>
            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button onClick={handleSubmit}
            className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Register
          </button>
        </div>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}