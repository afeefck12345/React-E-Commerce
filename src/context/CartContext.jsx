import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/cart?userId=${Number(user.id)}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) return false;
    const existing = cartItems.find((item) => item.productId === product.id);
    if (existing) {
      const updated = { ...existing, quantity: existing.quantity + quantity };
      await API.patch(`/cart/${existing.id}`, { quantity: updated.quantity });
      setCartItems((prev) =>
        prev.map((item) => (item.id === existing.id ? updated : item))
      );
    } else {
      const newItem = {
        userId: Number(user.id),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity,
      };
      const res = await API.post("/cart", newItem);

      setCartItems((prev) => [...prev, res.data]);
    }
    return true;
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    await API.patch(`/cart/${cartItemId}`, { quantity: newQuantity });
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = async (cartItemId) => {
    await API.delete(`/cart/${cartItemId}`);
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = async () => {
    try {
      await Promise.all(cartItems.map((item) => API.delete(`/cart/${item.id}`)));
      setCartItems([]);
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const totalItems = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        totalPrice,
        totalItems,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);