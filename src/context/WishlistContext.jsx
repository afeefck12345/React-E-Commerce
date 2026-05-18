import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user?.loginAt]); 

  const fetchWishlist = async () => {
  setLoading(true);
  try {
    const res = await API.get(`/wishlist`); 
    setWishlistItems(res.data);
  } catch (err) {
    console.error("Failed to fetch wishlist", err);
  } finally {
    setLoading(false);
  }
};

  const addToWishlist = async (product) => {
    if (!user || !user.id) return false; 
    const existing = wishlistItems.find((item) => item.productId === product.id);
    if (existing) return false;

    const newItem = { productId: product.id };

    const res = await API.post("/wishlist", newItem);
    setWishlistItems(res.data);
    return true;
  };

  const removeFromWishlist = async (productId) => {
    const item = wishlistItems.find((i) => i.productId === productId);
    if (!item) return;
    await API.delete(`/wishlist/${item.productId}`);
    setWishlistItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const clearWishlist = async () => {
    try {
      await Promise.all(wishlistItems.map((item) => API.delete(`/wishlist/${item.productId}`)));
      setWishlistItems([]);
    } catch (err) {
      console.error("Failed to clear wishlist", err);
    }
  };

  const totalWishlistItems = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        clearWishlist,
        totalWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
