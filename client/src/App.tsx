import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LoadingProvider } from './context/LoadingContext';

// Lib
// import { addSampleProducts } from './lib/sampleData'; // Commented out since using MongoDB API

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalLoader from './components/GlobalLoader';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import CandleSubcategories from './pages/CandleSubcategories';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import UserLogin from './pages/UserLogin'; // Import UserLogin page
import UserRegister from './pages/UserRegister'; // Import UserRegister page
import UserDashboard from './pages/UserDashboard'; // Import UserDashboard component

// New Product Pages
import NewArrivals from './pages/NewArrivals';
import SaleProducts from './pages/SaleProducts';
import TrendingProducts from './pages/TrendingProducts';
import GiftProducts from './pages/GiftProducts';
// Import the new pages
import FeaturedProducts from './pages/FeaturedProducts';
import BestSellers from './pages/BestSellers';


// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminSettings from './admin/AdminSettings';
import ProtectedRoute from './admin/ProtectedRoute';

import './index.css';

const App: React.FC = () => {
  // Commented out sample data loading since we're now using MongoDB API
  // useEffect(() => {
  //   // Initialize sample products when app loads
  //   addSampleProducts();
  // }, []);

  return (
    <LoadingProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    {/* User Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/candles-subcategories" element={<CandleSubcategories />} />
                    <Route path="/new-arrivals" element={<NewArrivals />} />
                    <Route path="/sale" element={<SaleProducts />} />
                    <Route path="/trending" element={<TrendingProducts />} />
                    <Route path="/gifts" element={<GiftProducts />} />
                    <Route path="/featured" element={<FeaturedProducts />} />
                    <Route path="/bestsellers" element={<BestSellers />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/user/login" element={<UserLogin />} />
                    <Route path="/user/register" element={<UserRegister />} />
                    <Route path="/user/dashboard" element={<UserDashboard />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <ProtectedRoute>
                          <AdminProducts />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <ProtectedRoute>
                          <AdminOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <ProtectedRoute>
                          <AdminSettings />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;