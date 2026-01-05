// components/context/CartContext.js
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Cart functions (keep existing)
  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.name === product.name);
      if (existingItem) {
        return prevItems.map(item =>
          item.name === product.name
            ? { ...item, cartQty: item.cartQty + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, cartQty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productName) => {
    setCartItems(prevItems => prevItems.filter(item => item.name !== productName));
  }, []);

  const updateQuantity = useCallback((productName, newcartQty) => {
    if (newcartQty < 1) {
      removeFromCart(productName);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.name === productName ? { ...item, cartQty: newcartQty } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Wishlist functions
  const addToWishlist = useCallback((product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item.name === product.name);
      if (!exists) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  }, []);

  const removeFromWishlist = useCallback((productName) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.name !== productName));
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item.name === product.name);
      if (exists) {
        return prevItems.filter(item => item.name !== product.name);
      } else {
        return [...prevItems, product];
      }
    });
  }, []);

  const isInWishlist = useCallback((productName) => {
    return wishlistItems.some(item => item.name === productName);
  }, [wishlistItems]);

  // Helper functions (keep existing)
  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.cartQty, 0);
  }, [cartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.sale_price * item.cartQty), 0);
  }, [cartItems]);

  const isInCart = useCallback((productName) => {
    return cartItems.some(item => item.name === productName);
  }, [cartItems]);

  const getItemQuantity = useCallback((productName) => {
    const item = cartItems.find(item => item.name === productName);
    return item ? item.cartQty : 0;
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getCartItemsCount,
    getCartTotal,
    isInCart,
    getItemQuantity,
  }), [
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getCartItemsCount,
    getCartTotal,
    isInCart,
    getItemQuantity,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};