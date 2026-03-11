import { ref, get, set, push, update, remove, onValue } from 'firebase/database';
import { database } from '../config/firebase';

// Convert image file to base64 data URL
export const uploadProductImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(file);
    });
};

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

// Deduct stock after an order is placed
export const deductStock = async (cartItems) => {
    for (const item of cartItems) {
        const product = await getProductById(item.id);
        if (!product) continue;

        const isVegetable = product.category === 'Vegetables';
        const quantity = Number(item.quantity) || 1;
        const selectedUnit = item.unit || '';

        const isEgg = (product.name || '').toLowerCase().includes('egg') && !isVegetable;

        if (product.brands?.length > 0 && typeof product.brands[0] === 'object' && product.brands[0].variants) {
            if (isEgg) {
                // Eggs: deduct (quantity * number of eggs in selected variant) from total stock
                // Try to extract number from selectedUnit (e.g., '5 Egg' => 5)
                let eggsPerPack = 1;
                const match = selectedUnit.match(/(\d+)/);
                if (match) eggsPerPack = parseInt(match[1], 10);
                const totalEggsToDeduct = quantity * eggsPerPack;
                const newStock = Math.max(0, (product.stock || 0) - totalEggsToDeduct);
                await updateProduct(item.id, { stock: newStock });
            } else {
                // All other products: deduct from per-variant stock
                let deducted = false;
                const updatedBrands = product.brands.map(b => {
                    if (item.brand && b.name !== item.brand) return b;
                    return {
                        ...b,
                        variants: b.variants.map(v => {
                            if (v.label === selectedUnit && !deducted) {
                                deducted = true;
                                if (isVegetable) {
                                    const kgMatch = v.label.match(/([\d.]+)\s*kg/i);
                                    const gMatch = v.label.match(/([\d.]+)\s*g(?!a)/i);
                                    const weightKg = kgMatch ? parseFloat(kgMatch[1]) : gMatch ? parseFloat(gMatch[1]) / 1000 : 1;
                                    const kgToDeduct = quantity * weightKg;
                                    return { ...v, stock: Math.max(0, (v.stock || 0) - kgToDeduct) };
                                }
                                return { ...v, stock: Math.max(0, (v.stock || 0) - quantity) };
                            }
                            return v;
                        })
                    };
                });
                const totalStock = updatedBrands.flatMap(b => b.variants).reduce((sum, v) => sum + (v.stock || 0), 0);
                const roundedStock = Math.round(totalStock * 100) / 100;
                await updateProduct(item.id, { brands: updatedBrands, stock: roundedStock });
            }
        } else {
            // Legacy format – just deduct from top-level stock
            if (isVegetable) {
                const label = selectedUnit;
                const kgMatch = label.match(/([\d.]+)\s*kg/i);
                const gMatch = label.match(/([\d.]+)\s*g(?!a)/i);
                const weightKg = kgMatch ? parseFloat(kgMatch[1]) : gMatch ? parseFloat(gMatch[1]) / 1000 : 1;
                const newStock = Math.max(0, (product.stock || 0) - quantity * weightKg);
                await updateProduct(item.id, { stock: Math.round(newStock * 100) / 100 });
            } else {
                const newStock = Math.max(0, (product.stock || 0) - quantity);
                await updateProduct(item.id, { stock: newStock });
            }
        }
    }
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
