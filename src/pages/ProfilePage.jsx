import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useLocation } from "react-router-dom";

const sections = [
  { id: "profile", label: "Profile Info", icon: "👤" },
  { id: "orders", label: "My Orders", icon: "📦" },
  { id: "wishlist", label: "Wishlist", icon: "❤️" },
  { id: "about", label: "About", icon: "ℹ️" },
  { id: "logout", label: "Logout", icon: "🚪" },
];

export default function ProfilePage() {
  const { user,setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    country: user?.address?.country || "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.section) {
      setActive(location.state.section);
    }
  }, [location.state]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSectionClick = (id) => {
    if (id === "logout") { handleLogout(); return; }
    if (id === "orders") { navigate("/orders"); return; }
    if (id === "wishlist") { navigate("/wishlist"); return; }
    setActive(id);
    setIsEditing(false);
    setSuccess("");
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (form.password && form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.pincode && !/^\d{4,10}$/.test(form.pincode))
      e.pincode = "Enter a valid pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      const updatedUser = {
        ...user,
        name: form.name,
        email: form.email,
        ...(form.password && { password: form.password }),
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
        },
      };
      await API.patch(`/users/${user.id}`, updatedUser);
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setForm({ ...form, password: "" });
    } catch (err) {
      setErrors({ general: "Failed to update profile. Try again." });
    }
  };

 return (
  <div className="min-h-screen bg-white py-8 px-4">
    <div className="max-w-5xl mx-auto">

      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Account
        </p>
        <h1 className="text-3xl font-extrabold text-[#0c2340] tracking-tight">
          My Account
        </h1>
        <p className="text-sm text-sky-900/40 mt-1 font-light">
          Manage your profile, addresses and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm shadow-sky-100/40">

            {/* Avatar */}
            <div
              className="px-4 py-5 flex flex-col items-center gap-2 border-b border-sky-100"
              style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className="font-bold text-[#0c2340] text-sm leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-sky-900/40 truncate max-w-[160px]">
                  {user?.email}
                </p>
                {user?.role === "admin" && (
                  <span className="mt-1.5 inline-block text-[10px] bg-sky-100 text-sky-600 px-2 py-0.5 font-semibold uppercase tracking-wide rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Nav */}
            <div className="py-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-widest transition text-left
                    ${section.id === "logout"
                      ? "text-red-400 hover:bg-red-50"
                      : active === section.id
                        ? "text-sky-500 border-r-2 border-sky-400 bg-sky-50"
                        : "text-sky-900/40 hover:bg-sky-50 hover:text-sky-500"
                    }`}
                >
                  <span className="text-sm">{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm shadow-sky-100/40">

            {active === "profile" && (
              <div>
                {/* Section Header */}
                <div
                  className="px-6 py-4 border-b border-sky-100 flex items-center justify-between"
                  style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
                >
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500 mb-0.5">
                      Profile
                    </p>
                    <h2 className="text-sm font-bold text-[#0c2340]">
                      Personal Information
                    </h2>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[10px] font-semibold text-sky-500 hover:text-sky-600 uppercase tracking-widest border border-sky-200 px-3 py-1.5 rounded-lg transition hover:bg-sky-50"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="px-6 py-5">
                  {success && (
                    <div className="mb-5 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm px-4 py-3">
                      ✅ {success}
                    </div>
                  )}
                  {errors.general && (
                    <div className="mb-5 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm px-4 py-3">
                      ❌ {errors.general}
                    </div>
                  )}

                  {/* View Mode */}
                  {!isEditing ? (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1 mb-6">
                        <ViewField label="Full Name"     value={user?.name} />
                        <ViewField label="Email Address" value={user?.email} />
                        <ViewField label="Password"      value="••••••••" />
                        <ViewField label="Role"          value={user?.role === "admin" ? "Administrator" : "Customer"} />
                        <ViewField label="User ID"       value={user?.id} />
                      </div>

                      <div className="border-t border-sky-100 pt-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-4">
                          📍 Saved Address
                        </p>
                        {user?.address?.street ? (
                          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                            <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-white px-2 py-0.5 rounded-full mb-3"
                              style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                            >
                              Home
                            </span>
                            <p className="text-sm text-sky-900/60 leading-relaxed">
                              {user.address.street}<br />
                              {[user.address.city, user.address.state, user.address.pincode]
                                .filter(Boolean).join(", ")}<br />
                              {user.address.country}
                            </p>
                          </div>
                        ) : (
                          <div className="border border-dashed border-sky-200 rounded-xl p-4 text-sm text-sky-900/40 text-center">
                            No address saved yet.{" "}
                            <button
                              onClick={() => setIsEditing(true)}
                              className="text-sky-500 font-semibold hover:underline"
                            >
                              Add Address
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  ) : (
                    /* Edit Mode */
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                        <MyntraField
                          label="Full Name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          error={errors.name}
                          placeholder="Your full name"
                        />
                        <MyntraField
                          label="Email Address"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          error={errors.email}
                          placeholder="Your email"
                          type="email"
                        />
                        <MyntraField
                          label="New Password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          error={errors.password}
                          placeholder="Leave blank to keep current"
                          type="password"
                        />
                      </div>

                      <div className="border-t border-sky-100 pt-5 mt-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-4">
                          📍 Address
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                          <div className="sm:col-span-2">
                            <MyntraField
                              label="Street"
                              value={form.street}
                              onChange={(e) => setForm({ ...form, street: e.target.value })}
                              placeholder="House no., Street name, Area"
                            />
                          </div>
                          <MyntraField
                            label="City"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            placeholder="City"
                          />
                          <MyntraField
                            label="State"
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value })}
                            placeholder="State"
                          />
                          <MyntraField
                            label="Pincode"
                            value={form.pincode}
                            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                            error={errors.pincode}
                            placeholder="Pincode"
                          />
                          <MyntraField
                            label="Country"
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            placeholder="Country"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6 pt-4 border-t border-sky-100">
                        <button
                          onClick={handleUpdate}
                          className="text-white px-8 py-2.5 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none cursor-pointer"
                          style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setErrors({});
                            setForm({
                              name: user?.name || "",
                              email: user?.email || "",
                              password: "",
                              street: user?.address?.street || "",
                              city: user?.address?.city || "",
                              state: user?.address?.state || "",
                              pincode: user?.address?.pincode || "",
                              country: user?.address?.country || "",
                            });
                          }}
                          className="border border-sky-100 text-sky-900/50 px-8 py-2.5 text-[11px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 hover:border-sky-200 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {active === "about" && (
              <div>
                <div
                  className="px-6 py-4 border-b border-sky-100"
                  style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500 mb-0.5">
                    Info
                  </p>
                  <h2 className="text-sm font-bold text-[#0c2340]">
                    About ShopHub
                  </h2>
                </div>
                <div className="px-6 py-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4 p-4 bg-sky-50 border border-sky-100 rounded-xl">
                    <span className="text-2xl">🛒</span>
                    <div>
                      <p className="font-bold text-[#0c2340] text-sm">ShopHub</p>
                      <p className="text-xs text-sky-900/40">
                        Your one-stop shop for everything you need.
                      </p>
                    </div>
                  </div>
                  <ViewField label="Version"    value="1.0.0" />
                  <ViewField label="Built with" value="React + Tailwind CSS" />
                  <ViewField label="Backend"    value="JSON Server" />
                  <ViewField label="Developer"  value="ShopHub Team" />
                  <div className="mt-2 p-4 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-900/40">
                    This is a demo e-commerce application built for learning purposes.
                    All transactions are simulated and no real payments are processed.
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  </div>
);
}

function ViewField({ label, value }) {
  return (
    <div className="py-3 border-b border-sky-100 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-[#0c2340]">{value}</p>
    </div>
  );
}

function MyntraField({ label, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col mb-6">
      <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border-0 border-b-2 bg-transparent px-0 py-2 text-sm text-[#0c2340] placeholder-sky-900/20 outline-none transition
          ${error ? "border-red-300 focus:border-red-400" : "border-sky-100 focus:border-sky-400"}`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}