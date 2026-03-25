import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = async (item) => {
    const product = {
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: item.stock,
    };
   const result = await addToCart(product, 1);
      if (result === "out_of_stock") {
        showToast("Not enough stock available!", "error");
        return;
      }
      showToast(`${item.name} added to cart!`, "success");
  };

  const handleRemove = async (productId, name) => {
    await removeFromWishlist(productId);
    showToast(`${name} removed from wishlist!`, "error");
  };

 return (
  <div className="min-h-screen bg-white px-4 py-8">
    <div className="max-w-5xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-sky-500 mb-1">
          Saved
        </p>
        <h1 className="text-3xl font-extrabold text-[#0c2340] tracking-tight">
          My Wishlist
        </h1>
        <p className="text-sm text-sky-900/40 mt-1 font-light">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-24 gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-900/40">
            Loading wishlist...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && wishlistItems.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{
              background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(16,185,129,0.1))",
            }}
          >
            🤍
          </div>
          <div className="text-center">
            <p className="text-[#0c2340] font-extrabold text-lg tracking-tight">
              Your wishlist is empty
            </p>
            <p className="text-sky-900/40 text-sm mt-1 font-light">
              Save products you love and come back to them later
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="text-white px-8 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none cursor-pointer mt-2"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
          >
            Browse Products →
          </button>
        </div>
      )}

      {/* Wishlist Grid */}
      {!loading && wishlistItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-sky-100 rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-sky-100/50 hover:border-sky-200 transition-all duration-200"
              >
                {/* Image */}
                <div
                  onClick={() => navigate(`/product/${item.productId}`)}
                  className="h-48 overflow-hidden bg-sky-50 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-500">
                    {item.category}
                  </span>
                  <p
                    onClick={() => navigate(`/product/${item.productId}`)}
                    className="font-semibold text-[#0c2340] mt-1.5 text-sm leading-snug cursor-pointer hover:text-sky-500 transition"
                  >
                    {item.name}
                  </p>
                  <p className="text-base font-extrabold text-[#0c2340] mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 text-white py-2 text-[10px] font-semibold uppercase tracking-widest rounded-xl transition hover:-translate-y-px border-none cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #0ea5e9, #10b981)" }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId, item.name)}
                      className="w-9 h-9 flex items-center justify-center border border-red-100 text-red-400 rounded-xl hover:bg-red-50 transition cursor-pointer"
                    >
                      <span style={{ fontSize: "14px" }}>🗑</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/products")}
              className="border border-sky-100 text-sky-900/50 px-10 py-2.5 text-[11px] font-semibold uppercase tracking-widest rounded-xl hover:bg-sky-50 hover:border-sky-200 transition cursor-pointer"
            >
              Continue Shopping →
            </button>
          </div>
        </>
      )}

    </div>
  </div>
);
}