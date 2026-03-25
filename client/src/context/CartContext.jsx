/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartInitialized, setIsCartInitialized] = useState(false);
    const prevUserRef = useRef(user);

    const getCartKey = useCallback((currentUser) =>
        currentUser ? `cartItems_${currentUser.id}` : 'cartItems_guest'
    , []);

    // ── Main effect: handle login/logout/initial load ──────────────────────────
    useEffect(() => {
        const previousUser = prevUserRef.current;
        const currentUser  = user;
        const guestKey     = 'cartItems_guest';
        const userKey      = currentUser ? getCartKey(currentUser) : null;

        if (!previousUser && currentUser) {
            // LOGIN: merge guest cart → user cart
            let guestCart = [];
            let userCart  = [];
            try { guestCart = JSON.parse(localStorage.getItem(guestKey) || '[]'); } catch {}
            try { userCart  = JSON.parse(localStorage.getItem(userKey)  || '[]'); } catch {}

            const merged = [...userCart];
            guestCart.forEach(g => {
                const idx = merged.findIndex(u => u.cartId === g.cartId);
                if (idx > -1) merged[idx].quantity = Math.max(merged[idx].quantity, g.quantity);
                else merged.push(g);
            });

            setCartItems(merged);
            localStorage.setItem(userKey, JSON.stringify(merged));
            localStorage.removeItem(guestKey);

        } else if (previousUser && !currentUser) {
            // LOGOUT: wipe everything — do NOT persist empty array back
            setCartItems([]);
            localStorage.removeItem(guestKey);

        } else if (!isCartInitialized) {
            // INITIAL LOAD: read from localStorage
            try {
                const stored = localStorage.getItem(getCartKey(currentUser));
                setCartItems(stored ? JSON.parse(stored) : []);
            } catch {}
        }

        prevUserRef.current = user;
        if (!isCartInitialized) setIsCartInitialized(true);
    }, [user, getCartKey, isCartInitialized]);

    // ── Persist effect: sync state → localStorage ──────────────────────────────
    // Only runs when cartItems changes AFTER initialization.
    // We track whether the last action was clearCart to avoid re-writing.
    const isCleared = useRef(false);

    useEffect(() => {
        if (!isCartInitialized) return;

        // If flagged as cleared, skip one persist cycle then reset
        if (isCleared.current) {
            isCleared.current = false;
            return;
        }

        const key = getCartKey(user);
        localStorage.setItem(key, JSON.stringify(cartItems));
    }, [cartItems, user, getCartKey, isCartInitialized]);

    // ── Actions ────────────────────────────────────────────────────────────────
    const addToCart = (product, qty = 1) => {
        setCartItems(prev => {
            const cartId   = `${product.id}-${product.selectedSize}`;
            const existing = prev.find(i => i.cartId === cartId);
            if (existing) return prev.map(i => i.cartId === cartId ? { ...i, quantity: i.quantity + qty } : i);
            return [...prev, { ...product, quantity: qty, cartId }];
        });
    };

    const updateQuantity = (cartId, qty) =>
        setCartItems(prev =>
            prev.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i).filter(i => i.quantity > 0)
        );

    const removeFromCart = (cartId) =>
        setCartItems(prev => prev.filter(i => i.cartId !== cartId));

    const clearCart = () => {
        // 1. Wipe localStorage FIRST — synchronous, guaranteed
        const userKey  = user ? getCartKey(user) : null;
        if (userKey) localStorage.removeItem(userKey);
        localStorage.removeItem('cartItems_guest');

        // 2. Flag so persist effect skips the next cycle
        isCleared.current = true;

        // 3. Update state — triggers persist effect, which will skip due to flag
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
