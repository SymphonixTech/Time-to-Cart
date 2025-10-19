import mongoose from 'mongoose';
import User from './User.js';
import Order from './Order.js';

const ContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  email:{
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  images: [{
    type: String,
    // required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  response: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
