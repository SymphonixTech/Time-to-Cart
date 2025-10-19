import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import axios from 'axios';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminRegister: (firstName: string, email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const api = (import.meta as any).env.VITE_API_URL;

  const adminLogin = async (email: string, password: string) => {
    const res = await axios.post(`${api}/admin/login`, { email, password }, { withCredentials: true });
    const user = res.data.user;
    setCurrentUser(user);
  }

  const adminRegister = async (firstName: string, email: string, password: string) => {
    const res = axios.post(`${api}/admin/register`, { name: firstName, email, password }, { withCredentials: true });
    const user = (await res).data.user;
    setCurrentUser(user);
  }

  const adminLogout = async () => {
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
    user: currentUser,
    adminLogin,
    adminRegister,
    adminLogout,
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
