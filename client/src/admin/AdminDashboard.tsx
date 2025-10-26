import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Product } from '../types';
import AdminLayout from './AdminLayout';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product>([]);
  const [orders, setOrders] = useState([] as any[]);
  const [recentOrders, setRecentOrders] = useState([] as any[]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [orderChange, setOrderChange] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);
  const [pendingChange, setPendingChange] = useState(0);
  const [productChange, setProductChange] = useState(0);
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {withCredentials: true});
      const prods = res.data;
      setProducts(prods);
    } catch (error:any) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`, {withCredentials: true});
      const ords = res.data;
      const sortedOrders = ords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const recent = sortedOrders.slice(0, 5);
      setOrders(ords);
      setRecentOrders(recent);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);
  
  useEffect(() => {
    const prodNum = products.length;
    const ordNum = orders.length;
    const confirmedOrders = orders.filter(ord => ord.status !== 'pending');
    const totRevenue = confirmedOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
    const pendOrders = ordNum - confirmedOrders.length;
    setStats({
      totalProducts: prodNum,
      totalOrders: ordNum,
      totalRevenue: totRevenue,
      pendingOrders: pendOrders
    });
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    
    const thisMonthOrders = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    
    const lastMonthOrders = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    const pendingOrdersThisMonth = thisMonthOrders.filter(o => o.status === 'pending').length;
    const pendingOrdersLastMonth = lastMonthOrders.filter(o => o.status === 'pending').length;
    
    const pendingChangeValue = pendingOrdersLastMonth > 0
      ? ((pendingOrdersThisMonth - pendingOrdersLastMonth) / pendingOrdersLastMonth) * 100
      : 0;
    setPendingChange(pendingChangeValue);

    const productsLastMonth = products.filter(p => new Date(p.createdAt).getMonth() === lastMonth).length;
    const productChangeValue = productsLastMonth > 0
      ? ((products.length - productsLastMonth) / productsLastMonth) * 100
      : 0;
    setProductChange(productChangeValue);
    
    const revenueThisMonth = thisMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const revenueLastMonth = lastMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    const orderCountThisMonth = thisMonthOrders.length;
    const orderCountLastMonth = lastMonthOrders.length;
    
    const revenueChangeValue = revenueLastMonth > 0
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
      : 0;
    setRevenueChange(revenueChangeValue);
    const orderChangeValue = orderCountLastMonth > 0
      ? ((orderCountThisMonth - orderCountLastMonth) / orderCountLastMonth) * 100
      : 0;
    setOrderChange(orderChangeValue);
  }, [products, orders]);

  const RupeeIcon = () => <span className="text-white text-lg font-bold">₹</span>;

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: CubeIcon,
      color: getChangeColor(productChange),
      change: productChange >= 0 ? `+${productChange.toFixed(1)}%` : `${productChange.toFixed(1)}%`,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBagIcon,
      color: getChangeColor(orderChange),
      change: orderChange >= 0 ? `+${orderChange.toFixed(1)}%` : `${orderChange.toFixed(1)}%`,
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      icon: RupeeIcon,
      color: getChangeColor(revenueChange),
      change: revenueChange >= 0 ? `+${revenueChange.toFixed(1)}%` : `${revenueChange.toFixed(1)}%`,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: ClockIcon,
      color: getChangeColor(pendingChange),
      change: pendingChange >= 0 ? `+${pendingChange.toFixed(1)}%` : `${pendingChange.toFixed(1)}%`,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${stat.color}`} />
                <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {"ORD-" + order._id.toString().slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.userId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.userId?.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.userId?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
