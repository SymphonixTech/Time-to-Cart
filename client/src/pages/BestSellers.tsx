import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, FireIcon } from '@heroicons/react/24/outline';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import BagLoader from '../components/BagLoader';
import { MongoService } from '../services/mongoService';

const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const allProducts = await MongoService.getProducts();
        // Filter for best selling products or products marked as bestseller
        const bestSellers = allProducts?.filter((p: Product) => p.status === 'bestseller') || [];
        setProducts(bestSellers);
      } catch (error) {
        console.error('Error loading best sellers:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BagLoader size="large" text="Loading bestsellers..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/"
              className="inline-flex items-center text-white hover:text-orange-200 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-red-400 to-orange-400 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <FireIcon className="w-5 h-5 mr-2" />
              BESTSELLERS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Best Sellers
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Discover our most popular candles that customers absolutely love
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These are the candles that have captured hearts and lit up homes across the country
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No bestsellers available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BestSellers;