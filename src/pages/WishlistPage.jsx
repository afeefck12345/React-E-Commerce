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
    };
    await addToCart(product, 1);
    showToast(`${item.name} added to cart!`, "success");
  };

  const handleRemove = async (productId, name) => {
    await removeFromWishlist(productId);
    showToast(`${name} removed from wishlist!`, "error");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 px-4 py-10">
      <div className="max-w-5xl mx-auto">

      
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        
        {loading && (
          <div className="text-center text-gray-400 text-sm mt-20">
            Loading wishlist...
          </div>
        )}


        {!loading && wishlistItems.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-24 gap-4">
            <span className="text-6xl">🤍</span>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Your wishlist is empty
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Save products you love and come back to them later
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer"
            >
              Browse Products →
            </button>
          </div>
        )}

       
        {!loading && wishlistItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col group"
                >
                
                  <div
                    onClick={() => navigate(`/product/${item.productId}`)}
                    className="h-48 overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

               
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-md font-medium w-fit">
                      {item.category}
                    </span>
                    <p
                      onClick={() => navigate(`/product/${item.productId}`)}
                      className="font-medium text-gray-800 dark:text-white mt-2 text-sm leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      {item.name}
                    </p>
                    <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="flex gap-2 mt-auto pt-3">
                    
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-medium transition cursor-pointer"
                      >
                        Add to Cart
                      </button>
                      
                      <button
                        onClick={() => handleRemove(item.productId, item.name)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900 text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition cursor-pointer"
                      >
                        🗑
                      </button>
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
                Continue Shopping →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}