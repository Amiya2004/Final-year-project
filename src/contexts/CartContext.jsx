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
                const key = `${item.id}_${(item.brand || '').replace(/[.#$/[\]]/g, '_')}_${(item.unit || '').replace(/[.#$/[\]]/g, '_')}`;
                cartObject[key] = item;
            });
            await set(cartRef, cartObject);
        } else {
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
    };

    const addToCart = async (product, quantity = 1) => {
        const cartKey = `${product.id}_${product.brand || ''}_${product.unit || ''}`;
        const existingItem = cart.find(item => {
            const itemKey = `${item.id}_${item.brand || ''}_${item.unit || ''}`;
            return itemKey === cartKey;
        });
        let newCart;

        if (existingItem) {
            newCart = cart.map(item => {
                const itemKey = `${item.id}_${item.brand || ''}_${item.unit || ''}`;
                return itemKey === cartKey
                    ? { ...item, quantity: item.quantity + quantity }
                    : item;
            });
        } else {
            newCart = [...cart, { ...product, quantity }];
        }

        setCart(newCart);
        await saveCart(newCart);
    };

    const getCartKey = (item) => `${item.id}_${item.brand || ''}_${item.unit || ''}`;

    const removeFromCart = async (cartKey) => {
        const newCart = cart.filter(item => getCartKey(item) !== cartKey);
        setCart(newCart);
        await saveCart(newCart);
    };

    const updateQuantity = async (cartKey, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(cartKey);
            return;
        }
        const newCart = cart.map(item =>
            getCartKey(item) === cartKey ? { ...item, quantity } : item
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
