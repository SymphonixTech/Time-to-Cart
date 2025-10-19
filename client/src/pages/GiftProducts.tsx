import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, GiftIcon } from '@heroicons/react/24/outline';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import BagLoader from '../components/BagLoader';
import { MongoService } from '../services/mongoService';

const GiftProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const allProducts = await MongoService.getProducts();
        // Filter for gift products by category
        const gifts = allProducts?.filter((p: Product) => p.category === 'Gifts' || p.category === 'Gift Sets') || [];
        setProducts(gifts);
      } catch (error) {
        console.error('Error loading gift products:', error);
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
        <BagLoader size="large" text="Loading gift products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/"
              className="inline-flex items-center text-white hover:text-green-200 transition-colors duration-200"
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
            <div className="inline-flex items-center bg-gradient-to-r from-green-400 to-emerald-400 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <GiftIcon className="w-5 h-5 mr-2" />
              PERFECT GIFTS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Gift Collections
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Thoughtfully curated gift sets that create lasting memories for every special occasion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gift Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Beautiful gift sets perfect for birthdays, anniversaries, holidays, and special occasions
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No gift products available at the moment.</p>
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

export default GiftProducts;