export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface CartItem {
  id: string;
  product: string;
  quantity: number;
}

export interface User {
  id: string;
  _id: string;
  email: string;
  password: string;
  name: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer not to say';
  phone?: string;
  address?: Address;
  lastUpdate?: Date;
  role: 'user' | 'admin';
  verifyOTP?: string | null;
  isVerified: boolean;
  verifyOTPExpiry?: Date | null;
  verifyToken?: string | null;
  verifyTokenExpiry?: Date | null;
  subscription: boolean;
  cart: CartItem[];
  wishlist: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  _id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: [string];
  category: string;
  rating: number;
  reviews: { userId: User; comment: string; rating: number; date: Date }[];
  stockQuantity: number;
  sales?: number;
  features?: string[];
  status?: 'featured' | 'bestseller' | 'new' | 'sale' | 'trending';
  createdAt?: Date;
  updatedAt?: Date;
  deliveryInfo: {
    freeDelivery: boolean;
    estimatedDays: number;
    returnPolicy: string;
  };
  specifications: {
    Material: string;
    Dimensions: string;
    Weight: string;
    Burn_Time: string;
    Scent: string;
  };
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  addToSliders: boolean;
  addToTopCard: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  customerInfo: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  createdAt: Date;
}

export interface StoreSettings {
  name: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}
