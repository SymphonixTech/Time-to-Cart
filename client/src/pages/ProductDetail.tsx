import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, HeartIcon, ShareIcon, CameraIcon, CheckCircleIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLoading } from '../context/LoadingContext';
import { MongoService } from '../services/mongoService';
import toast from 'react-hot-toast';
import axios from 'axios';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

const mockProductData = {
  customerPhotos: [
    '/images/customer-photos/photo1.jpg',
    '/images/customer-photos/photo2.jpg',
    '/images/customer-photos/photo3.jpg',
    '/images/customer-photos/photo4.jpg',
  ],
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { setLoading } = useLoading();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [localWishlisted, setLocalWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [rev, setRev] = useState("");
  const [rat, setRat] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState({
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0
  });

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const foundProduct = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`, { withCredentials: true }).then(res => res.data);
        const category = foundProduct.category;
        const prod = await axios.get(`${import.meta.env.VITE_API_URL}/products`, { withCredentials: true }).then(res => res.data);
        const simProd = prod.filter(p => p.category === category);
        setSimilarProducts(simProd);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}/review-breakdown`, { withCredentials: true });
        const ratings = res.data.breakdown;
        setRatingBreakdown(ratings);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error('Product not found');
          navigate('/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate, setLoading]);

  const handleAddToCart = () => {
    if (product && product.stockQuantity > 0) {
      addItems(product, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    } else {
      toast.error('Product is out of stock!');
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/reviews/${product._id}`, {
        comment: rev,
        rating: rat,
      }, {
        withCredentials: true
      });
      toast.success(res.data.message);
      setRev("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist(product);
      }
    }
  };

  const handleOrderNow = () => {
    if (product && product.stockQuantity > 0) {
      addItems(product, quantity);
      toast.success('Product added to cart! Redirecting to checkout...', {
        duration: 2000,
        icon: '🛒',
      });

      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    } else {
      toast.error('Product is out of stock!');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const renderStars = (
    rating: number,
    size = 'w-5 h-5',
    onSelect?: (value: number) => void
  ) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        onClick={() => onSelect && onSelect(i + 1)}
        className={`
          ${size}
          cursor-pointer
          transition-colors duration-150
          ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'}
        `}
      />
    ));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-w-1 aspect-h-1 bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = [
    ...product.images,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-sm text-gray-500 mb-6"
        >
          <button onClick={() => navigate('/')} className="hover:text-gray-700">Home</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/products')} className="hover:text-gray-700">Products</button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover object-center rounded-lg"
              />
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200"
              >
                <HeartIcon className={`w-6 h-6 ${isInWishlist(product._id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={handleShare}
                className="absolute top-4 right-16 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-200"
              >
                <ShareIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Customer Photos */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Customer Photos</h3>
              <div className="grid grid-cols-4 gap-2">
                {mockProductData.customerPhotos.slice(0, 4).map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-sm mb-3">Brand: Miraj Candles</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-orange-500 mr-2">{product.rating.toFixed(1)}</span>
                  <div className="flex items-center">
                    {renderStars(Math.floor(product.rating))}
                  </div>
                </div>
                <span className="text-gray-600">({product.reviews.length} reviews)</span>
                <span className="text-green-600 font-medium">{product.sales} sold</span>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ₹{(product.price).toFixed(0)}
              </div>
              <p className="text-green-600 text-sm">Inclusive of all taxes</p>
              {product.deliveryInfo.freeDelivery && (
                <p className="text-blue-600 text-sm">Free delivery</p>
              )}
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Highlights</h3>
              <ul className="space-y-2">
                {product.tags.map((highlight, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TruckIcon className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">Delivery Information</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Free delivery in {product.deliveryInfo.estimatedDays} business days
              </p>
              <p className="text-sm text-gray-600">
                {product.deliveryInfo.returnPolicy}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity and Actions */}
            {product.stockQuantity > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[...Array(Math.min(10, product.stockQuantity))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Add to Cart
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOrderNow}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Order Now
                  </motion.button>
                </div>
              </div>
            )}

            {/* Security */}
            <div className="flex items-center text-sm text-gray-600">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Secure transaction • 100% authentic products
            </div>
          </motion.div>
        </div>

        {/* Detailed Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100"
        >
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {['description', 'specifications', 'reviews']
                .filter((tab) => product.category === 'Candles' || tab !== 'specifications')
                .map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                      selectedTab === tab
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {tab === 'reviews' && ` (${product.reviews.length})`}
                  </button>
                ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'description' && (
              <div>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {product.tags.map((highlight, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {product.category === 'Candles' && selectedTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                {/* Rating Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="text-4xl font-bold text-gray-900 mr-4">{product.rating.toFixed(1)}</span>
                      <div>
                        <div className="flex items-center mb-1">
                          {renderStars(Math.floor(product.rating))}
                        </div>
                        <p className="text-sm text-gray-600">{product.reviews.length} global ratings</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    {Object.entries(ratingBreakdown).reverse().map(([stars, count]) => {
                      const totalMockReviews = Object.values(ratingBreakdown).reduce(
                        (sum, val) => sum + val,
                        0
                      );
                      const widthPercent = (count / totalMockReviews) * 100;
                      return (<div key={stars} className="flex items-center mb-2">
                        <span className="text-sm text-gray-600 w-12">{stars} star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${widthPercent}` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    )})}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {product.reviews.map((review:any) => (
                    <div key={review.userId._id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {
                              typeof review.userId?.name === 'string'
                                ? review.userId.name.split(' ').map(n => n[0]).join('')
                                : '??'
                            }
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{review.userId.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">{renderStars(review.rating, 'w-4 h-4')}</div>
                            <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    <div className="flex">
                      {renderStars(rat, 'w-6 h-6', setRat)}
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      Selected rating: {rat > 0 ? rat : 'None'}
                    </p>
                    <input
                      type="text"
                      placeholder='Enter your reviews here'
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={rev}
                      onChange={(e) => setRev(e.target.value)}
                    />
                    <input
                      type="submit"
                      value="Submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                      onClick={handleReviewSubmit}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Similar Products
          </h2>

          {/* Split similar products into two unique groups */}
            {(() => {
              const uniqueProducts = similarProducts.filter(
                (p) => p._id !== product._id
              );
              const mid = Math.ceil(uniqueProducts.length / 2);
              const firstRow = uniqueProducts.slice(0, mid);
              const secondRow = uniqueProducts.slice(mid, mid * 2);

              const renderRow = (items: any[], key: string) => (
                <div
                  key={key}
                  className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
                >
                  {items.map((p) => (
                    <motion.div
                      key={p._id}
                      whileHover={{ scale: 1.04 }}
                      className="min-w-[220px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer flex-shrink-0"
                      onClick={() => navigate(`/products/${p._id}`)}
                    >
                      <img
                        src={p.images?.[0] || '/placeholder.jpg'}
                        alt={p.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                        <p className="text-orange-500 font-semibold mt-1">
                          ₹{p.price}
                        </p>
                        <div className="flex items-center mt-1">
                          {renderStars(Math.floor(p.rating), 'w-4 h-4')}
                          <span className="ml-2 text-xs text-gray-500">
                            ({p.reviews?.length || 0})
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );

              return (
                <>
                  {renderRow(firstRow, 'row1')}
                  {secondRow.length > 0 && (
                    <div className="mt-6">{renderRow(secondRow, 'row2')}</div>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
