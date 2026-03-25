/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartInitialized, setIsCartInitialized] = useState(false);
    // Flag untuk skip persist saat clearCart dipanggil
    const skipPersistRef = useRef(false);
    const prevUserRef    = useRef(user);

    const getCartKey = useCallback((currentUser) =>
        currentUser ? `cartItems_${currentUser.id}` : 'cartItems_guest'
    , []);

    useEffect(() => {
        const previousUser = prevUserRef.current;
        const currentUser  = user;
        const guestCartKey = 'cartItems_guest';
        const userCartKey  = currentUser ? getCartKey(currentUser) : null;

        if (!previousUser && currentUser) {
            // LOGIN: merge guest cart into user cart
            let guestCart = [];
            try { guestCart = JSON.parse(localStorage.getItem(guestCartKey) || '[]'); } catch {}
            let userCart = [];
            try { userCart = JSON.parse(localStorage.getItem(userCartKey) || '[]'); } catch {}

            const mergedCart = [...userCart];
            guestCart.forEach(guestItem => {
                const idx = mergedCart.findIndex(i => i.cartId === guestItem.cartId);
                if (idx > -1) {
                    mergedCart[idx].quantity = Math.max(mergedCart[idx].quantity, guestItem.quantity);
                } else {
                    mergedCart.push(guestItem);
                }
            });
            setCartItems(mergedCart);
            localStorage.setItem(userCartKey, JSON.stringify(mergedCart));
            localStorage.removeItem(guestCartKey);

        } else if (previousUser && !currentUser) {
            // LOGOUT: clear everything
            skipPersistRef.current = true;
            setCartItems([]);
            localStorage.removeItem(guestCartKey);
            setTimeout(() => { skipPersistRef.current = false; }, 100);

        } else if (!isCartInitialized) {
            // INITIAL LOAD
            try {
                const data = localStorage.getItem(getCartKey(currentUser));
                setCartItems(data ? JSON.parse(data) : []);
            } catch {}
        }

        prevUserRef.current = user;
        if (!isCartInitialized) setIsCartInitialized(true);
    }, [user, getCartKey, isCartInitialized]);

    // Persist cart to localStorage — skip when clearing
    useEffect(() => {
        if (!isCartInitialized) return;
        if (skipPersistRef.current) return;
        const cartKey = getCartKey(user);
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }, [cartItems, user, getCartKey, isCartInitialized]);

    const addToCart = (product, quantityToAdd = 1) => {
        setCartItems(prev => {
            const cartId   = `${product.id}-${product.selectedSize}`;
            const existing = prev.find(i => i.cartId === cartId);
            if (existing) {
                return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + quantityToAdd } : i);
            }
            return [...prev, { ...product, quantity: quantityToAdd, cartId }];
        });
    };

    const updateQuantity = (cartId, newQuantity) =>
        setCartItems(prev =>
            prev.map(i => i.cartId === cartId ? { ...i, quantity: newQuantity } : i)
                .filter(i => i.quantity > 0)
        );

    const removeFromCart = (cartId) =>
        setCartItems(prev => prev.filter(i => i.cartId !== cartId));

    // clearCart: set flag dulu SEBELUM setState agar persist effect tidak overwrite
    const clearCart = () => {
        skipPersistRef.current = true;
        setCartItems([]);
        if (user) localStorage.removeItem(getCartKey(user));
        localStorage.removeItem('cartItems_guest');
        // Reset flag setelah React selesai render cycle berikutnya
        setTimeout(() => { skipPersistRef.current = false; }, 200);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
