import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as UserType } from '../types';
import axios from 'axios';

type User = {
  uid: string;
  email: string;
  role: 'user' | 'admin';
};

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const api = (import.meta as any).env.VITE_API_URL;

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${api}/admin/login`, 
        { email, password },
        { withCredentials: true }
      );
      const user = response.data.user;
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await axios.get(`${api}/admin/logout`, { withCredentials: true });
    setCurrentUser(null);
  }

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${api}/admin/isLoggedin`, { withCredentials: true });
        const user = res.data.user;
        setCurrentUser(user);
        setLoading(false);
      }
      catch (error) {
        setCurrentUser(null);
        setLoading(false);
      }
    }
    fetchAdmin();
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
