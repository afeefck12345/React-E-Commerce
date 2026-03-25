import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { totalWishlistItems } = useWishlist();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    logout(navigate);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-sky-100 px-4 py-0 shadow-sm shadow-sky-100/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#0c2340]">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
          >
            🛒
          </span>
          <span>
            Shop
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}>
              Hub
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-stretch gap-1 h-14">
          <NavLink to="/products">Products</NavLink>

          {user && (
            <>
              {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
              <NavLink to="/orders">Orders</NavLink>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative flex items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-sky-900/50 hover:text-sky-600 transition border-b-2 border-transparent hover:border-sky-400"
              >
                ❤️ Wishlist
                {totalWishlistItems > 0 && (
                  <span
                    className="absolute top-2 right-0 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                  >
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-sky-900/50 hover:text-sky-600 transition border-b-2 border-transparent hover:border-sky-400"
              >
                🛒 Cart
                {totalItems > 0 && (
                  <span
                    className="absolute top-2 right-0 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            </>
          )}

          <div className="w-px bg-sky-100 mx-1 self-center h-5" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            className="flex items-center justify-center px-3 text-sm text-sky-900/40 hover:text-sky-500 transition border-b-2 border-transparent hover:border-sky-400"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* User dropdown */}
          {user ? (
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-3 h-full text-[11px] font-semibold uppercase tracking-widest transition border-b-2
                  ${dropdownOpen
                    ? "text-sky-600 border-sky-400"
                    : "text-sky-900/50 border-transparent hover:text-sky-600 hover:border-sky-400"
                  }`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[80px] truncate">{user.name?.split(" ")[0]}</span>
                <span className={`text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>▾</span>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-0 w-56 bg-white border border-sky-100 shadow-xl shadow-sky-100/50 z-50 rounded-b-xl overflow-hidden"
                  style={{ borderTop: "2px solid #0ea5e9" }}
                >
                  <div
                    className="px-4 py-3 border-b border-sky-100"
                    style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
                  >
                    <p className="text-sm font-bold text-[#0c2340] truncate">{user.name}</p>
                    <p className="text-[11px] text-sky-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <DropdownLink icon="👤" label="My Profile" onClick={() => { setDropdownOpen(false); navigate("/profile"); }} />
                    <DropdownLink icon="📦" label="My Orders" onClick={() => { setDropdownOpen(false); navigate("/orders"); }} />
                    <DropdownLink icon="❤️" label="Wishlist" onClick={() => { setDropdownOpen(false); navigate("/wishlist"); }} />
                    <DropdownLink icon="ℹ️" label="About" onClick={() => { setDropdownOpen(false); navigate("/profile", { state: { section: "about" } }); }} />
                    {user.role === "admin" && (
                      <DropdownLink icon="🛠️" label="Admin Panel" onClick={() => { setDropdownOpen(false); navigate("/admin"); }} />
                    )}
                    <div className="my-1 border-t border-sky-100" />
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500 transition text-left"
                    >
                      <span className="text-sm">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2">
              <Link to="/login" className="text-[11px] font-semibold uppercase tracking-widest text-sky-900/50 hover:text-sky-600 px-3 py-1.5 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="text-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition rounded-lg hover:-translate-y-px"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right: icons + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {user && (
            <>
              <Link to="/wishlist" className="relative text-xl">
                ❤️
                {totalWishlistItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                  >
                    {totalWishlistItems}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative text-xl">
                🛒
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="text-sky-900/50 hover:text-sky-600 transition p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-sky-100 bg-white/95 backdrop-blur-md pb-4">
          <div className="flex flex-col px-4 pt-3 gap-1">
            <MobileLink to="/products" onClick={() => setMenuOpen(false)}>Products</MobileLink>

            {user && (
              <>
                {user.role === "admin" && <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileLink>}
                <MobileLink to="/orders" onClick={() => setMenuOpen(false)}>Orders</MobileLink>
                <MobileLink to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</MobileLink>
                <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</MobileLink>
              </>
            )}

            <div className="flex items-center justify-between pt-3 mt-1 border-t border-sky-100">
              <button
                onClick={toggleTheme}
                className="text-sm text-sky-900/40 hover:text-sky-500 transition"
              >
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>

              {user ? (
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="text-[11px] font-semibold uppercase tracking-widest text-red-400 hover:text-red-500 transition"
                >
                  🚪 Logout
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-[11px] font-semibold uppercase tracking-widest text-sky-900/50 hover:text-sky-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-lg"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="flex items-center px-3 text-[11px] font-semibold uppercase tracking-widest text-sky-900/50 hover:text-sky-600 transition border-b-2 border-transparent hover:border-sky-400"
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="px-2 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-sky-900/50 hover:text-sky-600 transition border-b border-sky-50"
    >
      {children}
    </Link>
  );
}

function DropdownLink({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-sky-900/60 hover:bg-sky-50 hover:text-sky-600 transition text-left"
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </button>
  );
}