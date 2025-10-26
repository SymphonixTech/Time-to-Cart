import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, phone: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminRegister: (firstName: string, email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const api = import.meta.env.VITE_API_URL;

  // Helper: Save or clear user from both state & localStorage
  const saveUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  };

  // ---------- AUTH ACTIONS ---------- //

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${api}/login`, { email, password }, { withCredentials: true });
      saveUser(res.data.user);
    } catch (err: any) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${api}/admin/login`, { email, password }, { withCredentials: true });
      saveUser(res.data.user);
    } catch (err: any) {
      console.error('Admin login error:', err);
      throw err;
    }
  };

  const register = async (firstName: string, phone: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${api}/register`, { name: firstName, phone, email, password }, { withCredentials: true });
      saveUser(res.data.user);
    } catch (err: any) {
      console.error('Register error:', err);
      throw err;
    }
  };

  const adminRegister = async (firstName: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${api}/admin/register`, { name: firstName, email, password }, { withCredentials: true });
      saveUser(res.data.user);
    } catch (err: any) {
      console.error('Admin register error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${api}/logout`, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      saveUser(null);
    }
  };

  const adminLogout = async () => {
    try {
      await axios.get(`${api}/admin/logout`, { withCredentials: true });
    } catch (err) {
      console.error('Admin logout error:', err);
    } finally {
      saveUser(null);
    }
  };

  // ---------- FETCH AUTH STATUS ---------- //

  useEffect(() => {
    // Restore user from localStorage immediately to avoid flicker
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const fetchAuthStatus = async () => {
      try {
        let res = await axios.get(`${api}/isLoggedin`, { withCredentials: true });
        if (!res.data?.user) {
          res = await axios.get(`${api}/admin/isLoggedin`, { withCredentials: true });
        }

        if (res.data?.user) {
          saveUser(res.data.user);
        } else {
          saveUser(null);
        }
      } catch (error) {
        console.error('Auth status error:', error);
        saveUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, [api]);

  // ---------- CONTEXT VALUE ---------- //

  const value: AuthContextType = {
    currentUser,
    user: currentUser,
    login,
    register,
    logout,
    adminLogin,
    adminRegister,
    adminLogout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ---------- HOOK ---------- //

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};






// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import axios from 'axios';
// import { User } from '../types';

// interface AuthContextType {
//   currentUser: User | null;
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (firstName: string, phone: string, email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   adminLogin: (email: string, password: string) => Promise<void>;
//   adminRegister: (firstName: string, email: string, password: string) => Promise<void>;
//   adminLogout: () => Promise<void>;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const api = import.meta.env.VITE_API_URL;

//   const login = async (email: string, password: string) => {
//     const res = await axios.post(`${api}/login`, { email, password }, { withCredentials: true });
//     const user = res.data.user;
//     setCurrentUser(user);
//     localStorage.setItem('user', JSON.stringify(user));
//   };

//   const adminLogin = async (email: string, password: string) => {
//     const res = await axios.post(`${api}/admin/login`, { email, password }, { withCredentials: true });
//     const user = res.data.user;
//     setCurrentUser(user);
//     localStorage.setItem('user', JSON.stringify(user));
//   };

//   const register = async (firstName: string, phone: string, email: string, password: string) => {
//     const res = await axios.post(`${api}/register`, { name: firstName, phone, email, password }, { withCredentials: true });
//     const user = res.data.user;
//     setCurrentUser(user);
//     localStorage.setItem('user', JSON.stringify(user));
//   };

//   const adminRegister = async (firstName: string, email: string, password: string) => {
//     const res = await axios.post(`${api}/admin/register`, { name: firstName, email, password }, { withCredentials: true });
//     const user = res.data.user;
//     setCurrentUser(user);
//     localStorage.setItem('user', JSON.stringify(user));
//   };

//   const logout = async () => {
//     try {
//       await axios.get(`${api}/logout`, { withCredentials: true });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setCurrentUser(null);
//       localStorage.removeItem('user');
//     }
//   };

//   const adminLogout = async () => {
//     try {
//       await axios.get(`${api}/admin/logout`, { withCredentials: true });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setCurrentUser(null);
//       localStorage.removeItem('user');
//     }
//   };

//   useEffect(() => {
//     const fetchAuthStatus = async () => {
//       try {
//         let res = await axios.get(`${api}/isLoggedin`, { withCredentials: true });
//         if (!res.data?.user) {
//           res = await axios.get(`${api}/admin/isLoggedin`, { withCredentials: true });
//         }
//         if (res.data?.user) {
//           setCurrentUser(res.data.user);
//         } else {
//           setCurrentUser(null);
//         }
//       } catch (error) {
//         setCurrentUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAuthStatus();
//   }, []);

//   const value = {
//     currentUser,
//     user: currentUser,
//     login,
//     register,
//     logout,
//     adminLogin,
//     adminRegister,
//     adminLogout,
//     loading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };
