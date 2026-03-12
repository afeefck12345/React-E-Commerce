import { useState, useEffect } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Electronics", "Clothing", "Sports","Shoes", "Books"];

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">🛒 {category==="All"?"All Products":category}</h1>

  
      <div className="flex flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-3 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="default">Sort: Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

    
      <p className="text-gray-500 dark:text-gray-300 mb-4">{uniqueProducts.length} products found</p>

   
      {loading && (
        <div className="text-center text-gray-400 text-lg mt-20">Loading products...</div>
      )}

    
      {!loading && uniqueProducts.length === 0 && (
        <div className="text-center text-gray-400 text-lg mt-20">
          No products found 😔
        </div>
      )}

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}