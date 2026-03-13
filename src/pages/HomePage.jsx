import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
const categories = [
  { name: "Electronics", icon: "💻", color: "bg-blue-50 text-blue-600" },
  { name: "Clothing", icon: "👗", color: "bg-pink-50 text-pink-600" },
  { name: "Shoes", icon: "👟", color: "bg-amber-50 text-amber-600" },
  { name: "Sports", icon: "⚽", color: "bg-green-50 text-green-600" },
  { name: "Books", icon: "📚", color: "bg-purple-50 text-purple-600" },
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

  
  const featuredProducts = featuredIds.map((id) =>
    products.find((p) => p.id === id)
  ).filter(Boolean); 

  const getCategoryCount = (cat) =>
    products.filter((p) => p.category === cat).length;



  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

     
     <section className="rounded-2xl px-8 py-16 text-center mb-12 border border-gray-100 dark:border-gray-800 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <span className="inline-block text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-3 py-1 rounded-full mb-4">
          ✦ New arrivals every week
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
          Your one-stop shop for{" "}
          <span className="bg-linear-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            everything
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-lg mx-auto">
          Explore premium products across electronics, fashion, sports & more — all in one place.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => navigate("/products")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition cursor-pointer"
          >
            Shop Now →
          </button>
          <button
            onClick={() => navigate("/register")}
            className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-6 py-2.5 rounded-xl font-medium hover:bg-white/60 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </section>

      
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Shop by Category</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition cursor-pointer"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/products?category=${cat.name}`)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition group"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className="font-medium text-gray-800 dark:text-white text-sm">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-1">{getCategoryCount(cat.name)} items</div>
            </div>
          ))}
        </div>
      </section>

     
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Featured Products</h2>
          <button
            onClick={() => navigate("/products")}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition cursor-pointer"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition group"
            >
              <div className="h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <span className="text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-md font-medium">
                  {product.category}
                </span>
                <p className="font-medium text-gray-800 dark:text-white mt-2 text-sm leading-snug">
                  {product.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {product.stock} left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/products")}
            className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-10 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            View All Products →
          </button>
        </div>
      </section>

    </div>
  );
}