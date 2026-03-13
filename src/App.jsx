import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProductsPage from "./pages/ProductsPage";
import { ThemeProvider } from "./context/ThemeContext";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import WishlistPage from "./pages/WishlistPage";
import HomePage from "./pages/HomePage"


function AdminDashboard() {
  return <div className="p-6 text-2xl font-bold">Admin Dashboard 🛠️</div>;
}

export default function App() {
   return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>        {/* 👈 add this */}
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={    
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </BrowserRouter>
            </WishlistProvider>        
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
