import { User } from '../types';

// Mock users for demo purposes
const DEMO_USERS = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
    password: 'password123'
  },
  {
    id: 'customer-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer' as const,
    password: 'password123'
  },
  {
    id: 'customer-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer' as const,
    password: 'password123'
  },
  {
    id: 'customer-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'customer' as const,
    password: 'password123'
  }
];

export const mockAuth = {
  currentUser: null as User | null,

  signIn: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    mockAuth.currentUser = userWithoutPassword;
    localStorage.setItem('mockUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  signUp: async (firstName: string, lastName: string, email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser = {
      id: `customer-${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email,
      role: 'customer' as const,
      password
    };

    // Add to demo users (in real app, this would be saved to database)
    DEMO_USERS.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    mockAuth.currentUser = userWithoutPassword;
    localStorage.setItem('mockUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  signOut: async (): Promise<void> => {
    mockAuth.currentUser = null;
    localStorage.removeItem('mockUser');
  },

  getCurrentUser: (): User | null => {
    if (mockAuth.currentUser) return mockAuth.currentUser;

    const stored = localStorage.getItem('mockUser');
    if (stored) {
      mockAuth.currentUser = JSON.parse(stored);
      return mockAuth.currentUser;
    }

    return null;
  }
};