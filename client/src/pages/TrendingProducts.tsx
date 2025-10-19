
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, FireIcon } from '@heroicons/react/24/outline';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import BagLoader from '../components/BagLoader';

const TrendingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample trending products
  const trendingProducts: Product[] = [
    {
      id: 'trending_1',
      name: 'Viral TikTok Aesthetic Candle',
      title: 'Viral TikTok Aesthetic Candle',
      description: 'The candle everyone is talking about! Trendy marble design with cottagecore vibes.',
      price: 34.99,
      originalPrice: 42.99,
      discount: 19,
      imageUrl: '/images/candles/candle-collection-7.jpg',
      category: 'Decor Candles',
      stock: 25,
      createdAt: new Date(),
      features: ['TikTok famous', 'Aesthetic design', 'Instagram worthy', 'Trending scent']
    },
    {
      id: 'trending_2',
      name: 'Self-Care Sunday Collection',
      title: 'Self-Care Sunday Collection',
      description: 'Perfect for your wellness routine. Trending among lifestyle influencers and wellness enthusiasts.',
      price: 52.99,
      originalPrice: 64.99,
      discount: 18,
      imageUrl: '/images/candles/candle-collection-8.jpg',
      category: 'Aromatherapy',
      stock: 18,
      createdAt: new Date(),
      features: ['Wellness focused', 'Calming scents', 'Self-care ritual', 'Mindfulness aid']
    },
    {
      id: 'trending_3',
      name: 'Cozy Reading Nook Candle',
      title: 'Cozy Reading Nook Candle',
      description: 'BookTok approved! Creates the perfect ambiance for reading sessions and cozy evenings.',
      price: 28.99,
      originalPrice: 36.99,
      discount: 22,
      imageUrl: '/images/candles/candle-collection-9.jpg',
      category: 'Scented Candles',
      stock: 30,
      createdAt: new Date(),
      features: ['BookTok favorite', 'Reading companion', 'Cozy atmosphere', 'Paper & vanilla scent']
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(trendingProducts);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BagLoader size="large" text="Loading trending products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/"
              className="inline-flex items-center text-white hover:text-pink-200 transition-colors duration-200"
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
            <div className="inline-flex items-center bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <FireIcon className="w-5 h-5 mr-2" />
              TRENDING NOW
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              What's Hot
            </h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Discover the candles that everyone is talking about on social media
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Customer Favorites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These are the candles that are breaking the internet
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrendingProducts;
