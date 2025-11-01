import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import BagLoader from '../components/BagLoader';
import axios from 'axios';

const Kids: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { withCredentials: true });
        const prod = res.data;
        const kidProd = prod.filter(p => p.category === 'Kids Stationery');
        setProducts(kidProd);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Sample sale products
  const saleProducts: Product[] = [
    {
      _id: 'sale_1',
      name: 'Premium Soy Candle Bundle',
      title: 'Premium Soy Candle Bundle',
      description: 'Set of 3 premium soy candles at an incredible discount. Limited time offer!',
      price: 39.99,
      originalPrice: 69.99,
      discount: 43,
      images: ['/images/candles/candle-collection-4.png'],
      category: 'Soy Wax',
      stockQuantity: 20,
      createdAt: new Date(),
      features: ['3 candle set', 'Natural soy wax', 'Long burning', 'Gift packaging'],
      rating: 4.8,
      reviews: [],
      sales: 0,
      status: 'sale',
      updatedAt: new Date(),
      deliveryInfo: {
        freeDelivery: true,
        estimatedDays: 5,
        returnPolicy: '30-day return policy'
      },
      specifications: {
        Material: 'Soy Wax',
        Dimensions: '6x6x8 inches',
        Weight: '3 lb',
        Burn_Time: '120 hours',
        Scent: 'Mixed'
      },
      tags: ['bundle', 'soy wax'],
      featured: false,
      bestSeller: true,
      addToSliders: false,
      addToTopCard: false
    },
    {
      _id: 'sale_2',
      name: 'Luxury Aromatherapy Set',
      title: 'Luxury Aromatherapy Set',
      description: 'Complete aromatherapy experience with candles, diffuser oils, and accessories.',
      price: 89.99,
      originalPrice: 149.99,
      discount: 40,
      images: ['/images/candles/candle-collection-5.png'],
      category: 'Aromatherapy',
      stockQuantity: 15,
      createdAt: new Date(),
      features: ['Complete set', 'Essential oils', 'Diffuser included', 'Wellness guide'],
      rating: 4.9,
      reviews: [],
      sales: 0,
      status: 'sale',
      updatedAt: new Date(),
      deliveryInfo: {
        freeDelivery: true,
        estimatedDays: 5,
        returnPolicy: '30-day return policy'
      },
      specifications: {
        Material: 'Soy Wax & Glass',
        Dimensions: '8x8x10 inches',
        Weight: '5 lb',
        Burn_Time: '150 hours',
        Scent: 'Essential Oils'
      },
      tags: ['aromatherapy', 'wellness'],
      featured: false,
      bestSeller: true,
      addToSliders: false,
      addToTopCard: false
    },
    {
      _id: 'sale_3',
      name: 'Seasonal Scent Collection',
      title: 'Seasonal Scent Collection',
      description: 'Four seasonal candles representing spring, summer, autumn, and winter fragrances.',
      price: 59.99,
      originalPrice: 99.99,
      discount: 40,
      images: ['/images/candles/candle-collection-6.jpg'],
      category: 'Gift Sets',
      stockQuantity: 10,
      createdAt: new Date(),
      features: ['4 seasonal scents', 'Premium quality', 'Beautiful packaging', 'Year-round enjoyment'],
      rating: 4.7,
      reviews: [],
      sales: 0,
      status: 'sale',
      updatedAt: new Date(),
      deliveryInfo: {
        freeDelivery: true,
        estimatedDays: 5,
        returnPolicy: '30-day return policy'
      },
      specifications: {
        Material: 'Soy Wax',
        Dimensions: '12x12x6 inches',
        Weight: '4 lb',
        Burn_Time: '160 hours',
        Scent: 'Seasonal'
      },
      tags: ['seasonal', 'gift set'],
      featured: false,
      bestSeller: true,
      addToSliders: false,
      addToTopCard: false
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BagLoader size="large" text="Loading sale items..." />
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
              <TagIcon className="w-5 h-5 mr-2" />
              SALE - UP TO 50% OFF
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Kids Collection
              </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Don't miss out on these incredible deals on our premium candle collections
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Limited Time Offers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Grab these amazing deals before they're gone!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
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
              className="inline-flex items-center bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kids;
