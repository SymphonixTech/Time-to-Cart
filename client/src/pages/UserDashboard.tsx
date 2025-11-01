import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import axios from 'axios';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  lastUpdate?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const UserDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [orders, setOrders] = useState([] as any[]);
  const [onClickEditAddress, setOnClickEditAddress] = useState(false);
  const [viewDetails, setViewDetails] = useState<boolean | string>(false);
  const [user, setUser] = useState<UserProfile>({
    name: currentUser?.name?.split(' ')[0] || '',
    email: currentUser?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });

  const [lastUpdate, setLastUpdate] = useState(0);

  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profile, setProfile] = useState<UserProfile>({
    name: currentUser?.name?.split(' ')[0] || '',
    email: currentUser?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const status_color = {
    'pending': 'text-yellow-600 bg-yellow-50',
    'processing': 'text-blue-600 bg-blue-50',
    'shipped': 'text-orange-600 bg-orange-50',
    'delivered': 'text-green-600 bg-green-50',
    'cancelled': 'text-red-600 bg-red-50'
  };

  const getOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
        withCredentials: true
      });
      setOrders(response.data);
    }
    catch (error) {
      setOrders([]);
    }
  }

  const getUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/isLoggedin`, {
        withCredentials: true
      });
      setAddress(response.data.user.address || { street: '', city: '', state: '', zipCode: '', country: '' });
      setUser(response.data.user);
      const lastUpdateDate = new Date(response.data.user.lastUpdate);
      const diffMs = Date.now() - lastUpdateDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      setLastUpdate(diffDays);
    }
    catch (error){
      setUser(null);
    }
  }

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

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    getOrders();
    getUser();
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setPreviewImage(parsedProfile.profilePicture || '');
    }
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'wishlist', name: 'Wishlist', icon: HeartIcon },
    { id: 'addresses', name: 'Addresses', icon: MapPinIcon },
    { id: 'profile', name: 'Profile', icon: CogIcon },
    { id: 'security', name: 'Security', icon: BellIcon }
  ];

  const handleProfileSave = async () => {
    if (!user.name || !user || !user.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    const updatedUser = await axios.put(`${import.meta.env.VITE_API_URL}/update-profile`, user, { withCredentials: true }).then(res => res.data).catch(err => toast.error(err.response?.data?.error || 'Failed to update profile'));
    toast.success('Profile updated successfully!');
    setUser(updatedUser.user);

    localStorage.setItem('userProfile', JSON.stringify(updatedUser.user));
  };

  const handleChangePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/change-password`, { oldPassword: password.currentPassword, newPassword: password.newPassword }, {
        withCredentials: true
      });
      toast.success(res.data.message);
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setProfile(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditAddress = async (addr: Address) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/update-profile`, addr, {
        withCredentials: true
      });
      if (!res.data?.user.address) {
        toast.error('Failed to get updated address from server');
        return;
      }
      setAddress(res.data.user.address);
      setOnClickEditAddress(false);
      localStorage.setItem('userAddresses', JSON.stringify(res.data.user.address));
      toast.success('Address updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update address');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <ShoppingBagIcon className="h-10 w-10 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Wishlist Items</p>
                    <p className="text-2xl font-bold">{wishlistState.items.length}</p>
                  </div>
                  <HeartIcon className="h-10 w-10 text-red-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Cart Items</p>
                    <p className="text-2xl font-bold">{cartState.items.length}</p>
                  </div>
                  <ShoppingBagIcon className="h-10 w-10 text-green-200" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{"ORD-" + order._id.toString().slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.date)} • {order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{order.totalAmount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status_color[order.status.toLowerCase()]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

        case 'orders':
          return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order History</h3>

              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const isExpanded = viewDetails === order._id;

                    return (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {"ORD-" + order._id.toString().slice(-6).toUpperCase()}
                            </h4>
                            <p className="text-sm text-gray-600">Placed on {formatDate(order.date)}</p>
                          </div>
                          <span
                            className={`mt-2 sm:mt-0 inline-block px-3 py-1 rounded-full text-sm font-medium ${status_color[order.status.toLowerCase()]}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Summary */}
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">{order.items.length} items</p>
                          <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 border-t pt-4 space-y-3">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={item.productId?.images?.[0]}
                                    alt={item.productId?.name}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <div>
                                    <p className="text-gray-900 font-medium">{item.productId?.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="text-gray-900 font-semibold">₹{item.productId?.price}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            onClick={() => setViewDetails(isExpanded ? false : order._id)}
                          >
                            {isExpanded ? 'Hide Details' : 'View Details'}
                          </button>
                          {order.trackingLink ? (
                            <button
                              type="button"
                              onClick={() => window.open(order.trackingLink, "_blank")}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all"
                            >
                              Track Order
                            </button>
                          ) : (
                            <span className="text-gray-500 italic">Will confirm your order soon</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );

      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>

            {/* Profile Picture */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 h-6 w-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors">
                    <CameraIcon className="h-3 w-3 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={user.phone ? String(user.phone) : ''}
                  onChange={(e) => setUser(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().slice(0, 10) : ''}
                  onChange={(e) => setUser(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={user.gender}
                  onChange={(e) => setUser(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleProfileSave}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Password</h4>
                  <p className="text-sm text-gray-600">Last updated {lastUpdate.toString()} {lastUpdate != 1 ? "days" : "day"} ago</p>
                </div>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Change Password
                </button>
              </div>

              {showPasswordChange && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={password.currentPassword}
                        onChange={(e) => setPassword(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.current ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={password.newPassword}
                        onChange={(e) => setPassword(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.new ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={password.confirmPassword}
                        onChange={(e) => setPassword(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => setShowPasswordChange(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

        case 'addresses':
          return onClickEditAddress ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Edit Address UI */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => setAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {handleEditAddress(address);}}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Save Address
                </button>
                <button
                  onClick={() => setOnClickEditAddress(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Display Saved Address */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Saved Address</h3>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                <p className="text-sm text-gray-600">
                  {address.street}<br />
                  {address.city}, {address.state} {address.zipCode}<br />
                  {address.country}
                </p>
                <button
                  onClick={() => setOnClickEditAddress(true)}
                  className="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          );

      case 'wishlist':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">My Wishlist</h3>
            {wishlistState.items.length === 0 ? (
              <div className="text-center py-12">
                <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your wishlist is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistState.items.map((item) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                    <img src={item.images[0]} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                    <p className="text-orange-600 font-semibold">${item.price}</p>
                    <button className="w-full mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="h-20 w-20 mx-auto rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-3">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </motion.button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
