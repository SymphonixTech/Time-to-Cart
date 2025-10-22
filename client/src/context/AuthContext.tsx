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

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${api}/login`, { email, password }, { withCredentials: true });
    const user = res.data.user;
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const adminLogin = async (email: string, password: string) => {
    const res = await axios.post(`${api}/admin/login`, { email, password }, { withCredentials: true });
    const user = res.data.user;
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (firstName: string, phone: string, email: string, password: string) => {
    const res = await axios.post(`${api}/register`, { name: firstName, phone, email, password }, { withCredentials: true });
    const user = res.data.user;
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const adminRegister = async (firstName: string, email: string, password: string) => {
    const res = await axios.post(`${api}/admin/register`, { name: firstName, email, password }, { withCredentials: true });
    const user = res.data.user;
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    try {
      await axios.get(`${api}/logout`, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('user');
    }
  };

  const adminLogout = async () => {
    try {
      await axios.get(`${api}/admin/logout`, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        let res = await axios.get(`${api}/isLoggedin`, { withCredentials: true });
        if (!res.data?.user) {
          res = await axios.get(`${api}/admin/isLoggedin`, { withCredentials: true });
        }
        if (res.data?.user) {
          setCurrentUser(res.data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthStatus();
  }, []);

  const value = {
    currentUser,
    user: currentUser,
    login,
    register,
    logout,
    adminLogin,
    adminRegister,
    adminLogout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};






// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { User } from '../types';
// import { mockAuth } from '../lib/mockAuth';
// import axios from 'axios';

// interface AuthContextType {
//   currentUser: User | null;
//   user: User | null; // Add user alias for compatibility
//   login: (email: string, password: string) => Promise<void>;
//   register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
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
//     // const user = await mockAuth.signIn(email, password);
//     const user = res.data.user;
//     setCurrentUser(user);
//   };

//   const adminLogin = async (email: string, password: string) => {
//     const res = await axios.post(`${api}/admin/login`, { email, password }, { withCredentials: true });
//     const user = res.data.user;
//     setCurrentUser(user);
//   }

//   const register = async (firstName: string, phone: string, email: string, password: string) => {
//     const res = axios.post(`${api}/register`, { name: firstName, phone, email, password }, { withCredentials: true });
//     // const user = await mockAuth.signUp(firstName, lastName, email, password);
//     const user = (await res).data.user;
//     setCurrentUser(user);
//   };

//   const adminRegister = async (firstName: string, email: string, password: string) => {
//     const res = axios.post(`${api}/admin/register`, { name: firstName, email, password }, { withCredentials: true });
//     const user = (await res).data.user;
//     setCurrentUser(user);
//   }

//   const logout = async () => {
//     // await mockAuth.signOut();
//     await axios.get(`${api}/logout`, { withCredentials: true });
//     setCurrentUser(null);
//     localStorage.removeItem('user');
//   };

//   const adminLogout = async () => {
//     await axios.get(`${api}/admin/logout`, { withCredentials: true });
//     setCurrentUser(null);
//   }

//   useEffect(() => {
//     // Check for existing user on mount
//     // const user = mockAuth.getCurrentUser();
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`${api}/isLoggedin`, { withCredentials: true });
//         const user = res.data.user;
//         setCurrentUser(user);
//         setLoading(false);
//       }
//       catch (error) {
//         setCurrentUser(null);
//         setLoading(false);
//       }
//     }

//     const fetchAdmin = async () => {
//       try {
//         const res = await axios.get(`${api}/admin/isLoggedin`, { withCredentials: true });
//         const user = res.data.user;
//         setCurrentUser(user);
//         setLoading(false);
//       }
//       catch (error) {
//         setCurrentUser(null);
//         setLoading(false);
//       }
//     }
//     fetchUser();
//     fetchAdmin();
//   }, []);

//   const value = {
//     currentUser,
//     user: currentUser, // Add user alias for compatibility
//     login,
//     register,
//     logout,
//     adminLogin,
//     adminRegister,
//     adminLogout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
