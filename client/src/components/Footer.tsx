import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = React.useState(false);
  const { currentUser } = useAuth();

  const handleSubscribe = async () => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/subscribe`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    setSubscribed(true);
    toast.success(res.data.message);
  }

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/check-subscription`, {
          withCredentials: true,
        });
        setSubscribed(res.data.subscription === true ? true : false);
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };
    checkSubscription();
  }, []);

  return (
    <>
      {currentUser && currentUser.role === 'admin' ? null :
      (<footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Miraj Store</h3>
              <p className="text-gray-400">
                Your one-stop destination for candles, kids stationery, religious products, and thoughtful gifts.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Products
                </Link>
                <Link
                  to="/cart"
                  className="block text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Cart
                </Link>
              </div>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Customer Service</h4>
              <div className="space-y-2">
                <p className="text-gray-400">Email: info@mirajcandles.com</p>
                <p className="text-gray-400">Phone: +91 8015324928</p>
                <p className="text-gray-400">WhatsApp: +91 8015324928</p>
                <p className="text-gray-400 text-sm">
                  Mon-Sat: 9:30 AM - 6:00 PM<br />
                  Sunday: 9:30 AM - 1:30 PM
                </p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Newsletter</h4>
              <p className="text-gray-400">
                Subscribe for new product arrivals, exclusive offers, and special deals.
              </p>
              <div className="flex">
                {/* <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white"
                /> */}
                {subscribed ? (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg cursor-not-allowed"
                  >
                    Subscribed
                  </button>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Miraj Store. All rights reserved.</p>
          </div>
        </div>
      </footer>)}
    </>
  );
};

export default Footer;
