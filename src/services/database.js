import { ref, get, set, push, update, remove, onValue } from 'firebase/database';
import { database } from '../config/firebase';

// Products
export const getProducts = async () => {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
};

export const getProductById = async (id) => {
    const productRef = ref(database, `products/${id}`);
    const snapshot = await get(productRef);
    if (snapshot.exists()) {
        return { id, ...snapshot.val() };
    }
    return null;
};

export const addProduct = async (product) => {
    const productsRef = ref(database, 'products');
    const newProductRef = push(productsRef);
    await set(newProductRef, {
        ...product,
        createdAt: new Date().toISOString()
    });
    return newProductRef.key;
};

export const updateProduct = async (id, updates) => {
    const productRef = ref(database, `products/${id}`);
    await update(productRef, updates);
};

export const deleteProduct = async (id) => {
    const productRef = ref(database, `products/${id}`);
    await remove(productRef);
};

// Orders
export const createOrder = async (userId, orderData) => {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    await set(newOrderRef, {
        ...orderData,
        userId,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    return newOrderRef.key;
};

export const getOrders = async () => {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
};

export const getUserOrders = async (userId) => {
    const orders = await getOrders();
    return orders.filter(order => order.userId === userId);
};

export const updateOrderStatus = async (orderId, status) => {
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, { status, updatedAt: new Date().toISOString() });
};



// Categories
export const getCategories = async () => {
    const categoriesRef = ref(database, 'categories');
    const snapshot = await get(categoriesRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
};

// Real-time listeners
export const subscribeToProducts = (callback) => {
    const productsRef = ref(database, 'products');
    return onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const products = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            callback(products);
        } else {
            callback([]);
        }
    });
};

export const subscribeToOrders = (callback) => {
    const ordersRef = ref(database, 'orders');
    return onValue(ordersRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const orders = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            callback(orders);
        } else {
            callback([]);
        }
    });
};
