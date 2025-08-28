/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartInitialized, setIsCartInitialized] = useState(false);
    
    // useRef untuk melacak status user sebelumnya, ini adalah KUNCI untuk mendeteksi login/logout
    const prevUserRef = useRef(user);

    const getCartKey = useCallback((currentUser) => {
        return currentUser ? `cartItems_${currentUser.id}` : 'cartItems_guest';
    }, []);

    // Efek utama yang menangani semua logika transisi saat user berubah
    useEffect(() => {
        const previousUser = prevUserRef.current;
        const currentUser = user;
        
        const guestCartKey = 'cartItems_guest';
        const userCartKey = currentUser ? getCartKey(currentUser) : null;

        // --- Skenario 1: Pengguna baru saja LOGIN ---
        if (!previousUser && currentUser) {
            console.log("LOGIN DETECTED: Merging carts...");
            
            // Ambil keranjang tamu dari localStorage
            let guestCart = [];
            try {
                const localGuestCart = localStorage.getItem(guestCartKey);
                guestCart = localGuestCart ? JSON.parse(localGuestCart) : [];
            } catch (e) { console.error("Gagal membaca keranjang tamu", e); }

            // Ambil keranjang pengguna yang mungkin sudah ada
            let userCart = [];
            try {
                const localUserCart = localStorage.getItem(userCartKey);
                userCart = localUserCart ? JSON.parse(localUserCart) : [];
            } catch (e) { console.error("Gagal membaca keranjang pengguna", e); }

            // Logika penggabungan (merge) yang cerdas
            const mergedCart = [...userCart];
            guestCart.forEach(guestItem => {
                const existingItemIndex = mergedCart.findIndex(userItem => userItem.cartId === guestItem.cartId);
                if (existingItemIndex > -1) {
                    // Jika item sudah ada, ambil kuantitas yang terbesar
                    mergedCart[existingItemIndex].quantity = Math.max(mergedCart[existingItemIndex].quantity, guestItem.quantity);
                } else {
                    // Jika item belum ada, tambahkan ke keranjang
                    mergedCart.push(guestItem);
                }
            });

            setCartItems(mergedCart); // Update state dengan keranjang gabungan
            localStorage.setItem(userCartKey, JSON.stringify(mergedCart)); // Simpan ke localStorage pengguna
            localStorage.removeItem(guestCartKey); // Hapus keranjang tamu
        } 
        // --- Skenario 2: Pengguna baru saja LOGOUT ---
        else if (previousUser && !currentUser) {
            console.log("LOGOUT DETECTED: Switching to guest cart.");
            // Muat keranjang tamu yang sekarang seharusnya kosong
             let guestCart = [];
            try {
                const localGuestCart = localStorage.getItem(guestCartKey);
                guestCart = localGuestCart ? JSON.parse(localGuestCart) : [];
            } catch (e) { console.error("Gagal membaca keranjang tamu saat logout", e); }
            setCartItems(guestCart);
        } 
        // --- Skenario 3: Refresh halaman (user tidak berubah) atau load awal ---
        else if (!isCartInitialized) {
             const currentCartKey = getCartKey(currentUser);
            try {
                const localData = localStorage.getItem(currentCartKey);
                setCartItems(localData ? JSON.parse(localData) : []);
            } catch (e) { console.error("Gagal memuat keranjang", e); }
        }

        // Selalu update user sebelumnya di akhir
        prevUserRef.current = user;
        // Tandai bahwa inisialisasi selesai
        if (!isCartInitialized) setIsCartInitialized(true);

    }, [user, getCartKey, isCartInitialized]);

    // Efek terpisah yang HANYA bertugas menyimpan perubahan pada keranjang
    useEffect(() => {
        // Hanya simpan jika inisialisasi selesai untuk menghindari penimpaan data saat load awal
        if (isCartInitialized) {
            const cartKey = getCartKey(user);
            localStorage.setItem(cartKey, JSON.stringify(cartItems));
        }
    }, [cartItems, user, getCartKey, isCartInitialized]);


    const addToCart = (product, quantityToAdd) => {
        setCartItems(prevItems => {
            const cartId = `${product.id}-${product.selectedSize}`;
            const existingItem = prevItems.find(item => item.cartId === cartId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.cartId === cartId ? { ...item, quantity: item.quantity + quantityToAdd } : item
                );
            }
            return [...prevItems, { ...product, quantity: quantityToAdd, cartId }];
        });
    };

    const updateQuantity = (cartId, newQuantity) => {
        setCartItems(prevItems => prevItems.map(item =>
            item.cartId === cartId ? { ...item, quantity: newQuantity } : item
        ).filter(item => item.quantity > 0));
    };
    
    const removeFromCart = (cartId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    };
    
    const clearCart = () => {
        setCartItems([]);
    };

    const value = { cartItems, addToCart, removeFromCart, clearCart, updateQuantity };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};