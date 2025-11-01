import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: 'SET_WISHLIST'; payload: Product[] }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' };

interface WishlistContextType {
  state: WishlistState;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'SET_WISHLIST':
      return { ...state, items: action.payload };
    case 'ADD_TO_WISHLIST':
      if (state.items.find(item => item._id === action.payload._id)) return state;
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, items: state.items.filter(item => item._id !== action.payload) };
    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  const API_URL = import.meta.env.VITE_API_URL;

  // Load wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${API_URL}/wishlist`, { withCredentials: true });
        dispatch({ type: 'SET_WISHLIST', payload: res.data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, []);

  const addToWishlist = async (product: Product) => {
    try {
      const res = await axios.post(
        `${API_URL}/wishlist`,
        { productId: product._id },
        { withCredentials: true }
      );
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
      toast.success('Added to wishlist!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await axios.delete(`${API_URL}/wishlist/${productId}`, { withCredentials: true });
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
      toast.success('Removed from wishlist');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return state.items.some(item => item._id === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider
      value={{ state, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};






// import React, { createContext, useContext, useReducer, ReactNode } from 'react';
// import { Product } from '../types';
// import toast from 'react-hot-toast';

// interface WishlistState {
//   items: Product[];
// }

// type WishlistAction =
//   | { type: 'ADD_TO_WISHLIST'; payload: Product }
//   | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
//   | { type: 'CLEAR_WISHLIST' };

// interface WishlistContextType {
//   state: WishlistState;
//   addToWishlist: (product: Product) => void;
//   removeFromWishlist: (productId: string) => void;
//   isInWishlist: (productId: string) => boolean;
//   clearWishlist: () => void;
// }

// const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
//   switch (action.type) {
//     case 'ADD_TO_WISHLIST':
//       const existingItem = state.items.find(item => item._id === action.payload._id);
//       if (existingItem) {
//         return state;
//       }
//       return {
//         ...state,
//         items: [...state.items, action.payload]
//       };

//     case 'REMOVE_FROM_WISHLIST':
//       return {
//         ...state,
//         items: state.items.filter(item => item._id !== action.payload)
//       };

//     case 'CLEAR_WISHLIST':
//       return {
//         ...state,
//         items: []
//       };

//     default:
//       return state;
//   }
// };

// export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

//   const addToWishlist = (product: Product) => {
//     const isAlreadyInWishlist = state.items.some(item => item._id === product._id);
//     if (isAlreadyInWishlist) {
//       return; // Don't show error, let the toggle handle it
//     }
//     dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
//     toast.success('Added to wishlist!');
//   };

//   const removeFromWishlist = (productId: string) => {
//     dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
//     toast.success('Removed from wishlist');
//   };

//   const isInWishlist = (productId: string) => {
//     return state.items.some(item => item._id === productId);
//   };

//   const clearWishlist = () => {
//     dispatch({ type: 'CLEAR_WISHLIST' });
//     toast.success('Wishlist cleared');
//   };

//   return (
//     <WishlistContext.Provider value={{
//       state,
//       addToWishlist,
//       removeFromWishlist,
//       isInWishlist,
//       clearWishlist
//     }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => {
//   const context = useContext(WishlistContext);
//   if (!context) {
//     throw new Error('useWishlist must be used within a WishlistProvider');
//   }
//   return context;
// };
