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

export const updatePaymentStatus = async (orderId, paymentStatus) => {
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, { 'payment/status': paymentStatus, updatedAt: new Date().toISOString() });
};

export const updateOrderAddress = async (orderId, address) => {
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, {
        address,
        customerName: address.fullName,
        customerPhone: address.phone,
        customerEmail: address.email,
        updatedAt: new Date().toISOString()
    });
};

export const deleteOrder = async (orderId) => {
    const orderRef = ref(database, `orders/${orderId}`);
    await remove(orderRef);
};

// User Addresses
export const saveUserAddress = async (userId, addressData) => {
    const addressesRef = ref(database, `userAddresses/${userId}`);
    const newRef = push(addressesRef);
    await set(newRef, { ...addressData, createdAt: new Date().toISOString() });
    return newRef.key;
};

export const getUserAddresses = async (userId) => {
    const addressesRef = ref(database, `userAddresses/${userId}`);
    const snapshot = await get(addressesRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
};

export const deleteUserAddress = async (userId, addressId) => {
    const addressRef = ref(database, `userAddresses/${userId}/${addressId}`);
    await remove(addressRef);
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

// App Settings
export const getSettings = async () => {
    const settingsRef = ref(database, 'settings');
    const snapshot = await get(settingsRef);
    
    // Default settings with all new fields
    const defaultSettings = {
        // General Settings
        storeName: 'FreshMart',
        contactEmail: 'contact@freshmart.com',
        contactPhone: '+91 98765 43210',
        deliveryFee: 40,
        minOrderForFreeDelivery: 500,
        maintenanceMode: false,
        orderNotifications: true,
        // Theme Settings
        theme: 'light',
        primaryColor: '#059669',
        darkMode: false,
        // Business Settings
        currency: 'INR',
        businessHours: {
            open: '09:00',
            close: '21:00',
            daysOpen: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        },
        // Email Settings
        emailNotifications: true,
        orderConfirmationEmail: true,
        lowStockEmail: true,
        // System Settings
        maxFileUpload: 5,
        autoBackup: true,
        backupFrequency: 'weekly'
    };
    
    if (snapshot.exists()) {
        // Merge existing settings with defaults to ensure all fields are present
        return { ...defaultSettings, ...snapshot.val() };
    }
    return defaultSettings;
};

export const updateSettings = async (settings) => {
    const settingsRef = ref(database, 'settings');
    await update(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
    });
};

// Seed products from sampleData into Firebase (only if no products exist)
export const seedProducts = async (sampleProducts) => {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
        return false; // Products already exist, skip seeding
    }
    // Seed all sample products
    for (const product of sampleProducts) {
        const newRef = push(productsRef);
        await set(newRef, {
            ...product,
            createdAt: new Date().toISOString()
        });
    }
    return true; // Seeded successfully
};

// User Feedback
export const addFeedback = async (feedback) => {
    const feedbackRef = ref(database, 'feedback');
    const newFeedbackRef = push(feedbackRef);
    await set(newFeedbackRef, {
        ...feedback,
        createdAt: new Date().toISOString()
    });
    return newFeedbackRef.key;
};

export const getFeedback = async () => {
    const feedbackRef = ref(database, 'feedback');
    const snapshot = await get(feedbackRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    }
    return [];
};

export const deleteFeedback = async (feedbackId) => {
    const feedbackRef = ref(database, `feedback/${feedbackId}`);
    await remove(feedbackRef);
};

export const subscribeToFeedback = (callback) => {
    const feedbackRef = ref(database, 'feedback');
    return onValue(feedbackRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const feedback = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            callback(feedback);
        } else {
            callback([]);
        }
    });
};
