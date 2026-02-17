import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';

// Components
import Loader from './components/common/Loader';

// User Pages
import UserLayout from './pages/user/UserLayout';
import Home from './pages/user/Home';
import Shop from './pages/user/Shop';
import Cart from './pages/user/Cart';
import Login from './pages/user/Login';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import StockManagement from './pages/admin/StockManagement';
import BrandAnalysis from './pages/admin/BrandAnalysis';
import ExpiryAlerts from './pages/admin/ExpiryAlerts';
import AdminSetup from './pages/admin/AdminSetup';
import Orders from './pages/admin/Orders';

import './App.css';

// Protected Route for Admin
const AdminRoute = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <Loader message="Checking credentials..." />;
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
    return <Loader message="Loading FreshMart..." />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<div className="coming-soon"><h1>About Us</h1><p>Coming Soon</p></div>} />
          <Route path="contact" element={<div className="coming-soon"><h1>Contact Us</h1><p>Coming Soon</p></div>} />
          <Route path="orders" element={<div className="coming-soon"><h1>My Orders</h1><p>Coming Soon</p></div>} />
          <Route path="wishlist" element={<div className="coming-soon"><h1>Wishlist</h1><p>Coming Soon</p></div>} />
          <Route path="checkout" element={<div className="coming-soon"><h1>Checkout</h1><p>Coming Soon</p></div>} />
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
          <Route path="brands" element={<BrandAnalysis />} />
          <Route path="expiry" element={<ExpiryAlerts />} />
          <Route path="settings" element={<div className="coming-soon admin-coming"><h1>Settings</h1><p>Coming Soon</p></div>} />
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
        <CartProvider>
          <LoadingProvider>
            <AppContent />
          </LoadingProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
