import { useState, useEffect } from "react";
import API from "../../services/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "",image: "", stock: "", description: "" });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(()=>{
    setCurrentPage(1)
  },[search,categoryFilter])

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditProduct(null);
    setForm({ name: "", category: "", price: "", image: "", stock: "", description: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      image: product.image || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;
    
    if(!editProduct){
      const duplicate=products.some((p)=>p.name.toLowerCase()===form.name.toLocaleLowerCase())
      if(duplicate){
       alert(`"${form.name}" already exists!`)
        return
      }
    }

    try {
      if (editProduct) {
        const res = await API.put(`/products/${editProduct.id}`, form);
        setProducts(products.map((p) => (p.id === res.data.id ? res.data : p)));
      } else {
        const res = await API.post("/products", form);
        setProducts([...products, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  const handleDelete = async () => {
    try{
      const res=await API.put(`/products/${deleteProduct.id}`,{
        ...deleteProduct,
        active:false
      });
      setProducts(products.map((p)=>(p.id===res.data.id?res.data:p)))
      setDeleteProduct(null)

    }catch(err){
      console.error("failed to soft delete product",err)
    }
  };

 const filtered = products.filter((p) => {
  if (p.active === false) return false;
  const matchSearch =
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase());
  const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
  return matchSearch && matchCategory;
});

 const totalPages =Math.ceil(filtered.length/itemsPerPage);
 const paginated=filtered.slice(
  (currentPage-1)* itemsPerPage,currentPage * itemsPerPage
 )

 return (
  <div className="mt-10">

    
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Admin
        </p>
        <h2 className="text-3xl font-extrabold text-[#0c2340] tracking-tight">
          Products
        </h2>
      </div>
      <button
        onClick={handleOpenAdd}
        className="text-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none cursor-pointer"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
      >
        <span className="hidden sm:inline">+ Add Product</span>
        <span className="sm:hidden">+ Add</span>
      </button>
    </div>

    
    <input
      type="text"
      placeholder="Search by name or category..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full mb-6 border border-sky-100 bg-white text-sm text-[#0c2340] px-4 py-2.5 rounded-xl outline-none focus:border-sky-400 transition placeholder-sky-900/20"
    />

    
    <div className="flex gap-2 mb-6 flex-wrap">
      {["All", "Electronics", "Clothing", "Sports", "Shoes", "Books"].map((cat) => (
        <button
          key={cat}
          onClick={() => setCategoryFilter(cat)}
          className={`px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl border transition cursor-pointer ${
            categoryFilter === cat
              ? "text-white border-none"
              : "border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500"
          }`}
          style={categoryFilter === cat ? { background: "linear-gradient(135deg, #0ea5e9, #10b981)" } : {}}
        >
          {cat}
        </button>
      ))}
    </div>

    
    {loading ? (
      <div className="flex flex-col items-center justify-center mt-24 gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-900/40">
          Loading products...
        </p>
      </div>
    ) : (
      <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm shadow-sky-100/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr
              className="border-b border-sky-100"
              style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
            >
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Name</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Category</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Price</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Image</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Stock</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-sky-900/40 text-sm">
                  No products found.
                </td>
              </tr>
            ) : (
              paginated.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-sky-100 hover:bg-sky-50/50 transition"
                >
                  <td className="px-5 py-3 font-bold text-[#0c2340]">{product.name}</td>
                  <td className="px-5 py-3 text-sky-900/50">{product.category}</td>
                  <td className="px-5 py-3 font-semibold text-[#0c2340]">₹{product.price}</td>
                  <td className="px-5 py-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-sky-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg border border-sky-100 bg-sky-50 flex items-center justify-center text-lg">
                      📦
                    </div>
                  )}
                </td>
                  <td className="px-5 py-3 text-sky-900/50">{product.stock}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="border border-sky-100 text-sky-900/40 hover:border-sky-300 hover:text-sky-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteProduct(product)}
                        className="border border-red-100 text-red-400 hover:bg-red-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        
      </div>
           
    )}

     {totalPages > 1 && (
  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-1 gap-3">
    <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-900/40">
      Page {currentPage} of {totalPages} · {filtered.length} products
    </p>
    <div className="flex gap-2">
      <button
        onClick={() => setCurrentPage((p) => p - 1)}
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
  </div>
)}


   
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
        <div className="bg-white border border-sky-100 rounded-2xl shadow-xl shadow-sky-100/50 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">

          
          <div
            className="flex items-center justify-between mb-6 pb-4 border-b border-sky-100 -mx-8 -mt-8 px-8 pt-6 rounded-t-2xl"
            style={{ background: "linear-gradient(135deg, #eefbff, #e8fff6)" }}
          >
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-500 mb-0.5">
                {editProduct ? "Editing" : "New"}
              </p>
              <h3 className="text-lg font-extrabold text-[#0c2340] tracking-tight">
                {editProduct ? "Edit Product" : "Add Product"}
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1 block">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-sky-100 bg-transparent text-sm text-[#0c2340] px-3 py-2.5 rounded-xl outline-none focus:border-sky-400 transition placeholder-sky-900/20"
              />
            </div>

            
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-sky-100 bg-white text-sm text-[#0c2340] px-3 py-2.5 rounded-xl outline-none focus:border-sky-400 transition cursor-pointer"
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Shoes">Shoes</option>
                <option value="Books">Books</option>
              </select>
            </div>

            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1 block">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-sky-100 bg-transparent text-sm text-[#0c2340] px-3 py-2.5 rounded-xl outline-none focus:border-sky-400 transition"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1 block">
                  Stock
                </label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-sky-100 bg-transparent text-sm text-[#0c2340] px-3 py-2.5 rounded-xl outline-none focus:border-sky-400 transition"
                />
              </div>
            </div>

            
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1 block">
                Image URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border border-sky-100 bg-transparent text-sm text-[#0c2340] px-3 py-2.5 rounded-xl outline-none focus:border-sky-400 transition placeholder-sky-900/20"
              />
              {form.image && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={form.image}
                    alt="Preview"
                    onError={(e) => { e.target.style.display = "none"; }}
                    className="w-14 h-14 object-cover rounded-xl border border-sky-100"
                  />
                  <span className="text-[10px] text-sky-900/40 uppercase tracking-widest font-semibold">Preview</span>
                </div>
              )}
            </div>

            
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900/40 mb-1 block">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-sky-100 bg-transparent text-sm text-[#0c2340] px-3 py-2.5 rounded-xl outline-none focus:border-sky-400 transition resize-none placeholder-sky-900/20"
              />
            </div>
          </div>

          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 border border-sky-100 text-sky-900/50 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 hover:border-sky-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 text-white py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
            >
              {editProduct ? "Update" : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    )}

    
    {deleteProduct && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
        <div className="bg-white border border-sky-100 rounded-2xl shadow-xl shadow-sky-100/50 p-8 w-full max-w-sm text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.12))" }}
          >
            🗑
          </div>
          <h3 className="text-lg font-extrabold text-[#0c2340] tracking-tight mb-2">
            Deactivate Produc
          </h3>
          <p className="text-sky-900/40 text-sm mb-6 font-light">
            Are you sure you want to deactivate{" "}
            <span className="text-[#0c2340] font-semibold">{deleteProduct.name}</span>?
               It will be hidden from the store.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteProduct(null)}
              className="flex-1 border border-sky-100 text-sky-900/50 py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 text-[10px] font-semibold uppercase tracking-widest rounded-xl transition border-none cursor-pointer"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
);
}