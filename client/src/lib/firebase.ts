
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
export const collection = (db: any, name: string) => ({ name, _collection: true });

export const getDocs = async (query: any) => {
  return {
    docs: [],
    empty: true,
    size: 0,
    forEach: (callback: any) => {},
    map: (callback: any) => []
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
