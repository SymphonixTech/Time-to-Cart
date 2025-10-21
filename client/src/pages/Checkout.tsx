import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useLoading } from '../context/LoadingContext';

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const [qrData, setQrData] = useState<{ qrCode: string; } | null>(null);
  const [txnId, setTxnId] = useState('');
  const [hasGeneratedQR, setHasGeneratedQR] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const API_URL = import.meta.env.VITE_API_URL;

  const generateQRCode = async () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const amount = state.total * 1.18; // Convert to INR + tax

      const payload = {
        amount,
        paymentMethod: 'UPI'
      };

      const res = await axios.post(`${API_URL}/payment`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data?.success) {
        setQrData({ qrCode: res.data.qrCode });
        setHasGeneratedQR(true);
        toast.success('Scan the QR to complete payment');
      } else {
        toast.error('Failed to generate payment QR');
      }
    } catch (error) {
      console.error('Error generating QR:', error);
      toast.error('Something went wrong while creating payment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!txnId) {
      toast.error('Please enter your transaction ID');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/verify-upi-payment`, {
        txnId,
        formData,
        items: state.items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        amount: state.total * 1.18,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success('Payment verified! Order placed successfully.');
        clearCart();
        navigate('/', { replace: true });
      } else {
        toast.error('Failed to verify payment.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side – QR and payment */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {!hasGeneratedQR ? (
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Generate Payment QR
                </h2>
                <p className="text-gray-600 mb-6">
                  Click below to generate your secure UPI QR for payment.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateQRCode}
                  className="w-full btn-primary py-4 text-lg font-medium"
                >
                  Generate QR
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPayment} className="text-center space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Scan & Complete Payment
                </h2>
                <img
                  src={qrData.qrCode}
                  alt="UPI QR Code"
                  className="mx-auto w-60 h-60 border rounded-lg shadow-sm"
                />
                {isMobile ? (
                  <a href={paymentData.upiLink} className="btn btn-primary">
                    Pay Using UPI App
                  </a>
                )}
                <p className="text-gray-600 text-sm">
                  Scan the QR using your UPI app and complete the payment.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Transaction ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TXN12345678"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    required
                    className="input w-full"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">Shipping Address</h3>
                <span className="block text-sm text-gray-500 italic mt-2">
                  Note: You can skip this section if your shipping address is the same as the one used during registration.
                </span>
                <div className="space-y-3 mb-6">
                  {['street', 'city', 'state', 'zipCode'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {field.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <input
                        type='text'
                        name={field}
                        value={FormData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        placeholder={`Enter ${field}`}
                        className="input w-full"
                      />
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-primary py-4 text-lg font-medium"
                >
                  <CreditCardIcon className="w-6 h-6 mr-2" />
                  Place Order
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Right side – order summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{(state.total).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{(state.total * 0.18).toFixed(0)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{(state.total * 1.18).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
                  Secure payment processing
                </div>
                <div className="flex items-center">
                  <TruckIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Free shipping on all orders
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;






// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { CreditCardIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../lib/firebase';
// import { useCart } from '../context/CartContext';
// import { useLoading } from '../context/LoadingContext';
// import toast from 'react-hot-toast';

// interface CheckoutForm {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   cardNumber: string;
//   expiryDate: string;
//   cvv: string;
// }

// const Checkout: React.FC = () => {
//   const { state, clearCart } = useCart();
//   const { setLoading } = useLoading();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<CheckoutForm>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (state.items.length === 0) {
//       toast.error('Your cart is empty');
//       return;
//     }

//     setLoading(true);

//     try {
//       // Create order in Firestore
//       const order = {
//         items: state.items,
//         total: state.total * 1.08, // Including tax
//         status: 'pending',
//         customerInfo: {
//           name: `${formData.firstName} ${formData.lastName}`,
//           email: formData.email,
//           phone: formData.phone,
//           address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
//         },
//         createdAt: new Date(),
//       };

//       await addDoc(collection(db, 'orders'), order);

//       // Clear cart
//       clearCart();

//       toast.success('Order placed successfully!');
//       navigate('/', { replace: true });

//     } catch (error) {
//       console.error('Error placing order:', error);
//       toast.error('Failed to place order. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (state.items.length === 0) {
//     navigate('/cart', { replace: true });
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
//           <p className="text-gray-600 mt-2">Complete your purchase</p>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Checkout Form */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Personal Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       First Name
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       required
//                       value={formData.firstName}
//                       onChange={handleInputChange}
//                       className="input"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Last Name
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       required
//                       value={formData.lastName}
//                       onChange={handleInputChange}
//                       className="input"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       required
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="input"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       required
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className="input"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Shipping Address */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       name="address"
//                       required
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       className="input"
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         name="city"
//                         required
//                         value={formData.city}
//                         onChange={handleInputChange}
//                         className="input"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         State
//                       </label>
//                       <input
//                         type="text"
//                         name="state"
//                         required
//                         value={formData.state}
//                         onChange={handleInputChange}
//                         className="input"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         ZIP Code
//                       </label>
//                       <input
//                         type="text"
//                         name="zipCode"
//                         required
//                         value={formData.zipCode}
//                         onChange={handleInputChange}
//                         className="input"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Card Number
//                     </label>
//                     <input
//                       type="text"
//                       name="cardNumber"
//                       required
//                       placeholder="1234 5678 9012 3456"
//                       value={formData.cardNumber}
//                       onChange={handleInputChange}
//                       className="input"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Expiry Date
//                       </label>
//                       <input
//                         type="text"
//                         name="expiryDate"
//                         required
//                         placeholder="MM/YY"
//                         value={formData.expiryDate}
//                         onChange={handleInputChange}
//                         className="input"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         CVV
//                       </label>
//                       <input
//                         type="text"
//                         name="cvv"
//                         required
//                         placeholder="123"
//                         value={formData.cvv}
//                         onChange={handleInputChange}
//                         className="input"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 className="w-full btn-primary py-4 text-lg font-medium"
//               >
//                 <CreditCardIcon className="w-6 h-6 mr-2" />
//                 Place Order
//               </motion.button>
//             </form>
//           </motion.div>

//           {/* Order Summary */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

//               <div className="space-y-4 mb-6">
//                 {state.items.map((item) => (
//                   <div key={item.id} className="flex items-center space-x-3">
//                     <img
//                       src={item.product.images[0]}
//                       alt={item.product.name}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
//                       <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                     </div>
//                     <p className="text-sm font-medium text-gray-900">
//                       ₹{(state.total * 80 * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal</span>
//                   <span>₹{(state.total * 80).toFixed(0)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Shipping</span>
//                   <span>Free</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Tax</span>
//                   <span>₹{(state.total * 80 * 0.18).toFixed(0)}</span>
//                 </div>
//                 <div className="border-t pt-3">
//                   <div className="flex justify-between text-lg font-bold text-gray-900">
//                     <span>Total</span>
//                     <span>₹{(state.total * 80 * 1.18).toFixed(0)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Trust Indicators */}
//               <div className="space-y-3 text-sm text-gray-600">
//                 <div className="flex items-center">
//                   <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
//                   Secure payment processing
//                 </div>
//                 <div className="flex items-center">
//                   <TruckIcon className="w-5 h-5 mr-2 text-blue-600" />
//                   Free shipping on all orders
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
