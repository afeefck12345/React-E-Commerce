
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
  }, [user?.loginAt]); 


const fetchCart = async () => {
  setLoading(true);
  try {
    const res = await API.get(`/cart`); 
    const userCart = res.data.filter(item => item.userId === user.id);
    console.log(userCart)
    setCartItems(userCart);
  } catch (err) {
    console.error("Failed to fetch cart", err);
  } finally {
    setLoading(false);
  }
};

  const addToCart = async (product, quantity = 1) => {
    if (!user || !user.id) return false; 

    const existing = cartItems.find((item) => item.productId === product.id);
    if (existing) {
      const newQty = existing.quantity + quantity;

      if (newQty > product.stock) {
        return "out_of_stock";
      }
      const updated = { ...existing, quantity: newQty };
      await API.patch(`/cart/${existing.id}`, { quantity: updated.quantity });
      setCartItems((prev) =>
        prev.map((item) => (item.id === existing.id ? updated : item))
      );
    } else {
      const newItem = {
        userId: user.id, 
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity,
      };
      const res = await API.post("/cart", newItem);
      setCartItems((prev) => [...prev, res.data]);
    }
    return true;
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cartItems.find((i) => i.id === cartItemId);
    if (item && newQuantity > item.stock) return;
    await API.patch(`/cart/${cartItemId}`, { quantity: newQuantity });
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === cartItemId ? { ...i, quantity: newQuantity } : i
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
    (sum, item) => sum + item.price * item.quantity,
    0
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