import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AdminLayout from './AdminLayout';
import BagLoader from './components/BagLoader';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Order } from './lib/mongoService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('');

  const orderStatuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${(import.meta as any).env.VITE_API_URL}/admin/orders`, { withCredentials: true });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const downloadOrdersCSV = () => {
    let filteredOrders = orders;

    // Apply filters
    if (statusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    if (productFilter) {
      filteredOrders = filteredOrders.filter(order =>
        order.items.some(item =>
          item.name.toLowerCase().includes(productFilter.toLowerCase())
        )
      );
    }

    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.createdAt) >= startDate
      );
    }

    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999);
      filteredOrders = filteredOrders.filter(order =>
        new Date(order.createdAt) <= endDate
      );
    }

    const headers = ['Order ID', 'Customer Name', 'Email', 'Products', 'Total', 'Status', 'Order Date', 'Shipping Address'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id,
        `"${order.userId.name}"`,
        order.userId.email,
        `"${order.items.map(item => `${item.productId.name} (${item.quantity})`).join('; ')}"`,
        order.totalAmount.toFixed(2),
        order.status,
        new Date(order.date).toLocaleDateString(),
        `"${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${statusFilter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported successfully');
  };

  // const filteredOrders = orders.filter(order => {
  //   const matchesSearch = order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        "ORD-" + (order._id ?? '').toString().slice(-6).toUpperCase().toLowerCase().includes(searchTerm.toLowerCase());

  //   if (statusFilter !== 'all' && order.status !== statusFilter) return false;

  //   if (productFilter) {
  //     const matchesProduct = order.items.some(item =>
  //       item.name.toLowerCase().includes(productFilter.toLowerCase())
  //     );
  //     if (!matchesProduct) return false;
  //   }

  //   return matchesSearch;
  // });

  const filteredOrders = React.useMemo(() => {
  return orders.filter(order => {
    const matchesSearch = order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `ORD-${(order._id ?? '').toString().slice(-6).toUpperCase()}`.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter !== 'all' && order.status !== statusFilter) return false;

    if (productFilter) {
      const matchesProduct = order.items.some(item =>
        item.name.toLowerCase().includes(productFilter.toLowerCase())
      );
      if (!matchesProduct) return false;
    }

    return matchesSearch;
  });
}, [orders, searchTerm, statusFilter, productFilter]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <BagLoader size="large" text="Loading Orders..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-2">Manage customer orders and shipments</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
            <button
              onClick={downloadOrdersCSV}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Export Orders
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm border space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                  <input
                    type="text"
                    placeholder="Filter by product..."
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by customer name, email, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
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
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {"ORD-" + (order._id ?? '').toString().slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.userId.name}</div>
                        <div className="text-sm text-gray-500">{order.userId.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.map(item => (
                          <div key={item.productId._id} className="mb-1">
                            {item.productId.name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
