

// Mock Firebase service for development
export const mockDb = {
  products: [],
  users: [],
  orders: []
};

export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(null);
    return () => {};
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    return { user: { email, uid: Date.now().toString() } };
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    return { user: { email, uid: Date.now().toString() } };
  },
  signOut: async () => {
    return Promise.resolve();
  }
};

// Mock Firestore functions
export const collection = (name: string) => ({ name, _collection: true });

export const getDocs = async (query: any) => {
  // Return sample products for admin
  const sampleProducts = [
    {
      id: 'sample_1',
      name: 'Luxury Gradient Candles',
      title: 'Luxury Gradient Candles',
      description: 'Elegant ombre candles with beautiful red-to-white gradient.',
      price: 45.99,
      originalPrice: 55.99,
      discount: 18,
      imageUrl: '/images/candles/candle-collection-1.png',
      category: 'Scented Candles',
      stock: 15,
      createdAt: new Date()
    },
    {
      id: 'sample_2',
      name: 'Vanilla Spice Warmth',
      title: 'Vanilla Spice Warmth',
      description: 'Warm and inviting vanilla spice candles.',
      price: 38.99,
      originalPrice: 47.99,
      discount: 19,
      imageUrl: '/images/candles/candle-collection-2.png',
      category: 'Scented Candles',
      stock: 30,
      createdAt: new Date()
    },
    {
      id: 'sample_3',
      name: 'French Lavender Elegance',
      title: 'French Lavender Elegance',
      description: 'Premium French lavender scented candles.',
      price: 48.99,
      originalPrice: 58.99,
      discount: 17,
      imageUrl: '/images/candles/candle-collection-3.png',
      category: 'Aromatherapy',
      stock: 22,
      createdAt: new Date()
    }
  ];

  return {
    docs: sampleProducts.map(product => ({
      id: product.id,
      data: () => product
    })),
    empty: false,
    size: sampleProducts.length,
    forEach: (callback: any) => {
      sampleProducts.forEach((product, index) => {
        callback({ id: product.id, data: () => product }, index);
      });
    },
    map: (callback: any) => sampleProducts.map((product, index) => 
      callback({ id: product.id, data: () => product }, index)
    )
  };
};

export const query = (collection: any, ...conditions: any[]) => ({
  ...collection,
  _query: true,
  conditions
});

export const orderBy = (field: string, direction?: string) => ({ 
  field, 
  direction,
  _orderBy: true 
});

export const limit = (count: number) => ({ 
  count,
  _limit: true 
});

export const addDoc = async (collection: any, data: any) => {
  console.log('Mock addDoc called:', { collection: collection.name, data });
  return { 
    id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    _doc: true
  };
};

export const doc = (db: any, collection: string, id: string) => ({
  id,
  collection,
  _doc: true
});

export const getDoc = async (docRef: any) => {
  return {
    exists: () => false,
    data: () => null,
    id: docRef.id
  };
};

export const updateDoc = async (docRef: any, data: any) => {
  console.log('Mock updateDoc called:', { docRef, data });
  return Promise.resolve();
};

export const deleteDoc = async (docRef: any) => {
  console.log('Mock deleteDoc called:', { docRef });
  return Promise.resolve();
};

export const where = (field: string, operator: string, value: any) => ({
  field,
  operator,
  value,
  _where: true
});

export const db = mockDb;
export const auth = mockAuth;
export const storage = {};

export default {
  auth: mockAuth,
  db: mockDb,
  storage: {}
};
