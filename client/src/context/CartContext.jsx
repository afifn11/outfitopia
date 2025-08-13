/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // --- FUNGSI addToCart DIPERBARUI UNTUK MENERIMA KUANTITAS ---
  const addToCart = (product, quantityToAdd) => {
    setCartItems((prevItems) => {
      const cartId = `${product.id}-${product.selectedSize}`;
      const itemExists = prevItems.find((item) => item.cartId === cartId);

      if (itemExists) {
        // Tambah kuantitas sebanyak quantityToAdd, bukan hanya +1
        return prevItems.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      // Tambahkan item baru dengan kuantitas yang sudah ditentukan
      return [...prevItems, { ...product, quantity: quantityToAdd, cartId: cartId }];
    });
  };

  // --- FUNGSI BARU UNTUK UPDATE KUANTITAS DARI HALAMAN KERANJANG ---
  const updateQuantity = (cartId, newQuantity) => {
    setCartItems((prevItems) => 
        prevItems.map((item) =>
            item.cartId === cartId ? { ...item, quantity: newQuantity } : item
        ).filter(item => item.quantity > 0) // Hapus item jika kuantitasnya 0 atau kurang
    );
  };

  // Fungsi removeFromCart sekarang harus menggunakan cartId
  const removeFromCart = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity, // <-- Ekspor fungsi baru
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};