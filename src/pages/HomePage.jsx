
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Clothing", icon: "👗" },
  { name: "Shoes", icon: "👟" },
  { name: "Sports", icon: "⚽" },
  { name: "Books", icon: "📚" },
];

const featuredIds = ["p001", "p004", "p011", "p020"];

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const featuredProducts = featuredIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const getCategoryCount = (cat) =>
    products.filter((p) => p.category === cat).length;

  const heroImages = featuredProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Hero ── */}
      <section
        className="relative px-4 md:px-12 pt-12 pb-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #eefbff 0%, #e0f4ff 40%, #e8fff6 100%)" }}
      >
        {/* Blobs */}
        <div className="absolute top-[-60px] right-[160px] w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-50px] right-[60px] w-52 h-52 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.16) 0%, transparent 70%)" }} />
        <div className="absolute top-[20px] right-[20px] w-28 h-28 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

          {/* ── Left ── */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-400/30 text-sky-700 text-[10px] font-semibold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              New arrivals every week
            </div>

            <h1 className="text-3xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 max-w-xl text-[#0c2340]">
              Your one-stop<br />
              shop for{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
              >
                everything
              </span>
            </h1>

            <p className="text-sm font-light text-sky-900/50 max-w-sm leading-relaxed mb-8">
              Explore premium products across electronics, fashion, sports & more — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/products")}
                className=" w-full sm:w-auto text-white px-8 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all hover:-translate-y-px cursor-pointer border-none rounded-lg"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
              >
                Shop Now →
              </button>
              <button
                onClick={() => navigate("/register")}
                className=" w-full sm:w-auto bg-white/70 hover:bg-white text-sky-700 border border-sky-300/40 px-8 py-3 text-[11px] font-medium tracking-[0.1em] uppercase transition-all hover:-translate-y-px cursor-pointer rounded-lg"
              >
                Create Account
              </button>
            </div>
          </div>

          {/* ── Right — Marketing Image Cluster ── */}
          <div className="hidden md:block flex-shrink-0 relative w-72 h-64">

            {/* Decorative spinning arc */}
            <div
              className="absolute top-1 right-1 w-24 h-24 rounded-full border-2 border-dashed border-sky-200/50 pointer-events-none z-10"
              style={{ animation: "hp-spin 14s linear infinite" }}
            />

            {/* Dot grid */}
            <div
              className="absolute bottom-0 right-2 w-20 h-20 pointer-events-none z-10"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(14,165,233,0.25) 1.5px, transparent 1.5px)",
                backgroundSize: "10px 10px",
              }}
            />

            {/* Left image — rotated */}
           {/* Left image — rotated */}
      <div
        className="absolute top-14 left-0 w-28 h-36 rounded-2xl overflow-hidden border-[3px] border-white/90 z-20"
        style={{
          boxShadow: "0 16px 48px rgba(12,35,64,0.12), 0 4px 12px rgba(0,0,0,0.07)",
          background: "linear-gradient(145deg, #e8fff6, #dff4ff)",
          transform: "rotate(-6deg)",
          animation: "hp-float2 4s ease-in-out infinite",
        }}
      >
        {heroImages[0]?.image ? (
          <img src={heroImages[0].image} alt={heroImages[0].name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">💻</div>
        )}
      </div>

      {/* Center image — biggest, front */}
      <div
        className="absolute top-8 left-16 w-36 h-44 rounded-2xl overflow-hidden border-[3px] border-white/90 z-30"
        style={{
          boxShadow: "0 20px 56px rgba(12,35,64,0.15), 0 4px 16px rgba(0,0,0,0.08)",
          background: "linear-gradient(145deg, #dff4ff, #e8fff6)",
          animation: "hp-float1 3.5s ease-in-out infinite",
        }}
      >
        {heroImages[1]?.image ? (
          <img src={heroImages[1].image} alt={heroImages[1].name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">👟</div>
        )}
      </div>

      {/* Right image — rotated other way */}
            <div
              className="absolute top-16 right-0 w-28 h-36 rounded-2xl overflow-hidden border-[3px] border-white/90 z-20"
              style={{
                boxShadow: "0 16px 48px rgba(12,35,64,0.12), 0 4px 12px rgba(0,0,0,0.07)",
                background: "linear-gradient(145deg, #f0fbff, #e0fff4)",
                transform: "rotate(5deg)",
                animation: "hp-float3 4.5s ease-in-out infinite",
              }}
            >
              {heroImages[2]?.image ? (
                <img src={heroImages[2].image} alt={heroImages[2].name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">👗</div>
              )}
            </div>
            
          </div>
        </div>

        {/* Keyframes */}
        <style>{`
          @keyframes hp-float1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes hp-float2 {
            0%, 100% { transform: rotate(-6deg) translateY(0px); }
            50% { transform: rotate(-6deg) translateY(-6px); }
          }
          @keyframes hp-float3 {
            0%, 100% { transform: rotate(5deg) translateY(0px); }
            50% { transform: rotate(5deg) translateY(-5px); }
          }
          @keyframes hp-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </section>

      {/* ── Stats Strip ── */}
      <div className="flex border-b border-sky-100">
        {[
          { n: "200+", l: "Products" },
          { n: "5",    l: "Categories" },
          { n: "12k+", l: "Customers" },
          { n: "4.9★", l: "Avg Rating" },
        ].map((s, i, arr) => (
          <div
            key={s.l}
            className={`flex-1 py-4 px-5 text-center bg-white/60 ${i < arr.length - 1 ? "border-r border-sky-100" : ""}`}
          >
            <div
              className="text-base sm:text-xl font-extrabold bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
            >
              {s.n}
            </div>
            <div className="text-[10px] font-medium tracking-[0.14em] uppercase text-sky-900/40 mt-1">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-14">

        {/* ── Shop by Category ── */}
        <section>
          <div className="flex justify-between items-end mb-5">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">Browse</p>
              <h2 className="text-2xl font-bold text-[#0c2340] leading-none">Shop by Category</h2>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="text-[10px] font-semibold tracking-[0.16em] uppercase text-sky-500 hover:text-emerald-500 transition-colors cursor-pointer bg-transparent border-none"
            >
              View all →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate(`/products?category=${cat.name}`)}
                className="bg-gradient-to-br from-sky-50/60 to-emerald-50/60 hover:from-sky-100/80 hover:to-emerald-100/80 border border-sky-200/30 hover:border-sky-300/60 rounded-xl px-3 py-5 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-100 group"
              >
                <div className="text-2xl mb-2.5">{cat.icon}</div>
                <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#0c2340]">
                  {cat.name}
                </div>
                <div className="text-[10px] text-sky-400 mt-1 font-light">
                  {getCategoryCount(cat.name)} items
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div
          className="my-11 h-px"
          style={{ background: "linear-gradient(90deg, rgba(14,165,233,0.2), rgba(16,185,129,0.2), transparent)" }}
        />

        {/* ── Featured Products ── */}
        <section>
          <div className="flex justify-between items-end mb-5">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">Handpicked</p>
              <h2 className="text-2xl font-bold text-[#0c2340] leading-none">Featured Products</h2>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="text-[10px] font-semibold tracking-[0.16em] uppercase text-sky-500 hover:text-emerald-500 transition-colors cursor-pointer bg-transparent border-none"
            >
              View all →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-gradient-to-br from-sky-50/40 to-emerald-50/40 hover:from-sky-50/80 hover:to-emerald-50/80 border border-sky-200/20 hover:border-sky-300/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100/60 group"
              >
                <div
                  className="h-36 border-b border-sky-100/50 overflow-hidden relative flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.06), rgba(16,185,129,0.08))" }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-4xl">🛍️</span>
                  )}
                  <span
                    className="absolute top-2.5 left-2.5 text-white text-[8px] font-bold tracking-[0.12em] uppercase px-2 py-1 rounded"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                  >
                    Featured
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-sky-500">
                    {product.category}
                  </p>
                  <p className="text-[13px] font-semibold text-[#0c2340] mt-1.5 mb-2.5 leading-snug">
                    {product.name}
                  </p>
                  <div className="flex justify-between items-center pt-2.5 border-t border-sky-100/50">
                    <span
                      className="text-[17px] font-extrabold bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                    >
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-sky-300 font-light">
                      {product.stock} left
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── CTA Strip ── */}
      <div
        className="relative px-4 md:px-12 py-10 flex items-center justify-between flex-wrap gap-5 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #eefbff 0%, #e0f4ff 50%, #e8fff6 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 10% 50%, rgba(56,189,248,0.1) 0%, transparent 60%)" }}
        />
        <p className="text-xl font-bold text-[#0c2340] relative z-10">
          Ready to explore?{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
          >
            Thousands of products await.
          </span>
        </p>
        <button
          onClick={() => navigate("/products")}
          className="relative z-10 w-full sm:w-auto text-center text-white px-8 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase transition-all hover:-translate-y-px cursor-pointer border-none rounded-lg"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
        >
          View All Products →
        </button>
      </div>

    </div>
  );
}