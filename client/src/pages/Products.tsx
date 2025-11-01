import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      if (subcategory !== 'all') params.subcategory = subcategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { params, withCredentials: true });
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, subcategory, minPrice, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            {category === 'all' ? 'All Products' : category}
          </h1>

          <div className="flex gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              <FunnelIcon className="w-5 h-5 mr-2" /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow mb-6 grid md:grid-cols-4 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="Candles">Candles</option>
              <option value="Kids Stationery">Kids Stationery</option>
              <option value="Religious Products">Religious Products</option>
              <option value="Gifts">Gifts</option>
            </select>

            {category === 'Candles' && <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="Scented Candles">Scented Candles</option>
              <option value="Soy Wax">Soy Wax</option>
              <option value="Decor Candles">Decor Candles</option>
              <option value="Aromatherapy">Aromatherapy</option>
              <option value="Luxury Collection">Luxury Collection</option>
              <option value="Gift Sets">Gift Sets</option>
            </select>}

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border p-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border p-2 rounded-lg"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-gray-500 py-20">Loading products...</div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 text-gray-600">No products found</div>
        )}
      </div>
    </div>
  );
};

export default Products;






// import React, { useState, useEffect, useMemo } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FunnelIcon, MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
// import { Product } from '../types';
// import ProductCard from '../components/ProductCard';
// import BagLoader from '../components/BagLoader';
// import { MongoService } from '../services/mongoService';
// import axios from 'axios';

// const Products: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [priceRange, setPriceRange] = useState([0, 1000]);
//   const [pendingPriceRange, setPendingPriceRange] = useState([0, 1000]);
//   const [sortBy, setSortBy] = useState('newest');
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchParams, setSearchParams] = useSearchParams();

//   // Corrected categories array (fix typo)
//   const categories = [
//     {
//       name: 'Kids Stationery',
//       urlName: 'kids-stationery',
//       color: 'bg-gradient-to-br from-pink-400 to-pink-600',
//       description: 'Fun and colorful stationery for kids',
//       icon: (
//         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
//           <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
//         </svg>
//       ),
//       count: 0,
//     },
//     {
//       name: 'Religious Products',
//       urlName: 'religious-products',
//       color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
//       description: 'Sacred items for spiritual practices',
//       icon: (
//         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
//           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
//         </svg>
//       ),
//       count: 0,
//     },
//     {
//       name: 'Gifts',
//       urlName: 'gifts',
//       color: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
//       description: 'Special gifts for every occasion',
//       icon: (
//         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
//           <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
//         </svg>
//       ),
//       count: 0,
//     },
//   ];

//   // Update categories with product counts
//   const categoriesWithCounts = useMemo(() => {
//     return categories.map((category) => ({
//       ...category,
//       count: products.filter((product) =>
//         product.category?.toLowerCase().trim() === category.name.toLowerCase().trim()
//       ).length,
//     }));
//   }, [products]);

//   // Extract URL params using useMemo
//   const urlCategory = useMemo(() => searchParams.get('category'), [searchParams]);
//   const urlSearch = useMemo(() => searchParams.get('search'), [searchParams]);

//   // Sync URL params with state
//   useEffect(() => {
//     if (urlCategory && urlCategory !== 'all') {
//       setSelectedCategory(urlCategory);
//     } else {
//       setSelectedCategory('all');
//     }

//     if (urlSearch) {
//       setSearchTerm(urlSearch);
//     } else {
//       setSearchTerm('');
//     }
//   }, [urlCategory, urlSearch]);

//   // Load products
//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         setIsLoading(true);
//         const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
//         const apiProducts = res.data;
//         setProducts(apiProducts || []);
//         console.log('Products loaded:', apiProducts);
//       } catch (error) {
//         console.error('Error loading products:', error);
//         setProducts([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadProducts();
//   }, []);

//   // Filter and sort products
//   const filteredAndSortedProducts = useMemo(() => {
//     let filtered = [...products];

//     // Search filter
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (product) =>
//           (product.name || product.title || '').toLowerCase().includes(term) ||
//           product.description.toLowerCase().includes(term)
//       );
//     }

//     // Category filter
//     if (selectedCategory !== 'all') {
//       const categoryMappings: { [key: string]: string[] } = {
//         'kids-stationery': ['Kids Stationery'],
//         'religious-products': ['Religious Products', 'Religious Items'],
//         gifts: ['Gifts'],
//         candles: ['Scented Candles', 'Soy Wax', 'Decor Candles', 'Aromatherapy', 'Gift Sets'],
//         'scented-candles': ['Scented Candles'],
//         'soy-wax': ['Soy Wax'],
//         'decor-candles': ['Decor Candles'],
//         'aromatherapy': ['Aromatherapy'],
//         'gift-sets': ['Gift Sets']
//       };

//       const matchingCategories = categoryMappings[selectedCategory] || [selectedCategory];

//       filtered = filtered.filter((product) =>
//         matchingCategories.some(
//           (category) =>
//             product.category?.toLowerCase().trim() === category.toLowerCase().trim() ||
//             product.category?.toLowerCase().includes(category.toLowerCase().trim())
//         )
//       );
//     }

//     // Price filter
//     const [minPrice, maxPrice] = priceRange;
//     filtered = filtered.filter(
//       (product) => product.price >= minPrice && product.price <= maxPrice
//     );

//     // Sorting
//     switch (sortBy) {
//       case 'price-low':
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-high':
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       case 'name':
//         filtered.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''));
//         break;
//       case 'newest':
//       default:
//         filtered.sort(
//           (a, b) =>
//             new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
//         );
//         break;
//     }
//     return filtered;
//   }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

//   const handleCategorySelect = (categoryName: string) => {
//     setSelectedCategory(categoryName.toLowerCase());
//     setSearchParams({ category: categoryName.toLowerCase() });
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('all');
//     setPriceRange([0, 1000]);
//     setPendingPriceRange([0, 1000]);
//     setSortBy('newest');
//     setSearchParams({});
//   };

//   const applyPriceFilter = () => {
//     setPriceRange(pendingPriceRange);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <BagLoader size="large" text="Loading products..." />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//               {selectedCategory !== 'all'
//                 ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
//                 : 'All Products'}
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               {searchTerm
//                 ? `Search results for "${searchTerm}"`
//                 : 'Discover our complete collection of premium products'}
//             </p>
//           </motion.div>
//         </div>

//         {/* Search & Filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               />
//             </div>
//             {/* Sort */}
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//             >
//               <option value="newest">Newest First</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="name">Name: A to Z</option>
//             </select>
//             {/* Filters toggle */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//             >
//               <FunnelIcon className="w-5 h-5 mr-2" /> Filters
//             </button>
//           </div>

//           {/* Filters Panel */}
//           {showFilters && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mt-6 pt-6 border-t border-gray-200"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Category Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   >
//                     <option value="all">All Categories</option>
//                     <option value="candles">Candles</option>
//                     {categories.map((category) => (
//                       <option key={category.name} value={category.urlName}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 {/* Price Range */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
//                   <div className="flex gap-2">
//                     <input
//                       type="number"
//                       placeholder="Min"
//                       value={pendingPriceRange[0]}
//                       onChange={(e) =>
//                         setPendingPriceRange([Number(e.target.value), pendingPriceRange[1]])
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     />
//                     <input
//                       type="number"
//                       placeholder="Max"
//                       value={pendingPriceRange[1]}
//                       onChange={(e) =>
//                         setPendingPriceRange([pendingPriceRange[0], Number(e.target.value)])
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 {/* Clear & Apply */}
//                 <div className="flex items-end gap-2">
//                   <button
//                     onClick={clearFilters}
//                     className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     Clear Filters
//                   </button>
//                   <button
//                     onClick={applyPriceFilter}
//                     className="w-full px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-200"
//                   >
//                     Apply Filter
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Products Grid */}
//         {filteredAndSortedProducts.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.4 }}
//             className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//           >
//             {filteredAndSortedProducts.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//               >
//                 <ProductCard product={product} />
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="text-center py-12">
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
//             <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
//             <button
//               onClick={clearFilters}
//               className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;
