
export interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  category: string;
  subcategory?: string;
  stock: number;
  features?: string[];
  createdAt: Date;
  updatedAt?: Date;
  status?: string;
}

export interface Product1 {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  inStock?: boolean;
  stockQuantity: number;
  sales?: number;
  featured?: boolean;
  tags?: string[];
  rating?: number;
  deliveryInfo?: {
    freeDelivery?: boolean;
    estimatedDays?: number;
    returnPolicy?: string;
  };
  specifications?: {
    Material?: string;
    Dimensions?: string;
    Weight?: string;
    Burn_Time?: string;
    Scent?: string;
  };
  bestSeller?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}
