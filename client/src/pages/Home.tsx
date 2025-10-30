import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import BagLoader from '../components/BagLoader';
import { BsStars, BsBoxSeam, BsBookHalf, BsShieldFillCheck } from 'react-icons/bs';
import { MongoService } from '../services/mongoService';
import axios from 'axios';

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const products = await axios.get(`${import.meta.env.VITE_API_URL}/products`).then(res => res.data);
    return products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const fetchFiveStarReviews = async (): Promise<any[]> => {
  try {
    const reviews = [];
    const products = await axios.get(`${import.meta.env.VITE_API_URL}/products`).then(res => res.data);
    products.forEach(product => {
      reviews.push(...(product.reviews || []).filter((review: any) => review.rating === 5));
    });
    return reviews || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingBestSellers, setIsLoadingBestSellers] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [categories, setCategories] = useState<{}>({});
  const [sliders, setSliders] = useState<any[]>([]);
  const [topCards, setTopCards] = useState<any[]>([]);

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      review: 'Absolutely love these candles! The scents are amazing and they last so long.',
      image: '/images/miraj-logo.png'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Los Angeles, CA',
      rating: 5,
      review: 'Best quality candles I have ever purchased. Highly recommend!',
      image: '/images/miraj-logo.png'
    },
    {
      id: 3,
      name: 'Emily Davis',
      location: 'Chicago, IL',
      rating: 5,
      review: 'These candles create the perfect ambiance for my home. Love them!',
      image: '/images/miraj-logo.png'
    },
    {
      id: 4,
      name: 'James Rodriguez',
      location: 'Miami, FL',
      rating: 5,
      review: 'The aromatherapy candles have transformed my meditation sessions completely.',
      image: '/images/miraj-logo.png'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      location: 'Seattle, WA',
      rating: 5,
      review: 'Perfect gift sets! My family absolutely loved the beautiful packaging and quality.',
      image: '/images/miraj-logo.png'
    },
    {
      id: 6,
      name: 'David Park',
      location: 'Austin, TX',
      rating: 5,
      review: 'Clean burning, long-lasting, and incredible fragrances. Worth every penny!',
      image: '/images/miraj-logo.png'
    }
  ];

  const heroSlides = [
    {
      id: 1,
      mainTitle: "100% Natural",
      subtitle: "Candles & Aromatherapy",
      description: "Free shipping on all your orders. We deliver, you enjoy!",
      discount: "43%",
      buttonText: "Shop Now",
      link: "/products",
      mainImage: "/images/candles/candle-collection-1.png",
      promoCards: [
        {
          title: "25% OFF",
          subtitle: "Orange Zest Candles",
          description: "Starting at $9.99",
          image: "/images/candles/candle-collection-2.png",
          buttonText: "Shop Now",
          bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
          link: "/products?category=candles&scent=citrus"
        },
        {
          title: "BEST DEAL",
          subtitle: "Coconut Soy Candles",
          description: "Natural & Pure",
          image: "/images/candles/candle-collection-4.png",
          buttonText: "Shop Now",
          bgColor: "bg-gradient-to-br from-green-700 to-green-800 text-white",
          link: "/products?category=candles&type=soy"
        }
      ]
    },
    {
      id: 2,
      mainTitle: "Premium Quality",
      subtitle: "Handcrafted Soy Candles",
      description: "Experience the finest natural ingredients in every candle!",
      discount: "30%",
      buttonText: "Shop Now",
      link: "/sale",
      mainImage: "/images/candles/candle-collection-3.png",
      promoCards: [
        {
          title: "LIMITED TIME",
          subtitle: "Lavender Dreams",
          description: "Starting at $12.99",
          image: "/images/candles/candle-collection-5.png",
          buttonText: "Shop Now",
          bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
          link: "/products?category=candles&scent=lavender"
        },
        {
          title: "NEW ARRIVAL",
          subtitle: "Vanilla Essence",
          description: "Pure & Organic",
          image: "/images/candles/candle-collection-6.jpg",
          buttonText: "Shop Now",
          bgColor: "bg-gradient-to-br from-yellow-600 to-yellow-700 text-white",
          link: "/products?category=candles&scent=vanilla"
        }
      ]
    },
    {
      id: 3,
      mainTitle: "Trending Now",
      subtitle: "Customer Favorites",
      description: "Most loved aromatherapy candles trending worldwide!",
      discount: "25%",
      buttonText: "Shop Trending",
      link: "/trending",
      mainImage: "/images/candles/candle-collection-7.jpg",
      promoCards: [
        {
          title: "HOT DEAL",
          subtitle: "Rose Garden",
          description: "Starting at $8.99",
          image: "/images/candles/candle-collection-8.jpg",
          buttonText: "Shop Now",
          bgColor: "bg-gradient-to-br from-pink-100 to-rose-200",
          link: "/products?category=candles&scent=floral"
        },
        {
          title: "BESTSELLER",
          subtitle: "Ocean Breeze",
          description: "Fresh & Clean",
          image: "/images/candles/candle-collection-9.jpg",
          buttonText: "Shop Now",
          bgColor: "bg-gradient-to-br from-blue-600 to-blue-700 text-white",
          link: "/products?category=candles&scent=ocean"
        }
      ]
    }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingFeatured(true);
        setIsLoadingBestSellers(true);

        const products = await fetchProducts();
        const reviews = await fetchFiveStarReviews();
        const category = await axios.get(`${import.meta.env.VITE_API_URL}/categories`).then(res => res.data);
        setCategories(category);
        setReviews(reviews);

        if (products.length > 0) {

          const featured = products.filter(p => p.featured === true);
          setFeaturedProducts(featured.length > 0 ? featured.slice(0, 4) : products.slice(0, 4));

          const slidingProducts = products.filter(prod => prod.addToSliders === true);
          setSliders(slidingProducts);

          const top = products.filter(prod => prod.addToTopCard === true);
          setTopCards(top);

          const bestsellersFiltered = products.filter(p => p.bestSeller === true);
          setBestSellers(bestsellersFiltered.length > 0 ? bestsellersFiltered.slice(0, 4) : products.slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setFeaturedProducts([]);
        setBestSellers([]);
      } finally {
        setIsLoadingFeatured(false);
        setIsLoadingBestSellers(false);
      }
    };

    loadProducts();
  }, []);


  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 12000); // Changed to 12 seconds for better user experience

    return () => clearInterval(timer);
  }, [sliders.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  const sample_categories = [
    {
      name: 'Candles',
      displayName: 'Candles',
      image: '/images/candles/candle-collection-8.jpg',
      categoryImage: '/images/categories/candles.jpg',
      color: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600',
      description: 'Premium handcrafted candles',
      hasSubcategories: true,
      subcategories: [
        { name: 'Scented Candles', description: 'Luxurious fragrances for every mood' },
        { name: 'Soy Wax', description: 'Natural and eco-friendly options' },
        { name: 'Decor Candles', description: 'Beautiful designs for home styling' },
        { name: 'Aromatherapy', description: 'Therapeutic scents for wellness' }
      ]
    },
    {
      name: 'Religious Products',
      displayName: 'Religious Products',
      image: '/images/candles/candle-collection-7.jpg',
      categoryImage: '/images/categories/religious-products.jpg',
      color: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600',
      description: 'Sacred items for spiritual practices',
      hasSubcategories: false
    },
    {
      name: 'Kids Stationery',
      displayName: 'Kids Stationery',
      image: '/images/candles/candle-collection-6.jpg',
      categoryImage: '/images/categories/kids-stationery.jpg',
      color: 'bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600',
      description: 'Fun and colorful stationery for kids',
      hasSubcategories: false
    },
    {
      name: 'Gifts',
      displayName: 'Gifts',
      image: '/images/candles/candle-collection-10.jpg',
      categoryImage: '/images/categories/gifts.jpg',
      color: 'bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-600',
      description: 'Perfect presents for loved ones',
      hasSubcategories: false
    }
  ];


  const cartVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: { scale: [1, 1.2, 1.1, 1.2, 1], rotate: [0, 10, -10, 10, 0] },
    transition: { duration: 0.8, ease: "easeInOut" }
  };

  const coinVariants = {
    initial: { opacity: 0, y: 50, rotate: -45 },
    animate: { opacity: 1, y: 0, rotate: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-16 bg-gradient-to-b from-[#fff] to-white">
        {/* Floating Product Preview Bar */}
        <div className="absolute top-5 left-0 w-full z-40 flex justify-center px-4">
          <div
            className="
              bg-transparent p-3 rounded-xl shadow-lg flex items-center justify-start space-x-4
              border hover:shadow-xl transition-all duration-300
              max-w-5xl mx-auto
              overflow-x-auto sm:overflow-visible
              scrollbar-hide
            "
          >
            <div className="pl-3 flex space-x-4">
              {topCards.map((product, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                  <Link to="/contact" className="block">
                    <span className="text-sm font-semibold text-gray-800">
                      {product.name}
                    </span>
                    <p className="text-xs text-gray-500">₹{product.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      
        {/* ✅ Hero container (spaced better + soft background) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="grid lg:grid-cols-2 gap-8 items-center mt-10"
            >
              {/* LEFT TEXT */}
              <div className="space-y-6">
                <div className="bg-orange-500 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-lg shadow-lg">
                  {sliders[currentSlide].slidersDiscount}
                </div>
      
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mt-4">
                  {sliders[currentSlide].slidersMainTitle}
                  <br />
                  <span className="text-2xl lg:text-3xl text-gray-600 font-normal">
                    {sliders[currentSlide].slidersSubTitle}
                  </span>
                </h1>
      
                <p className="text-lg text-gray-600 leading-relaxed">
                  {sliders[currentSlide].slidersDescription}
                </p>
      
                <Link
                  to={sliders[currentSlide].slidersLink}
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {sliders[currentSlide].slidersButtonName}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
      
              {/* RIGHT IMAGE */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative flex justify-center items-center mt-10"
              >
                <img
                  src={heroSlides[currentSlide].mainImage}
                  alt={heroSlides[currentSlide].mainTitle}
                  className="w-4/5 h-80 object-cover rounded-2xl shadow-lg"
                />
                <button className="absolute top-4 right-12 bg-white rounded-full p-2 shadow hover:shadow-md">
                  <HeartIcon className="w-6 h-6 text-gray-700" />
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
      
          {/* Dots Indicator */}
          <div className="flex justify-center mt-10 space-x-2">
            {sliders.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-green-600 rounded-sm'
                    : 'bg-gray-300 hover:bg-gray-400 rounded-sm'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Choose Your Category Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Category</h2>
          </motion.div>

          {/* Category Icons Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-12">
            {['Candles', 'Religious Products', 'Kids Stationery', 'Gifts'].map((category, index) => {
              const count = categories?.[category] ?? 0;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`text-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    index === 0
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => {
                    if (category === 'Candles') {
                      navigate('/candles-subcategories');
                    } else {
                      navigate(`/products?category=${category.toLowerCase().replace(/ /g, '-')}`);
                    }
                  }}
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-lg overflow-hidden">
                    <img
                      src={sample_categories[index % sample_categories.length].categoryImage}
                      alt={category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{category}</h3>
                  <p className={`text-sm ${index === 0 ? 'text-orange-100' : 'text-gray-500'}`}>
                    {count} Products
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium candles, crafted with love and attention to detail.
            </p>
          </div>
          {isLoadingFeatured ? (
            <BagLoader size="large" text="Loading featured products..." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center">
            <Link
              to="/featured"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              View All Featured Products
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Sellers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular candles that customers love and keep coming back for.
            </p>
          </div>
          {isLoadingBestSellers ? (
            <BagLoader size="large" text="Loading bestsellers..." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {bestSellers.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center">
            <Link
              to="/bestsellers"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              View All Best Sellers
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Happy Clients Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Happy Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our customers say about their
              experience with Miraj Candles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((client: any, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonials[client.id - 1].image}
                    alt={client.userId}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{client.userId.name}</h4>
                    <p className="text-sm text-gray-600">{client.userId.address
                      ? [
                          client.userId.address.street,
                          client.userId.address.city,
                          client.userId.address.state,
                          client.userId.address.country
                        ]
                          .filter(Boolean)
                          .join(', ')
                      : testimonials[client.id - 1].location
                    }</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(client.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{client.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <div>
        <img src="/images/about-us.jpg" alt="About Us" className="w-full h-64 object-cover" />
      </div>


    </div>
  );
};

export default Home;





// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
// import { Product } from '../types';
// import ProductCard from '../components/ProductCard';
// import { ProductGridSkeleton } from '../components/SkeletonLoader';
// import BagLoader from '../components/BagLoader';
// import { BsStars, BsBoxSeam, BsBookHalf, BsShieldFillCheck } from 'react-icons/bs';
// import { MongoService } from '../services/mongoService';
// import axios from 'axios';

// const fetchProducts = async (): Promise<Product[]> => {
//   try {
//     const products = await axios.get(`${import.meta.env.VITE_API_URL}/products`).then(res => res.data);
//     return products || [];
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return [];
//   }
// };

// const fetchFiveStarReviews = async (): Promise<any[]> => {
//   try {
//     const reviews = [];
//     const products = await axios.get(`${import.meta.env.VITE_API_URL}/products`).then(res => res.data);
//     products.forEach(product => {
//       reviews.push(...(product.reviews || []).filter((review: any) => review.rating === 5));
//     });
//     return reviews || [];
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     return [];
//   }
// };

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
//   const [bestSellers, setBestSellers] = useState<Product[]>([]);
//   const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
//   const [isLoadingBestSellers, setIsLoadingBestSellers] = useState(true);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [reviews, setReviews] = useState<any[]>([]);
//   const [categories, setCategories] = useState<{}>({});

//   // Sample testimonials data
//   const testimonials = [
//     {
//       id: 1,
//       name: 'Sarah Johnson',
//       location: 'New York, NY',
//       rating: 5,
//       review: 'Absolutely love these candles! The scents are amazing and they last so long.',
//       image: '/images/miraj-logo.png'
//     },
//     {
//       id: 2,
//       name: 'Michael Chen',
//       location: 'Los Angeles, CA',
//       rating: 5,
//       review: 'Best quality candles I have ever purchased. Highly recommend!',
//       image: '/images/miraj-logo.png'
//     },
//     {
//       id: 3,
//       name: 'Emily Davis',
//       location: 'Chicago, IL',
//       rating: 5,
//       review: 'These candles create the perfect ambiance for my home. Love them!',
//       image: '/images/miraj-logo.png'
//     },
//     {
//       id: 4,
//       name: 'James Rodriguez',
//       location: 'Miami, FL',
//       rating: 5,
//       review: 'The aromatherapy candles have transformed my meditation sessions completely.',
//       image: '/images/miraj-logo.png'
//     },
//     {
//       id: 5,
//       name: 'Lisa Thompson',
//       location: 'Seattle, WA',
//       rating: 5,
//       review: 'Perfect gift sets! My family absolutely loved the beautiful packaging and quality.',
//       image: '/images/miraj-logo.png'
//     },
//     {
//       id: 6,
//       name: 'David Park',
//       location: 'Austin, TX',
//       rating: 5,
//       review: 'Clean burning, long-lasting, and incredible fragrances. Worth every penny!',
//       image: '/images/miraj-logo.png'
//     }
//   ];

//   const heroSlides = [
//     {
//       id: 1,
//       mainTitle: "100% Natural",
//       subtitle: "Candles & Aromatherapy",
//       description: "Free shipping on all your orders. We deliver, you enjoy!",
//       discount: "43%",
//       buttonText: "Shop Now",
//       link: "/products",
//       mainImage: "/images/candles/candle-collection-1.png",
//       promoCards: [
//         {
//           title: "25% OFF",
//           subtitle: "Orange Zest Candles",
//           description: "Starting at $9.99",
//           image: "/images/candles/candle-collection-2.png",
//           buttonText: "Shop Now",
//           bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
//           link: "/products?category=candles&scent=citrus"
//         },
//         {
//           title: "BEST DEAL",
//           subtitle: "Coconut Soy Candles",
//           description: "Natural & Pure",
//           image: "/images/candles/candle-collection-4.png",
//           buttonText: "Shop Now",
//           bgColor: "bg-gradient-to-br from-green-700 to-green-800 text-white",
//           link: "/products?category=candles&type=soy"
//         }
//       ]
//     },
//     {
//       id: 2,
//       mainTitle: "Premium Quality",
//       subtitle: "Handcrafted Soy Candles",
//       description: "Experience the finest natural ingredients in every candle!",
//       discount: "30%",
//       buttonText: "Shop Now",
//       link: "/products",
//       mainImage: "/images/candles/candle-collection-3.png",
//       promoCards: [
//         {
//           title: "LIMITED TIME",
//           subtitle: "Lavender Dreams",
//           description: "Starting at $12.99",
//           image: "/images/candles/candle-collection-5.png",
//           buttonText: "Shop Now",
//           bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
//           link: "/products?category=candles&scent=lavender"
//         },
//         {
//           title: "NEW ARRIVAL",
//           subtitle: "Vanilla Essence",
//           description: "Pure & Organic",
//           image: "/images/candles/candle-collection-6.jpg",
//           buttonText: "Shop Now",
//           bgColor: "bg-gradient-to-br from-yellow-600 to-yellow-700 text-white",
//           link: "/products?category=candles&scent=vanilla"
//         }
//       ]
//     },
//     {
//       id: 3,
//       mainTitle: "Trending Now",
//       subtitle: "Customer Favorites",
//       description: "Most loved aromatherapy candles trending worldwide!",
//       discount: "25%",
//       buttonText: "Shop Trending",
//       link: "/trending",
//       mainImage: "/images/candles/candle-collection-7.jpg",
//       promoCards: [
//         {
//           title: "HOT DEAL",
//           subtitle: "Rose Garden",
//           description: "Starting at $8.99",
//           image: "/images/candles/candle-collection-8.jpg",
//           buttonText: "Shop Now",
//           bgColor: "bg-gradient-to-br from-pink-100 to-rose-200",
//           link: "/products?category=candles&scent=floral"
//         },
//         {
//           title: "BESTSELLER",
//           subtitle: "Ocean Breeze",
//           description: "Fresh & Clean",
//           image: "/images/candles/candle-collection-9.jpg",
//           buttonText: "Shop Now",
//           bgColor: "bg-gradient-to-br from-blue-600 to-blue-700 text-white",
//           link: "/products?category=candles&scent=ocean"
//         }
//       ]
//     }
//   ];

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         setIsLoadingFeatured(true);
//         setIsLoadingBestSellers(true);

//         const products = await fetchProducts();
//         const reviews = await fetchFiveStarReviews();
//         const category = await axios.get(`${import.meta.env.VITE_API_URL}/categories`).then(res => res.data);
//         setCategories(category);
//         setReviews(reviews);

//         if (products.length > 0) {

//           const featured = products.filter(p => p.featured);
//           setFeaturedProducts(featured.length > 0 ? featured.slice(0, 4) : products.slice(0, 4));


//           const bestsellersFiltered = products.filter(p => p.bestSeller);
//           setBestSellers(bestsellersFiltered.length > 0 ? bestsellersFiltered.slice(0, 4) : products.slice(4, 8));
//         }
//       } catch (error) {
//         console.error('Error loading products:', error);
//         setFeaturedProducts([]);
//         setBestSellers([]);
//       } finally {
//         setIsLoadingFeatured(false);
//         setIsLoadingBestSellers(false);
//       }
//     };

//     loadProducts();
//   }, []);


//   // Auto-slide functionality
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
//     }, 4000); // Changed to 4 seconds for better user experience

//     return () => clearInterval(timer);
//   }, [heroSlides.length]);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
//   };

//   const sample_categories = [
//     {
//       name: 'Candles',
//       displayName: 'Candles',
//       image: '/images/candles/candle-collection-8.jpg',
//       categoryImage: '/images/categories/candles.jpg',
//       color: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600',
//       description: 'Premium handcrafted candles',
//       hasSubcategories: true,
//       subcategories: [
//         { name: 'Scented Candles', description: 'Luxurious fragrances for every mood' },
//         { name: 'Soy Wax', description: 'Natural and eco-friendly options' },
//         { name: 'Decor Candles', description: 'Beautiful designs for home styling' },
//         { name: 'Aromatherapy', description: 'Therapeutic scents for wellness' }
//       ]
//     },
//     {
//       name: 'Religious Products',
//       displayName: 'Religious Products',
//       image: '/images/candles/candle-collection-7.jpg',
//       categoryImage: '/images/categories/religious-products.jpg',
//       color: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600',
//       description: 'Sacred items for spiritual practices',
//       hasSubcategories: false
//     },
//     {
//       name: 'Kids Stationery',
//       displayName: 'Kids Stationery',
//       image: '/images/candles/candle-collection-6.jpg',
//       categoryImage: '/images/categories/kids-stationery.jpg',
//       color: 'bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600',
//       description: 'Fun and colorful stationery for kids',
//       hasSubcategories: false
//     },
//     {
//       name: 'Gifts',
//       displayName: 'Gifts',
//       image: '/images/candles/candle-collection-10.jpg',
//       categoryImage: '/images/categories/gifts.jpg',
//       color: 'bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-600',
//       description: 'Perfect presents for loved ones',
//       hasSubcategories: false
//     }
//   ];

//   return (
//     <div className="min-h-screen">
//       <div className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
//           <img
//             src="/images/candles/candle-collection-1.png" // <-- Replace with product.imageUrl
//             alt="Product"
//             className="w-12 h-12 object-cover rounded-md border border-gray-200"
//           />
//           <div>
//             <h2 className="text-sm font-semibold text-gray-800">Vanilla Bliss Candle</h2> {/* Replace with product.name */}
//             <p className="text-xs text-gray-500">$19.99</p> {/* Optional price line */}
//           </div>
//         </div>
//       <section className="bg-white py-8 relative overflow-hidden">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={currentSlide}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.6, ease: "easeInOut" }}
//         className="grid lg:grid-cols-2 gap-8 items-center"
//       >
//         {/* LEFT SIDE → Text */}
//         <div className="space-y-6">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             {/* Discount Badge */}
//             <div className="bg-orange-500 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-lg shadow-lg">
//               {heroSlides[currentSlide].discount}
//             </div>

//             {/* Title + Subtitle */}
//             <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mt-4">
//               {heroSlides[currentSlide].mainTitle}
//               <br />
//               <span className="text-2xl lg:text-3xl text-gray-600 font-normal">
//                 {heroSlides[currentSlide].subtitle}
//               </span>
//             </h1>
//           </motion.div>

//           {/* Description */}
//           <motion.p
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-lg text-gray-600 leading-relaxed"
//           >
//             {heroSlides[currentSlide].description}
//           </motion.p>

//           {/* Button */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//           >
//             <Link
//               to={heroSlides[currentSlide].link}
//               className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//             >
//               {heroSlides[currentSlide].buttonText}
//               <ArrowRightIcon className="w-5 h-5 ml-2" />
//             </Link>
//           </motion.div>
//         </div>

//         {/* RIGHT SIDE → Image */}
//         <motion.div
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.5 }}
//           className="relative"
//         >
//           <img
//             src={heroSlides[currentSlide].mainImage}
//             alt={heroSlides[currentSlide].mainTitle}
//             className="w-full h-96 object-cover rounded-2xl shadow-lg"
//           />
//           <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:shadow-md">
//             <HeartIcon className="w-6 h-6 text-gray-700" />
//           </button>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>

//     {/* Slide Indicators (unchanged) */}
//     <div className="flex justify-center mt-8 space-x-2">
//       {heroSlides.map((_, index) => (
//         <button
//           key={index}
//           onClick={() => setCurrentSlide(index)}
//           className={`w-3 h-3 transition-all duration-300 ${
//             currentSlide === index
//               ? "bg-green-600 rounded-sm"
//               : "bg-gray-300 hover:bg-gray-400 rounded-sm"
//           }`}
//         />
//       ))}
//     </div>
//   </div>
// </section>

//       {/* Choose Your Category Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Category</h2>
//           </motion.div>

//           {/* Category Icons Row */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-12">
//             {['Candles', 'Religious Products', 'Kids Stationery', 'Gifts'].map((category, index) => {
//               const count = categories?.[category] ?? 0;

//               return (
//                 <motion.div
//                   key={category}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   viewport={{ once: true }}
//                   className={`text-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
//                     index === 0
//                       ? 'bg-orange-500 text-white border-orange-500'
//                       : 'bg-white border-gray-200 hover:border-orange-300'
//                   }`}
//                   onClick={() => {
//                     if (category === 'Candles') {
//                       navigate('/candles-subcategories');
//                     } else {
//                       navigate(`/products?category=${category.toLowerCase().replace(' ', '-')}`);
//                     }
//                   }}
//                 >
//                   <div className="w-12 h-12 mx-auto mb-2 rounded-lg overflow-hidden">
//                     <img
//                       src={sample_categories[index % sample_categories.length].categoryImage}
//                       alt={category}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <h3 className="font-semibold mb-1">{category}</h3>
//                   <p className={`text-sm ${index === 0 ? 'text-orange-100' : 'text-gray-500'}`}>
//                     {count} Products
//                   </p>
//                 </motion.div>
//               );
//             })}
//           </div>

//         </div>
//       </section>

//       {/* Featured Products Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Discover our handpicked selection of premium candles, crafted with love and attention to detail.
//             </p>
//           </div>
//           {isLoadingFeatured ? (
//             <BagLoader size="large" text="Loading featured products..." />
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               {featuredProducts.map((product, index) => (
//                 <motion.div
//                   key={product._id}
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                 >
//                   <ProductCard product={product} />
//                 </motion.div>
//               ))}
//             </div>
//           )}
//           <div className="text-center">
//             <Link
//               to="/featured"
//               className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
//             >
//               View All Featured Products
//               <ArrowRightIcon className="w-5 h-5 ml-2" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Best Sellers Section */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Sellers</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Our most popular candles that customers love and keep coming back for.
//             </p>
//           </div>
//           {isLoadingBestSellers ? (
//             <BagLoader size="large" text="Loading bestsellers..." />
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               {bestSellers.map((product, index) => (
//                 <motion.div
//                   key={product._id}
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                 >
//                   <ProductCard product={product} />
//                 </motion.div>
//               ))}
//             </div>
//           )}
//           <div className="text-center">
//             <Link
//               to="/bestsellers"
//               className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
//             >
//               View All Best Sellers
//               <ArrowRightIcon className="w-5 h-5 ml-2" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Happy Clients Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//               Our Happy Clients
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Don't just take our word for it. Here's what our customers say about their
//               experience with Miraj Candles.
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {reviews.map((client: any, index) => (
//               <motion.div
//                 key={client.id}
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 whileHover={{ y: -5 }}
//                 className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="flex items-center mb-4">
//                   <img
//                     src={testimonials[client.id - 1].image}
//                     alt={client.userId}
//                     className="w-12 h-12 rounded-full mr-4 object-cover"
//                   />
//                   <div>
//                     <h4 className="font-semibold text-gray-900">{client.userId}</h4>
//                     <p className="text-sm text-gray-600">{testimonials[client.id - 1].location}</p>
//                   </div>
//                 </div>

//                 <div className="flex mb-3">
//                   {[...Array(client.rating)].map((_, i) => (
//                     <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-gray-700 italic">"{client.comment}"</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <div>
//         <img src="/images/about-us.jpg" alt="About Us" className="w-full h-64 object-cover" />
//       </div>


//     </div>
//   );
// };

// export default Home;
