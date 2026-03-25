import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0,revenue: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isExactDashboard = location.pathname === "/admin/dashboard";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, users, orders] = await Promise.all([
          API.get("/products"),
          API.get("/users"),
          API.get("/orders"),
        ]);

        const totalRevenue = orders.data.reduce((sum, order) => {
          const orderTotal = order.items.reduce((s, item) => s + item.price * item.quantity, 0);
          return sum + orderTotal;
        }, 0);
        setStats({
          products: products.data.length,
          users: users.data.length,
          orders: orders.data.length,
          revenue: totalRevenue,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const navLinks = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Products", path: "/admin/dashboard/products" },
    { label: "Users", path: "/admin/dashboard/users" },
    { label: "Orders", path: "/admin/dashboard/orders" },
  ];

 return (
  <div className="min-h-screen flex bg-white">

    {/* Mobile Overlay */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 z-20 bg-black/30 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside className={`fixed z-30 top-0 left-0 h-full w-64 bg-white border-r border-sky-100 flex flex-col transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>

      {/* Logo */}
      <div
        className="px-6 py-6 border-b border-sky-100"
        style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
      >
        <h1 className="text-xl font-extrabold text-[#0c2340] tracking-tight">
          Shop<span className="text-sky-500">Hub</span>
        </h1>
        <p className="text-[10px] text-sky-900/40 mt-1 uppercase tracking-widest font-semibold">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-6 flex-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setSidebarOpen(false)}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition rounded-xl
              ${location.pathname === link.path
                ? "text-white"
                : "text-sky-900/40 hover:bg-sky-50 hover:text-sky-500"
              }`}
            style={
              location.pathname === link.path
                ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)" }
                : {}
            }
          >
            {link.label}
          </Link>
        ))}

        <div className="px-6 py-4 border-t border-sky-100 mt-auto">
          <p className="text-[10px] text-sky-900/40 uppercase tracking-widest mb-1 font-semibold">
            Logged in as
          </p>
          <p className="text-sm font-bold text-[#0c2340] mb-3">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="w-full border border-red-100 text-red-400 py-2 text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-red-50 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>

    {/* Main Content */}
    <div className="flex-1 flex flex-col min-w-0">

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-sky-100"
        style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}>
        <h1 className="text-lg font-extrabold text-[#0c2340] tracking-tight">
          Shop<span className="text-sky-500">Hub</span>
        </h1>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-sky-900/50 hover:text-sky-500 transition cursor-pointer"
        >
          {/* Hamburger icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <main className="flex-1 p-5 lg:p-10 bg-white">
        {isExactDashboard && (
          <>
            {/* Header */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
                Overview
              </p>
              <h1 className="text-3xl font-extrabold text-[#0c2340] tracking-tight mb-6">
                Dashboard
              </h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Total Products", value: stats.products },
                { label: "Total Users",    value: stats.users },
                { label: "Total Orders",   value: stats.orders },
                { label: "Total Revenue",  value: `₹${stats.revenue.toLocaleString()}` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-sky-100 rounded-2xl p-4 lg:p-6 shadow-sm shadow-sky-100/40"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl lg:text-3xl font-extrabold bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Manage Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Products",
                  desc: "Add, edit or remove products from the store.",
                  path: "/admin/dashboard/products",
                  label: "Manage Products",
                },
                {
                  title: "Users",
                  desc: "View, manage and control registered users. Block, delete or update roles.",
                  path: "/admin/dashboard/users",
                  label: "Manage Users",
                },
                {
                  title: "Orders",
                  desc: "View, track and manage all customer orders. Update status or delete orders.",
                  path: "/admin/dashboard/orders",
                  label: "Manage Orders",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-white border border-sky-100 rounded-2xl p-6 lg:p-8 shadow-sm shadow-sky-100/40"
                >
                  <div
                    className="px-4 py-3 rounded-xl mb-4 inline-block"
                    style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500">
                      Manage
                    </p>
                    <h2 className="text-sm font-bold text-[#0c2340]">
                      {card.title}
                    </h2>
                  </div>
                  <p className="text-sky-900/40 text-sm mb-6 font-light">
                    {card.desc}
                  </p>
                  <Link
                    to={card.path}
                    className="inline-block text-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                  >
                    {card.label}
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        <Outlet />
      </main>
    </div>
  </div>
);
}