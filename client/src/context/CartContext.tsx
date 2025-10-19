import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART': {
      const total = action.payload.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { items: action.payload, total };
    }
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.product._id === action.payload._id);

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const total = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        return { items: updatedItems, total };
      }

      const newItems = [
        ...state.items,
        { id: action.payload._id, product: action.payload, quantity: 1 }
      ];
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { items: newItems, total };
    }
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.product._id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { items: newItems, total };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map(item =>
          item.product._id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter(item => item.quantity > 0);

      const total = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { items: updatedItems, total };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
          withCredentials: true,
        });
        dispatch({ type: 'SET_CART', payload: res.data });
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };
    fetchCart();
  }, []);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');

  const addItem = async (product: Product) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );
      context.dispatch({ type: 'SET_CART', payload: res.data });
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const addItems = async (product: Product, quantity: number) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart`,
        { productId: product._id, quantity },
        { withCredentials: true }
      );
      context.dispatch({ type: 'SET_CART', payload: res.data });
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  }

  const removeItem = async (productId: string) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {
        withCredentials: true,
      });
      context.dispatch({ type: 'SET_CART', payload: res.data });
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      context.dispatch({ type: 'SET_CART', payload: res.data });
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/clear-cart`, { withCredentials: true });
      context.dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return {
    ...context,
    addItem,
    addItems,
    removeItem,
    updateQuantity,
    clearCart,
  };
};








// import React, { createContext, useContext, useReducer, ReactNode } from 'react';
// import { Product, CartItem } from '../types';

// interface CartState {
//   items: CartItem[];
//   total: number;
// }

// type CartAction =
//   | { type: 'ADD_TO_CART'; payload: Product }
//   | { type: 'REMOVE_FROM_CART'; payload: string }
//   | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
//   | { type: 'CLEAR_CART' };

// const CartContext = createContext<{
//   state: CartState;
//   dispatch: React.Dispatch<CartAction>;
// } | null>(null);

// const cartReducer = (state: CartState, action: CartAction): CartState => {
//   switch (action.type) {
//     case 'ADD_TO_CART': {
//       const existingItem = state.items.find(item => item.product._id === action.payload._id);

//       if (existingItem) {
//         const updatedItems = state.items.map(item =>
//           item.product._id === action.payload._id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//         return {
//           items: updatedItems,
//           total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
//         };
//       }

//       const newItems = [...state.items, { product: action.payload, quantity: 1 }];
//       return {
//         items: newItems,
//         total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
//       };
//     }

//     case 'REMOVE_FROM_CART': {
//       const newItems = state.items.filter(item => item.product._id !== action.payload);
//       return {
//         items: newItems,
//         total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
//       };
//     }

//     case 'UPDATE_QUANTITY': {
//       const updatedItems = state.items.map(item =>
//         item.product._id === action.payload.id
//           ? { ...item, quantity: Math.max(0, action.payload.quantity) }
//           : item
//       ).filter(item => item.quantity > 0);

//       return {
//         items: updatedItems,
//         total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
//       };
//     }

//     case 'CLEAR_CART':
//       return { items: [], total: 0 };

//     default:
//       return state;
//   }
// };

// export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

//   return (
//     <CartContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }

//   const addItem = (product: Product) => {
//     context.dispatch({ type: 'ADD_TO_CART', payload: product });
//   };

//   const removeItem = (productId: string) => {
//     context.dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
//   };

//   const updateQuantity = (productId: string, quantity: number) => {
//     context.dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
//   };

//   const clearCart = () => {
//     context.dispatch({ type: 'CLEAR_CART' });
//   };

//   return {
//     ...context,
//     addItem,
//     removeItem,
//     updateQuantity,
//     clearCart
//   };
// };
