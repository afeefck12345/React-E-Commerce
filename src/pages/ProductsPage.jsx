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

  const categories = ["All", "Electronics", "Clothing", "Sports","Shoes", "Books"];


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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 px-4 py-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {category === "All" ? "All Products" : category}
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Discover our curated collection
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-white/70 dark:border-gray-700 bg-white/70 dark:bg-gray-900 backdrop-blur-sm text-gray-800 dark:text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-white/70 dark:border-gray-700 bg-white/70 dark:bg-gray-900 backdrop-blur-sm text-gray-700 dark:text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none w-full sm:w-48 cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap mb-6 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition cursor-pointer ${
                category === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white/70 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:text-indigo-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 text-center">
          {uniqueProducts.length} products found
        </p>

        {loading && (
          <div className="flex items-center justify-center mt-24 text-gray-400 text-sm">
            Loading products...
          </div>
        )}

        {!loading && uniqueProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24 text-gray-400">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-sm">No products found</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {uniqueProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}
