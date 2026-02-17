import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ref, set, get, remove } from 'firebase/database';
import { database } from '../config/firebase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            loadCart();
        } else {
            const localCart = localStorage.getItem('cart');
            if (localCart) {
                setCart(JSON.parse(localCart));
            }
        }
    }, [currentUser]);

    const loadCart = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const cartRef = ref(database, `carts/${currentUser.uid}`);
            const snapshot = await get(cartRef);
            if (snapshot.exists()) {
                const cartData = snapshot.val();
                setCart(Object.values(cartData));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
        setLoading(false);
    };

    const saveCart = async (newCart) => {
        if (currentUser) {
            const cartRef = ref(database, `carts/${currentUser.uid}`);
            const cartObject = {};
            newCart.forEach(item => {
                cartObject[item.id] = item;
            });
            await set(cartRef, cartObject);
        } else {
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
    };

    const addToCart = async (product, quantity = 1) => {
        const existingItem = cart.find(item => item.id === product.id);
        let newCart;

        if (existingItem) {
            newCart = cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCart = [...cart, { ...product, quantity }];
        }

        setCart(newCart);
        await saveCart(newCart);
    };

    const removeFromCart = async (productId) => {
        const newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);
        await saveCart(newCart);
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }
        const newCart = cart.map(item =>
            item.id === productId ? { ...item, quantity } : item
        );
        setCart(newCart);
        await saveCart(newCart);
    };

    const clearCart = async () => {
        setCart([]);
        if (currentUser) {
            await remove(ref(database, `carts/${currentUser.uid}`));
        } else {
            localStorage.removeItem('cart');
        }
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
