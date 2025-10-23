import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { state } = useCart();
  const { state: wishlistState } = useWishlist();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        setAllProducts(res.data);
      } catch (error) {
        console.error('Error loading products for search:', error);
      }
    };
    loadProducts();
  }, []);

  // Filter products for search
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const filterProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/search?q=${searchQuery}`);
        setSearchResults(res.data);
        setShowSearchDropdown(res.data.length > 0);
      } catch (error) {
        console.error('Error loading products for search:', error);
      }
    };
    filterProduct();
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSearchDropdown(false);
      }
      if (showProfileDropdown) {
        const profileButton = document.querySelector('[data-profile-button]');
        const profileDropdown = document.querySelector('[data-profile-dropdown]');
        if (profileButton && profileDropdown &&
            !profileButton.contains(target) &&
            !profileDropdown.contains(target)) {
          setShowProfileDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchDropdown(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Miraj
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Candles</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(item.href)
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.map(product => (
                    <div key={product._id} onClick={() => handleProductClick(product._id)} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                      <img
                        src={product.images?.[0] || '/images/candles/candle-collection-1.png'}
                        alt={product.name || 'Product'}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                        onError={(e) => e.currentTarget.src = '/images/candles/candle-collection-1.png'}
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{product.name || 'Unknown Product'}</h4>
                        <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                        <p className="text-sm font-semibold text-orange-600">${product.price?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/wishlist" className="relative p-3 group rounded-xl hover:bg-red-50 transition-all duration-300 hover:shadow-lg">
              <svg className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  {wishlistState.items.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-3 group rounded-xl hover:bg-orange-50 transition-all duration-300 hover:shadow-lg">
              <ShoppingBagIcon className="w-6 h-6 text-gray-600 group-hover:text-orange-500 transition-colors duration-300" />
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  {state.items.length}
                </span>
              )}
            </Link>

            {/* Profile dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  data-profile-button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {currentUser.profilePicture ? (
                      <img src={currentUser.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">{currentUser.name || 'User'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      data-profile-dropdown
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {currentUser.profilePicture ? (
                              <img src={currentUser.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                            ) : <UserIcon className="h-6 w-6 text-gray-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{currentUser.name || 'User'}</p>
                            <p className="text-sm text-gray-600">{currentUser.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/user/dashboard"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                          My Dashboard
                        </Link>

                        <Link
                          to="/cart"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <ShoppingBagIcon className="h-5 w-5 mr-3 text-gray-400" />
                          My Cart ({state.items.length})
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          My Wishlist ({wishlistState.items.length})
                        </Link>

                        {currentUser.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <CogIcon className="h-5 w-5 mr-3 text-gray-400" />
                            Admin Dashboard
                          </Link>
                        )}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => { handleLogout(); setShowProfileDropdown(false); }}
                            className="flex items-center w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:shadow-lg group">
                <UserIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors duration-300" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search + Mobile Nav etc. ... */}
        {/* Keep your newer code for mobile nav + search + login modal */}
      </div>
    </nav>
  );
};

export default Navbar;







// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
// import {
//   ShoppingBagIcon,
//   UserIcon,
//   Bars3Icon,
//   XMarkIcon,
//   MagnifyingGlassIcon,
//   CogIcon
// } from '@heroicons/react/24/outline';
// import { useCart } from '../context/CartContext';
// import { useWishlist } from '../context/WishlistContext';
// import { useAuth } from '../context/AuthContext';
// import { Product } from '../types';
// import { MongoService } from '../services/mongoService';
// import toast from 'react-hot-toast';

// const Navbar: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<Product[]>([]);
//   const [showSearchDropdown, setShowSearchDropdown] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const [allProducts, setAllProducts] = useState<Product[]>([]);
//   const { state } = useCart();
//   const { state: wishlistState } = useWishlist();
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchRef = useRef<HTMLDivElement>(null);

//   // Load products from API on component mount
//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const products = await axios.get(`${import.meta.env.VITE_API_URL}/products`).then(res => res.data);
//         setAllProducts(products);
//       } catch (error) {
//         console.error('Error loading products for search:', error);
//       }
//     };
//     loadProducts();
//   }, []);

//   useEffect(() => {
//     const filterProduct = async () => {
//       try {
//         const products = await axios.get(`${import.meta.env.VITE_API_URL}/products/search?q=${searchQuery}`).then(res => res.data);
//         setSearchResults(products);
//         setShowSearchDropdown(products.length > 0);
//       }
//       catch(error) {
//         console.error('Error loading products for search:', error);
//       }
//     }
//     filterProduct();
//   }, [searchQuery, allProducts]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Element;

//       // Close search dropdown
//       if (searchRef.current && !searchRef.current.contains(target)) {
//         setShowSearchDropdown(false);
//       }

//       // Close profile dropdown
//       if (showProfileDropdown) {
//         const profileButton = document.querySelector('[data-profile-button]');
//         const profileDropdown = document.querySelector('[data-profile-dropdown]');

//         if (profileButton && profileDropdown &&
//           !profileButton.contains(target) &&
//           !profileDropdown.contains(target)) {
//           setShowProfileDropdown(false);
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showProfileDropdown]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       toast.success('Logged out successfully');
//       navigate('/');
//     } catch (error) {
//       toast.error('Failed to logout');
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery('');
//       setShowSearchDropdown(false);
//     }
//   };

//   const handleProductClick = (productId: string) => {
//     navigate(`/products/${productId}`);
//     setSearchQuery('');
//     setShowSearchDropdown(false);
//   };

//   const navigation = [
//     { name: 'Home', href: '/' },
//     { name: 'Products', href: '/products' },
//     { name: 'Contact', href: '/contact' },
//   ];

//   const isActive = (path: string) => {
//     if (path === '/' && location.pathname === '/') return true;
//     if (path !== '/' && location.pathname.startsWith(path)) return true;
//     return false;
//   };

//   return (
//     <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
//                 <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
//                 </svg>
//               </div>
//               <div className="hidden sm:block">
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
//                   Miraj
//                 </h1>
//                 <p className="text-xs text-gray-500 -mt-1">Candles</p>
//               </div>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-8">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(item.href)
//                     ? 'text-orange-600 bg-orange-50'
//                     : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
//                   }`}
//               >
//                 {item.name}
//                 {isActive(item.href) && (
//                   <motion.div
//                     layoutId="activeTab"
//                     className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"
//                     initial={false}
//                     transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                   />
//                 )}
//               </Link>
//             ))}
//           </div>

//           {/* Search Bar - Desktop */}
//           <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchRef}>
//             <form onSubmit={handleSearch} className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
//               />
//               <button
//                 type="submit"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
//               >
//                 <MagnifyingGlassIcon className="w-5 h-5" />
//               </button>

//               {/* Search Dropdown */}
//               {showSearchDropdown && searchResults.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
//                   {searchResults.map((product) => (
//                     <div
//                       key={product._id}
//                       onClick={() => handleProductClick(product._id)}
//                       className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                     >
//                       <img
//                         src={product.images[0] || '/images/candles/candle-collection-1.png'}
//                         alt={product.name || 'Product'}
//                         className="w-12 h-12 object-cover rounded-lg mr-3"
//                         onError={(e) => {
//                           e.currentTarget.src = '/images/candles/candle-collection-1.png';
//                         }}
//                       />
//                       <div className="flex-1">
//                         <h4 className="text-sm font-medium text-gray-900">{product.name || 'Unknown Product'}</h4>
//                         <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
//                         <p className="text-sm font-semibold text-orange-600">${product.price?.toFixed(2) || '0.00'}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </form>
//           </div>

//           {/* Right side - Desktop */}
//           <div className="hidden md:flex items-center space-x-2">
//             <Link to="/wishlist" className="relative p-3 group rounded-xl hover:bg-red-50 transition-all duration-300 hover:shadow-lg">
//               <svg
//                 className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors duration-300"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//               </svg>
//               {wishlistState.items.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
//                   {wishlistState.items.length}
//                 </span>
//               )}
//             </Link>

//             <Link to="/cart" className="relative p-3 group rounded-xl hover:bg-orange-50 transition-all duration-300 hover:shadow-lg">
//               <ShoppingBagIcon className="w-6 h-6 text-gray-600 group-hover:text-orange-500 transition-colors duration-300" />
//               {state.items.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
//                   {state.items.length}
//                 </span>
//               )}
//             </Link>

//             {currentUser ? (
//               <div className="relative">
//                 <button
//                   data-profile-button
//                   onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                   className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
//                 >
//                   <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
//                     {currentUser.profilePicture ? (
//                       <img
//                         src={currentUser.profilePicture}
//                         alt="Profile"
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <UserIcon className="h-4 w-4 text-gray-600" />
//                     )}
//                   </div>
//                   <span className="text-sm font-medium text-gray-700 hidden lg:block">
//                     {currentUser.name || 'User'}
//                   </span>
//                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>

//                 {/* Profile Dropdown */}
//                 <AnimatePresence>
//                   {showProfileDropdown && (
//                     <motion.div
//                       data-profile-dropdown
//                       initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                       animate={{ opacity: 1, scale: 1, y: 0 }}
//                       exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                       className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
//                     >
//                       <div className="p-4 border-b border-gray-100">
//                         <div className="flex items-center space-x-3">
//                           <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
//                             {currentUser.profilePicture ? (
//                               <img
//                                 src={currentUser.profilePicture}
//                                 alt="Profile"
//                                 className="h-full w-full object-cover"
//                               />
//                             ) : (
//                               <UserIcon className="h-6 w-6 text-gray-600" />
//                             )}
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">{currentUser.name || 'User'}</p>
//                             <p className="text-sm text-gray-600">{currentUser.email}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="p-2">
//                         <Link
//                           to="/user/dashboard"
//                           onClick={() => setShowProfileDropdown(false)}
//                           className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                         >
//                           <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
//                           My Dashboard
//                         </Link>

//                         <Link
//                           to="/cart"
//                           onClick={() => setShowProfileDropdown(false)}
//                           className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                         >
//                           <ShoppingBagIcon className="h-5 w-5 mr-3 text-gray-400" />
//                           My Cart ({state.items.length})
//                         </Link>

//                         <Link
//                           to="/wishlist"
//                           onClick={() => setShowProfileDropdown(false)}
//                           className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                         >
//                           <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                           </svg>
//                           My Wishlist ({wishlistState.items.length})
//                         </Link>

//                         {currentUser.role === 'admin' && (
//                           <Link
//                             to="/admin/dashboard"
//                             onClick={() => setShowProfileDropdown(false)}
//                             className="flex items-center w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                           >
//                             <CogIcon className="h-5 w-5 mr-3 text-gray-400" />
//                             Admin Dashboard
//                           </Link>
//                         )}

//                         <div className="border-t border-gray-100 mt-2 pt-2">
//                           <button
//                             onClick={() => {
//                               handleLogout();
//                               setShowProfileDropdown(false);
//                             }}
//                             className="flex items-center w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           >
//                             <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                             </svg>
//                             Logout
//                           </button>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//             ) : (
//               <button
//                 onClick={() => setShowLoginModal(true)}
//                 className="p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:shadow-lg group"
//               >
//                 <UserIcon className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors duration-300" />
//               </button>
//             )}
//           </div>


//           {/* Mobile menu button */}
//           <button
//             className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? (
//               <XMarkIcon className="w-6 h-6" />
//             ) : (
//               <Bars3Icon className="w-6 h-6" />
//             )}
//           </button>
//         </div><br/>


//         {/* Mobile Search Bar */}
//         <div className="md:hidden pb-4">
//           <form onSubmit={handleSearch} className="relative">
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
//             />
//             <button
//               type="submit"
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
//             >
//               <MagnifyingGlassIcon className="w-5 h-5" />
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-white border-t border-gray-100"
//           >
//             <div className="px-4 py-4 space-y-3">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${isActive(item.href)
//                       ? 'text-orange-600 bg-orange-50'
//                       : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
//                     }`}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               ))}

//               <Link
//                 to="/wishlist"
//                 className="flex items-center px-4 py-3 text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//                 Wishlist ({wishlistState.items.length})
//               </Link>

//               <Link
//                 to="/cart"
//                 className="flex items-center px-4 py-3 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <ShoppingBagIcon className="w-5 h-5 mr-3" />
//                 Cart ({state.items.length})
//               </Link>

//               {currentUser ? (
//                 <>
//                   {currentUser.role === 'admin' && (
//                     <Link
//                       to="/admin/dashboard"
//                       className="block px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       Admin Dashboard
//                     </Link>
//                   )}
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsOpen(false);
//                     }}
//                     className="block w-full text-left px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link
//                   to="/admin/login"
//                   className="block px-4 py-3 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Login Modal */}
//       <AnimatePresence>
//         {showLoginModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowLoginModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Miraj</h2>
//                 <p className="text-gray-600">Choose how you'd like to continue</p>
//               </div>

//               <div className="space-y-4">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     setShowLoginModal(false);
//                     navigate('/user/login');
//                   }}
//                   className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//                 >
//                   Login as Customer
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     setShowLoginModal(false);
//                     navigate('/user/register');
//                   }}
//                   className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//                 >
//                   Register as Customer
//                 </motion.button>

//                 <div className="relative my-6">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-gray-500">or</span>
//                   </div>
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => {
//                     setShowLoginModal(false);
//                     navigate('/admin/login');
//                   }}
//                   className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//                 >
//                   Admin Login
//                 </motion.button>
//               </div>

//               <button
//                 onClick={() => setShowLoginModal(false)}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//               >
//                 <XMarkIcon className="w-6 h-6" />
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;
