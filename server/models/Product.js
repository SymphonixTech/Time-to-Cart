import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  images: [{
    type: String,
    // required: true,
  }],
  category: {
    type: String,
    enum: ['Candles', 'Religious Products', 'Kids Stationery', 'Gifts'],
    required: true,
  },
  subcategory: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },
  sales: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [{
    id: {
      type: Number,
      default: 0,
    },
    userId: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  deliveryInfo: {
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    estimatedDays: Number,
    returnPolicy: String
  },
  specifications: {
    Material: String,
    Dimensions: String,
    Weight: String,
    Burn_Time: String,
    Scent: String,
  },
  bestSeller: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['new', 'sale', 'discounted', 'featured', 'bestseller', 'trending'],
    default: 'new'
  }
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
