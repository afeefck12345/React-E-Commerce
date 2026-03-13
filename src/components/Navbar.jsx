
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";


export default function Navbar() {
  const { totalItems,clearCart } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { totalWishlistItems,clearWishlist } = useWishlist();
 

  const handleLogout = async() => {
    await clearCart()
    await clearWishlist()
    logout();
    navigate("/login");
  };

 return (
    <nav className="bg-linear-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        
        <Link
          to="/"
          className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1"
        >
          🛒{" "}
          <span className="bg-linear-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            ShopHub
          </span>
        </Link>

        
        <div className="flex items-center gap-5">
          <Link
            to="/products"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Products
          </Link>

          {user && (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/orders"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Orders
              </Link>
              <Link
                  to="/wishlist"
                  className="relative text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  ❤️ Wishlist
                  {totalWishlistItems > 0 && (
                    <span className="absolute -top-2 -right-4 bg-pink-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalWishlistItems}
                    </span>
                  )}
                </Link>
              <Link
                to="/cart"
                className="relative text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                🛒 Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </>
          )}

        
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

          
          

          
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition cursor-pointer text-sm"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <>
            
              <div className="bg-white/70 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Hi, {user.name}
              </div>

              <button
                onClick={handleLogout}
                className="bg-white/70 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
