import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState(false);
  const [viewDetails, setViewDetails] = useState<string | boolean>(false);
  const [phone, setPhone] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`, { withCredentials: true });
      setOrders(res.data);
      toast.success('✅ Orders loaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '❌ Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, { status }, { withCredentials: true });
      setOrders(prev =>
        prev.map(order => (order._id === orderId ? { ...order, status } : order))
      );
      toast.success(`✅ Order updated to "${status}"`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || '❌ Failed to update order');
    }
  };

  const handleSubmit = async (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/delivery`,
        { trackingLink: link, deliveryPhone: phone },
        { withCredentials: true }
      );
      toast.success('📦 Delivery details updated');
      setPhone('');
      setLink('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || '❌ Request failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  filter === status ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
            <button
              onClick={() => setView(!view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                view ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {view ? 'Hide Orders' : 'View Orders'}
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            {!view ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID', 'Customer', 'Phone', 'Date', 'Address', 'Total', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {"ORD-" + order._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.userId?.name}</div>
                        <div className="text-sm text-gray-500">{order.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.userId?.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-black"
                        >
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((statusOption) => (
                            <option key={statusOption} value={statusOption}>{statusOption}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Detailed view */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Details</h3>

                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet.</p>
                ) : (
                  <div className="space-y-6">
                    {(viewDetails ? orders.filter(o => o._id === viewDetails) : orders).map((order) => {
                      const isExpanded = viewDetails === order._id;
                      return (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {"ORD-" + order._id.toString().slice(-6).toUpperCase()}
                              </h4>
                              <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="flex justify-between mb-2">
                            <p className="text-sm text-gray-600">{order.items.length} items</p>
                            <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                          </div>

                          {isExpanded && (
                            <div className="mt-4 border-t pt-4 space-y-3">
                              {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center">
                                  <div className="flex items-center space-x-3">
                                    <img src={item.productId?.images?.[0]} alt={item.productId?.name} className="w-12 h-12 rounded object-cover" />
                                    <div>
                                      <p className="text-gray-900 font-medium">{item.productId?.name}</p>
                                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <p className="text-gray-900 font-semibold">₹{item.productId?.price}</p>
                                </div>
                              ))}

                              {!order.trackingLink ? (
                                <form onSubmit={(e) => handleSubmit(e, order._id)} className="space-y-4 mt-4">
                                  <input
                                    type="text"
                                    placeholder="Delivery Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Tracking Link"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black"
                                  />
                                  <button
                                    type="submit"
                                    disabled={!link || !phone}
                                    className={`w-full py-2 rounded-lg font-medium transition-colors duration-200 ${
                                      !link || !phone ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                  >
                                    Submit
                                  </button>
                                </form>
                              ) : (
                                <button
                                  onClick={() => window.open(order.trackingLink, '_blank')}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                                >
                                  Track Order
                                </button>
                              )}
                            </div>
                          )}

                          <button
                            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            onClick={() => setViewDetails(isExpanded ? false : order._id)}
                          >
                            {isExpanded ? 'Back to Orders' : 'View Details'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;






// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import AdminLayout from './AdminLayout';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// const AdminOrders: React.FC = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState('all');
//   const [view, setView] = useState(false);
//   const [viewDetails, setViewDetails] = useState<string | boolean>(false);
//   const [phone, setPhone] = useState('');
//   const [link, setLink] = useState('');

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//   };

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`, { withCredentials: true });
//       setOrders(res.data);
//       toast.success('✅ Orders loaded successfully');
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || '❌ Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId: string, status: string) => {
//     try {
//       await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, { status }, { withCredentials: true });
//       setOrders(prev =>
//         prev.map(order => (order._id === orderId ? { ...order, status } : order))
//       );
//       toast.success(`✅ Order updated to "${status}"`);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || '❌ Failed to update order');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent, orderId: string) => {
//     e.preventDefault();
//     try {
//       await axios.put(
//         `${import.meta.env.VITE_API_URL}/orders/${orderId}/delivery`,
//         { trackingLink: link, deliveryPhone: phone },
//         { withCredentials: true }
//       );
//       toast.success('📦 Delivery details updated');
//       setPhone('');
//       setLink('');
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || '❌ Request failed');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'confirmed': return 'bg-blue-100 text-blue-800';
//       case 'shipped': return 'bg-purple-100 text-purple-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const filteredOrders = orders.filter(order =>
//     filter === 'all' || order.status === filter
//   );

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
//           <p className="text-gray-600 mt-2">Manage customer orders</p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <div className="flex flex-wrap gap-2">
//             {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
//               <button
//                 key={status}
//                 onClick={() => setFilter(status)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
//                   filter === status ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {status}
//               </button>
//             ))}
//             <button
//               onClick={() => setView(!view)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
//                 view ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               {view ? 'Hide Orders' : 'View Orders'}
//             </button>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-sm border overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {['Order ID', 'Customer', 'Phone', 'Date', 'Address', 'Total', 'Status', 'Actions'].map((h) => (
//                     <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
//                   ))}
//                 </tr>
//               </thead>

//               {!view && 
//                 (
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredOrders.map((order) => (
//                       <tr key={order._id}>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                           {"ORD-" + order._id.toString().slice(-6).toUpperCase()}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900">{order.userId?.name}</div>
//                           <div className="text-sm text-gray-500">{order.userId?.email}</div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{order.userId?.phone}</td>
//                         <td className="px-6 py-4 text-sm text-gray-900">{formatDate(order.createdAt)}</td>
//                         <td className="px-6 py-4 text-sm text-gray-500">
//                           {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
//                         </td>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
//                         <td className="px-6 py-4">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-sm">
//                           <select
//                             value={order.status}
//                             onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                             className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-black"
//                           >
//                             {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((statusOption) => (
//                               <option key={statusOption} value={statusOption}>{statusOption}</option>
//                             ))}
//                           </select>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )
//           }

//           {/* Detailed view */}
//           {view && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Details</h3>
//               {orders.length === 0 ? (
//                 <p className="text-gray-500 text-center py-8">No orders yet.</p>
//               ) : (
//                 <div className="space-y-6">
//                   {orders.map((order) => {
//                     const isExpanded = viewDetails === order._id;
//                     return (
//                       <div key={order._id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
//                         <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
//                           <div>
//                             <h4 className="font-semibold text-gray-900">
//                               {"ORD-" + order._id.toString().slice(-6).toUpperCase()}
//                             </h4>
//                             <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
//                           </div>
//                           <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </div>

//                         <div className="flex justify-between mb-2">
//                           <p className="text-sm text-gray-600">{order.items.length} items</p>
//                           <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
//                         </div>

//                         {isExpanded && (
//                           <div className="mt-4 border-t pt-4 space-y-3">
//                             {order.items.map((item: any, idx: number) => (
//                               <div key={idx} className="flex justify-between items-center">
//                                 <div className="flex items-center space-x-3">
//                                   <img src={item.productId?.images?.[0]} alt={item.productId?.name} className="w-12 h-12 rounded object-cover" />
//                                   <div>
//                                     <p className="text-gray-900 font-medium">{item.productId?.name}</p>
//                                     <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                                   </div>
//                                 </div>
//                                 <p className="text-gray-900 font-semibold">₹{item.productId?.price}</p>
//                               </div>
//                             ))}

//                             {!order.trackingLink ? (
//                               <form onSubmit={(e) => handleSubmit(e, order._id)} className="space-y-4 mt-4">
//                                 <input
//                                   type="text"
//                                   placeholder="Delivery Phone"
//                                   value={phone}
//                                   onChange={(e) => setPhone(e.target.value)}
//                                   className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black"
//                                 />
//                                 <input
//                                   type="text"
//                                   placeholder="Tracking Link"
//                                   value={link}
//                                   onChange={(e) => setLink(e.target.value)}
//                                   className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-black"
//                                 />
//                                 <button
//                                   type="submit"
//                                   disabled={!link || !phone}
//                                   className={`w-full py-2 rounded-lg font-medium transition-colors duration-200 ${
//                                     !link || !phone ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
//                                   }`}
//                                 >
//                                   Submit
//                                 </button>
//                               </form>
//                             ) : (
//                               <button
//                                 onClick={() => window.open(order.trackingLink, '_blank')}
//                                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
//                               >
//                                 Track Order
//                               </button>
//                             )}
//                           </div>
//                         )}

//                         <button
//                           className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
//                           onClick={() => setViewDetails(isExpanded ? false : order._id)}
//                         >
//                           {isExpanded ? 'Hide Details' : 'View Details'}
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminOrders;
