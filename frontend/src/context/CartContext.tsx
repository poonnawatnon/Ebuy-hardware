import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartApi, productApi } from '../services/api';
import { showToast } from '../utils/toast';
import { CartItem } from '../types/product';
import axios from 'axios';

// interface CartItem {
//   id: string;
//   productId: string;
//   quantity: number;
//   product: {
//     id: string;
//     title: string;
//     price: number;
//     images: string[];
//     condition: string;
//     seller: {
//       username: string;
//     };
//   };
// }

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
    error: null,
  });

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartApi.getCart();
      dispatch({ type: 'SET_ITEMS', payload: response.items });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // First check if product is still available
    const product = await productApi.getProduct(productId);
    if (product.status !== 'ACTIVE') {
      showToast.error('This product is no longer available');
      return;
    }

      // Make API call
      const response = await cartApi.addToCart(productId, quantity);

      // Only show success toast and fetch cart if API call succeeds
      await fetchCart();
      showToast.success('Added to cart!');
      return response;
      
    } catch (error: any) {
      // Handle error toast
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      showToast.error(errorMessage);
      // Don't set error in state if it's just a quantity limit message
      if (!errorMessage.includes('Maximum quantity') && 
          !errorMessage.includes('Can only add')) {
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      // Re-throw the error so the component can handle it
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartApi.removeFromCart(itemId);
      await fetchCart(); // Refresh cart after removing item
      showToast.success('Item removed from cart');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
      showToast.error('Failed to remove item from cart');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartApi.updateCartItem(itemId, quantity);
      await fetchCart(); // Refresh cart after updating quantity
      showToast.success('Cart updated');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart' });
      showToast.error('Failed to update cart');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};