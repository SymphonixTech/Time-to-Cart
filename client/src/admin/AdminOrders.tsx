
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

// Sample orders data for fallback
const sampleOrders: Order[] = [
  {
    id: 'ORD001',
    userId: 'user1',
    items: [],
    total: 89.99,
    status: 'pending',
    customerInfo: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      address: '123 Main St, New York, NY 10001',
      phone: '+1 (555) 123-4567'
    },
    createdAt: new Date('2025-01-10')
  },
  {
    id: 'ORD002',
    userId: 'user2', 
    items: [],
    total: 156.50,
    status: 'shipped',
    customerInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      phone: '+1 (555) 987-6543'
    },
    createdAt: new Date('2025-01-09')
  },
  {
    id: 'ORD003',
    userId: 'user3',
    items: [],
    total: 234.75,
    status: 'shipped',
    customerInfo: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      address: '789 Pine St, Chicago, IL 60601', 
      phone: '+1 (555) 456-7890'
    },
    createdAt: new Date('2025-01-08')
  },
  {
    id: 'ORD004',
    userId: 'user4',
    items: [],
    total: 67.25,
    status: 'delivered',
    customerInfo: {
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      address: '321 Elm Dr, Miami, FL 33101',
      phone: '+1 (555) 234-5678'
    },
    createdAt: new Date('2025-01-07')
  },
  {
    id: 'ORD005',
    userId: 'user5',
    items: [],
    total: 178.90,
    status: 'pending',
    customerInfo: {
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      address: '654 Maple Ln, Seattle, WA 98101',
      phone: '+1 (555) 345-6789'
    },
    createdAt: new Date('2025-01-06')
  }
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Order[];
      setOrders(ordersData);
      toast.success('Orders loaded successfully');
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.log('Using sample orders data as fallback');
      setOrders(sampleOrders);
      toast.success('Loaded sample orders for demonstration');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      toast.success(`Order ${status} successfully`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  filter === status
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerInfo?.name}</div>
                      <div className="text-sm text-gray-500">{order.customerInfo?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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

export default AdminOrders;
