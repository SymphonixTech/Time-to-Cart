import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const CandleSubcategories: React.FC = () => {
  const navigate = useNavigate();

  const subcategories = [
    {
      name: 'Scented Candles',
      image: '/images/candles/candle-collection-1.png',
      color: 'bg-gradient-to-br from-orange-400 to-orange-600',
      description: 'Luxurious fragrances for every mood and occasion',
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      productCount: 12
    },
    {
      name: 'Soy Wax',
      image: '/images/candles/candle-collection-2.png',
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      description: 'Natural and eco-friendly candle options',
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.84 16.67 9 13.34 12 13.34s4.16 3.33 6.29 8.66l1.89-.66C18.1 16.17 16 10 17 8z"/></svg>,
      productCount: 8
    },
    {
      name: 'Decor Candles',
      image: '/images/candles/candle-collection-3.png',
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      description: 'Beautiful designs for home styling',
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
      productCount: 6
    },
    {
      name: 'Aromatherapy',
      image: '/images/candles/candle-collection-4.png',
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      description: 'Therapeutic scents for wellness and relaxation',
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72v2.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-2.5c-.6-.35-1-.98-1-1.72 0-1.1.9-2 2-2zm0 7c-.83 0-1.5.67-1.5 1.5 0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.83-.67-1.5-1.5-1.5z"/></svg>,
      productCount: 8
    },
    {
      name: 'Luxury Collection',
      image: '/images/candles/candle-collection-5.png',
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      description: 'Premium handcrafted luxury candles',
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
      productCount: 4
    },
    {
      name: 'Gift Sets',
      image: '/images/candles/candle-collection-10.jpg',
      color: 'bg-gradient-to-br from-red-400 to-red-600',
      description: 'Curated candle gift sets for special occasions',
      icon: <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/></svg>,
      productCount: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center text-white hover:text-orange-200 mb-6 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Candle Categories
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Explore our complete range of candle collections, each crafted with love and attention to detail
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subcategories.map((subcategory, index) => (
              <motion.div
                key={subcategory.name}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer transform perspective-1000"
              >
                <Link to={`/products?category=${subcategory.name.toLowerCase().replace(' ', '-')}`}>
                  <div className={`${subcategory.color} h-48 relative`}>
                    <motion.div 
                      className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-500"
                      whileHover={{ background: "linear-gradient(45deg, rgba(0,0,0,0.1), rgba(255,255,255,0.1))" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="text-6xl transform group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 360,
                          transition: { duration: 0.8 }
                        }}
                      >
                        {subcategory.icon}
                      </motion.div>
                    </div>
                    <motion.div
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: 20, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="bg-white rounded-full p-2">
                        <ArrowRightIcon className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {subcategory.name}
                    </motion.h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {subcategory.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {subcategory.productCount} products
                      </span>
                      <motion.span 
                        className="text-orange-500 font-medium group-hover:text-orange-600 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        Explore →
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CandleSubcategories;