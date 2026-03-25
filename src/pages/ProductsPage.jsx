import { useState, useEffect } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [currentPage,setCurrentPage]=useState(1)
  const itemsPerPage=10

  const categories = ["All", "Electronics", "Clothing", "Sports","Shoes", "Books"];

  useEffect(()=>{
    setCurrentPage(1)
  },[search,category,sort])

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);


  useEffect(() => {
  const cat = searchParams.get("category");
  if (cat) setCategory(cat);
}, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || p.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      return 0;
    });


  const uniqueProducts = filteredProducts.filter(
    (p, index, self) => index === self.findIndex((t) => t.id === p.id)
  );

  const totalPages=Math.ceil(filteredProducts.length/itemsPerPage)
  const panginated=filteredProducts.slice(
    (currentPage-1)* itemsPerPage,
    currentPage* itemsPerPage
  )
return (
  <div className="min-h-screen bg-white px-3 sm:px-4 py-6 sm:py-8">
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Collection
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-tight">
          {category === "All" ? "All Products" : category}
        </h1>
        <p className="text-sm text-sky-900/40 mt-1 font-light">
          Discover our curated collection
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-sky-100 bg-white text-[#0c2340] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-sky-400 transition placeholder-sky-900/25"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-sky-100 bg-white text-sky-900/60 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-sky-400 w-full sm:w-48 cursor-pointer"
        >
          <option value="default">Sort: Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest rounded-full border transition cursor-pointer ${
              category === cat
                ? "text-white border-transparent"
                : "bg-white text-sky-900/50 border-sky-200/60 hover:border-sky-400 hover:text-sky-600"
            }`}
            style={category === cat
              ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)", border: "none" }
              : {}
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product count */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-900/35 mb-5">
        {uniqueProducts.length} products found
      </p>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-24 gap-3">
          <div
            className="w-10 h-10 rounded-full animate-spin"
            style={{
              border: "3px solid rgba(14,165,233,0.15)",
              borderTop: "3px solid #0ea5e9",
            }}
          />
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sky-900/35">
            Loading products...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && uniqueProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 gap-3">
          <span className="text-4xl">🔍</span>
          <p className="text-[11px] font-bold uppercase tracking-widest text-sky-900/35">
            No products found
          </p>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {panginated.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
    <button
      onClick={() => setCurrentPage((p) => p - 1) }
      disabled={currentPage === 1}
      
      className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    >
      ← Prev
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border transition cursor-pointer ${
          currentPage === page
            ? "text-white border-none"
            : "border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500"
        }`}
        style={currentPage === page ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)" } : {}}
      >
        {page}
      </button>
    ))}
    <button
      onClick={() => setCurrentPage((p) => p + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    >
      Next →
    </button>
  </div>
)}

    </div>
  </div>
);
}