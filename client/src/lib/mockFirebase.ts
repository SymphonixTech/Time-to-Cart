
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

export const collection = (name: string) => ({ name });
export const getDocs = async (query: any) => ({ docs: [] });
export const query = (collection: any, ...conditions: any[]) => collection;
export const orderBy = (field: string, direction?: string) => ({ field, direction });
export const limit = (count: number) => ({ count });
export const addDoc = async (collection: any, data: any) => ({ id: Date.now().toString() });

export const db = mockDb;
export const auth = mockAuth;
export const storage = {};
