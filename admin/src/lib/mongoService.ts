// Mock MongoDB service for admin operations with sample data
export interface Product {
  _id?: string;
  id?: string;
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
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  images: string[];
  stockQuantity: number;
}

export interface User {
  email: string;
  password: string;
  _id?: string;
  id?: string;
  name: string;
  dateOfBirth: Date,
  role: 'admin' | 'user';
  gender: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  lastUpdated: Date;
  verifyOTP: string;
  isVerified: boolean;
  verifyOTPExpiry: Date;
  verifyToken: string;
  verifyTokenExpiry: Date;
  subscription: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  _id?: string;
  id?: string;
  userId: User;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: Product;
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

// Sample data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Luxury Gradient Candles',
    title: 'Luxury Gradient Candles',
    description: 'Elegant ombre candles with beautiful red-to-white gradient. Perfect for romantic dinners and special occasions.',
    price: 45.99,
    originalPrice: 55.99,
    discount: 18,
    imageUrl: '/images/candles/candle-collection-1.png',
    category: 'Candles',
    subcategory: 'Scented Candles',
    stock: 15,
    features: ['Hand-dipped gradient', 'Premium wax blend', 'Romantic ambiance', 'Long burn time'],
    status: 'featured',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Vanilla Spice Warmth',
    title: 'Vanilla Spice Warmth',
    description: 'Warm and inviting vanilla spice candles that fill your space with cozy comfort.',
    price: 38.99,
    originalPrice: 47.99,
    discount: 19,
    imageUrl: '/images/candles/candle-collection-2.png',
    category: 'Candles',
    subcategory: 'Scented Candles',
    stock: 30,
    features: ['Vanilla spice blend', 'Cozy atmosphere', 'Premium wax', 'Long-lasting'],
    status: 'bestseller',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    name: 'Citrus Burst Energy',
    title: 'Citrus Burst Energy',
    description: 'Energizing citrus candles that invigorate your senses and brighten your day.',
    price: 41.99,
    originalPrice: 51.99,
    discount: 19,
    imageUrl: '/images/candles/candle-collection-3.png',
    category: 'Candles',
    subcategory: 'Aromatherapy',
    stock: 28,
    features: ['Citrus blend', 'Energizing scent', 'Mood lifting', 'Bright colors'],
    status: 'new',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '4',
    name: 'Sacred Oil Lamp',
    title: 'Sacred Oil Lamp',
    description: 'Traditional brass oil lamp for spiritual practices and religious ceremonies.',
    price: 35.00,
    originalPrice: 45.00,
    discount: 22,
    imageUrl: '/images/candles/candle-collection-4.png',
    category: 'Religious Items',
    stock: 10,
    features: ['Brass construction', 'Traditional design', 'Spiritual practices', 'Handcrafted'],
    status: 'active',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '5',
    name: 'Premium Gift Box',
    title: 'Premium Gift Box',
    description: 'Elegant gift box containing a curated selection of premium items.',
    price: 65.00,
    originalPrice: 80.00,
    discount: 19,
    imageUrl: '/images/candles/candle-collection-5.png',
    category: 'Gifts',
    stock: 15,
    features: ['Curated selection', 'Premium packaging', 'Special occasions', 'Elegant presentation'],
    status: 'active',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  }
];

const sampleOrders: Order[] = [
  {
    id: '1',
    userId: 'user_001',
    items: [
      {
        productId: '1',
        name: 'Luxury Gradient Candles',
        price: 45.99,
        quantity: 2,
        imageUrl: '/images/candles/candle-collection-1.png'
      }
    ],
    total: 91.98,
    status: 'delivered',
    customerInfo: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1-555-0123'
    },
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '2',
    userId: 'user_002',
    items: [
      {
        productId: '2',
        name: 'Vanilla Spice Warmth',
        price: 38.99,
        quantity: 1,
        imageUrl: '/images/candles/candle-collection-2.png'
      },
      {
        productId: '3',
        name: 'Citrus Burst Energy',
        price: 41.99,
        quantity: 1,
        imageUrl: '/images/candles/candle-collection-3.png'
      }
    ],
    total: 80.98,
    status: 'shipped',
    customerInfo: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1-555-0124'
    },
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '3',
    userId: 'user_003',
    items: [
      {
        productId: '5',
        name: 'Premium Gift Box',
        price: 65.00,
        quantity: 1,
        imageUrl: '/images/candles/candle-collection-5.png'
      }
    ],
    total: 65.00,
    status: 'processing',
    customerInfo: {
      name: 'Carol Davis',
      email: 'carol@example.com',
      phone: '+1-555-0125'
    },
    shippingAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60001',
      country: 'USA'
    },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19')
  }
];

class MongoService {
  private products: Product[] = [...sampleProducts];
  private orders: Order[] = [...sampleOrders];

  // Products
  async getProducts(): Promise<Product[]> {
    console.log('Mock: Fetching products...');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.products;
  }

  async createProduct(product: Omit<Product, '_id' | 'id'>): Promise<Product> {
    console.log('Mock: Creating product...', product);
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    console.log('Mock: Updating product...', id, product);
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...product, updatedAt: new Date() };
      return this.products[index];
    }
    throw new Error('Product not found');
  }

  async deleteProduct(id: string): Promise<void> {
    console.log('Mock: Deleting product...', id);
    this.products = this.products.filter(p => p.id !== id);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    console.log('Mock: Fetching orders...');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.orders;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    console.log('Mock: Updating order status...', id, status);
    const index = this.orders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], status, updatedAt: new Date() };
      return this.orders[index];
    }
    throw new Error('Order not found');
  }
}

export const mongoService = new MongoService();
