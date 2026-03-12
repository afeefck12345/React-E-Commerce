
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">🛒 ShopZone</Link>
      <div className="flex gap-4 items-center">
         <Link to="/products" className="hover:underline text-sm">Products</Link>
         <button
          onClick={toggleTheme}
          className="text-xl"
          title="Toggle Theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {user ? (
          <>
            <span className="text-sm">Hi, {user.name}</span>
            {user.role === "admin" && (
              <Link to="/admin" className="hover:underline text-sm">Admin</Link>
            )}
            <Link to="/orders" className="hover:underline text-sm">Orders</Link>
            <Link to="/cart" className="hover:underline text-sm relative">
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline text-sm">Login</Link>
            <Link to="/register" className="hover:underline text-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}


