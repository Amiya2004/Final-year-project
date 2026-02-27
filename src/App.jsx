import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Components
import Loader from './components/common/Loader';

// User Pages
import UserLayout from './pages/user/UserLayout';
import Home from './pages/user/Home';
import Shop from './pages/user/Shop';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderSuccess from './pages/user/OrderSuccess';
import MyOrders from './pages/user/MyOrders';
import About from './pages/user/About';
import Contact from './pages/user/Contact';
import Wishlist from './pages/user/Wishlist';
import Login from './pages/user/Login';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import StockManagement from './pages/admin/StockManagement';

import ExpiryAlerts from './pages/admin/ExpiryAlerts';
import AdminSetup from './pages/admin/AdminSetup';
import Orders from './pages/admin/Orders';
import Settings from './pages/admin/Settings';

import './App.css';

// Protected Route for Admin
const AdminRoute = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <Loader message="Verifying credentials..." />;
  }

  if (!currentUser || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App Content with Loading
const AppContent = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading || authLoading) {
    return <Loader message="Welcome to Nellai Velmurugan Store..." />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-setup" element={<AdminSetup />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="stock" element={<StockManagement />} />

          <Route path="expiry" element={<ExpiryAlerts />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <WishlistProvider>
            <CartProvider>
              <LoadingProvider>
                <AppContent />
              </LoadingProvider>
            </CartProvider>
          </WishlistProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
