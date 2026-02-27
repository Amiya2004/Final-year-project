// Sample data for initial database seeding
export const sampleCategories = [
    { id: 'Vegetables', name: 'Vegetables', icon: '🥬', color: '#22c55e' },
    { id: 'dairy-eggs', name: 'Dairy & Eggs', icon: '🥛', color: '#3b82f6' },
    { id: 'bakery', name: 'Bakery', icon: '🍞', color: '#f59e0b' },
    { id: 'beverages', name: 'Beverages', icon: '🥤', color: '#8b5cf6' },
    { id: 'snacks', name: 'Snacks', icon: '🍿', color: '#ec4899' },
    { id: 'household', name: 'Soaps & Shampoos', icon: '🧼', color: '#06b6d4' },
    { id: 'spices', name: 'Spices & Masala', icon: '🌶️', color: '#ef4444' },
    { id: 'grains', name: 'Grains & Pulses', icon: '🌾', color: '#84cc16' }
];


export const sampleProducts = [
    // Fruits & Vegetables
    { name: 'Fresh Onion', category: 'Vegetables', price: 40, stock: 200, unit: 'kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1618378987442-3e5c9423d242?w=400', expiryDate: '2026-03-20', availableUnits: [{ label: '250g', price: 10 }, { label: '500g', price: 20 }, { label: '1kg', price: 40 }] },
    { name: 'Red Tomato', category: 'Vegetables', price: 35, stock: 150, unit: 'kg', rating: 4.3, image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac10dd?w=400', expiryDate: '2026-03-10', availableUnits: [{ label: '250g', price: 10 }, { label: '500g', price: 18 }, { label: '1kg', price: 35 }] },
    { name: 'Small Onion (Shallots)', category: 'Vegetables', price: 120, stock: 100, unit: 'kg', rating: 4.6, image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400', expiryDate: '2026-03-25', availableUnits: [{ label: '250g', price: 30 }, { label: '500g', price: 60 }, { label: '1kg', price: 120 }] },
    { name: 'Fresh Carrot', category: 'Vegetables', price: 60, stock: 120, unit: 'kg', rating: 4.4, image: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?w=400', expiryDate: '2026-03-15', availableUnits: [{ label: '250g', price: 15 }, { label: '500g', price: 30 }, { label: '1kg', price: 60 }] },
    { name: 'Fresh Green Beans', category: 'Vegetables', price: 80, stock: 80, unit: 'kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1567375639018-0db5b3b62b08?w=400', expiryDate: '2026-03-12', availableUnits: [{ label: '250g', price: 20 }, { label: '500g', price: 40 }, { label: '1kg', price: 80 }] },
    { name: 'Fresh Cabbage', category: 'Vegetables', price: 30, stock: 90, unit: 'kg', rating: 4.2, image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400', expiryDate: '2026-03-15', availableUnits: [{ label: '250g', price: 8 }, { label: '500g', price: 15 }, { label: '1kg', price: 30 }] },
    { name: 'White Radish', category: 'Vegetables', price: 45, stock: 70, unit: 'kg', rating: 4.3, image: 'https://images.unsplash.com/photo-1590779033100-9f60702a05af?w=400', expiryDate: '2026-03-18', availableUnits: [{ label: '250g', price: 12 }, { label: '500g', price: 23 }, { label: '1kg', price: 45 }] },
    { name: 'Organic Brinjal', category: 'Vegetables', price: 50, stock: 110, unit: 'kg', rating: 4.4, image: 'https://images.unsplash.com/photo-1601493700631-2b1644ad4c32?w=400', expiryDate: '2026-03-20', availableUnits: [{ label: '250g', price: 13 }, { label: '500g', price: 25 }, { label: '1kg', price: 50 }] },
    { name: 'Bitter Gourd', category: 'Vegetables', price: 60, stock: 65, unit: 'kg', rating: 4.1, image: 'https://images.unsplash.com/photo-1621464642784-5a213e9a4d8d?w=400', expiryDate: '2026-03-14', availableUnits: [{ label: '250g', price: 15 }, { label: '500g', price: 30 }, { label: '1kg', price: 60 }] },
    { name: 'Green Capsicum', category: 'Vegetables', price: 100, stock: 50, unit: 'kg', rating: 4.7, image: 'https://images.unsplash.com/photo-1563513369-389661cb858e?w=400', expiryDate: '2026-03-22', availableUnits: [{ label: '250g', price: 25 }, { label: '500g', price: 50 }, { label: '1kg', price: 100 }] },
    { name: 'Fresh Yellow Banana', category: 'Vegetables', price: 55, stock: 150, unit: 'dozen', rating: 4.5, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', expiryDate: '2026-03-05', availableUnits: [{ label: '6 nos', price: 30 }, { label: '12 nos (1 Dozen)', price: 55 }] },
    { name: 'Fresh Beetroot', category: 'Vegetables', price: 50, stock: 85, unit: 'kg', rating: 4.6, image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400', expiryDate: '2026-03-28', availableUnits: [{ label: '250g', price: 13 }, { label: '500g', price: 25 }, { label: '1kg', price: 50 }] },

    // Dairy & Eggs
    { name: 'Pure Cow Milk', category: 'dairy-eggs', price: 60, stock: 100, unit: 'liter', rating: 4.8, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', expiryDate: '2026-03-05', brands: ['Aavin', 'Amul', 'Heritage', 'Nandini', 'Arokya'], availableUnits: [{ label: '100ml', price: 7 }, { label: '250ml', price: 16 }, { label: '500ml', price: 30 }] },
    { name: 'Farm Fresh Eggs', category: 'dairy-eggs', price: 85, stock: 50, unit: 'dozen', rating: 4.5, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300', expiryDate: '2026-03-10', availableUnits: [{ label: '100g', price: 30 }, { label: '250g', price: 70 }, { label: '500g', price: 135 }] },
    { name: 'Fresh Paneer', category: 'dairy-eggs', price: 120, stock: 40, unit: '100g', rating: 4.6, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300', expiryDate: '2026-03-08', brands: ['Amul', 'Milky Mist', 'Mother Dairy', 'Hatsun'], availableUnits: [{ label: '100g', price: 65 }, { label: '250g', price: 155 }, { label: '500g', price: 300 }] },
    { name: 'Processed Cheese', category: 'dairy-eggs', price: 85, stock: 60, unit: '100g', rating: 4.4, image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=300', expiryDate: '2026-04-15', brands: ['Amul', 'Milky Mist', 'Britannia', 'Hatsun'], availableUnits: [{ label: '100g', price: 85 }, { label: '250g', price: 200 }, { label: '500g', price: 380 }] },
    { name: 'Creamy Butter', category: 'dairy-eggs', price: 95, stock: 80, unit: '100g', rating: 4.7, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300', expiryDate: '2026-05-15', brands: ['Amul', 'Milky Mist', 'Vijaya', 'Hatsun'], availableUnits: [{ label: '100g', price: 95 }, { label: '250g', price: 225 }, { label: '500g', price: 440 }] },
    { name: 'Fresh Curd', category: 'dairy-eggs', price: 20, stock: 120, unit: '100g', rating: 4.5, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300', expiryDate: '2026-03-05', brands: ['Aavin', 'Amul', 'Milky Mist', 'Hatsun', 'Arokya'], availableUnits: [{ label: '100g', price: 20 }, { label: '250g', price: 45 }, { label: '500g', price: 85 }] },

    // Bakery
    { name: 'Whole Wheat Bread', category: 'bakery', price: 45, stock: 60, unit: 'loaf', rating: 4.3, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', expiryDate: '2026-02-09' },
    { name: 'Croissants', category: 'bakery', price: 80, stock: 25, unit: 'pack of 4', rating: 4.7, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300', expiryDate: '2026-02-08' },
    { name: 'Chocolate Muffins', category: 'bakery', price: 120, stock: 40, unit: 'pack of 6', rating: 4.5, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300', expiryDate: '2026-02-10' },

    // Beverages
    { name: 'Orange Juice', category: 'beverages', price: 95, stock: 75, unit: 'liter', rating: 4.4, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300', expiryDate: '2026-02-20' },
    { name: 'Green Tea Pack', category: 'beverages', price: 180, stock: 100, unit: '25 bags', rating: 4.6, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300', expiryDate: '2026-08-15' },
    { name: 'Cold Brew Coffee', category: 'beverages', price: 220, stock: 3, unit: 'bottle', rating: 4.8, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300', expiryDate: '2026-02-28' },

    // Snacks
    { name: 'Masala Chips', category: 'snacks', price: 30, stock: 200, unit: 'pack', rating: 4.2, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300', expiryDate: '2026-06-15' },
    { name: 'Mixed Nuts', category: 'snacks', price: 250, stock: 45, unit: '250g', rating: 4.7, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300', expiryDate: '2026-05-20' },
    { name: 'Protein Bars', category: 'snacks', price: 180, stock: 60, unit: 'pack of 6', rating: 4.4, image: 'https://images.unsplash.com/photo-1622484212850-eb596d769eab?w=300', expiryDate: '2026-04-30' },

    // Spices - Brand-free
    { name: 'Premium Chicken Masala', category: 'spices', price: 55, stock: 150, unit: '100g', rating: 4.8, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', expiryDate: '2026-12-15' },
    { name: 'Traditional Sambar Powder', category: 'spices', price: 48, stock: 180, unit: '100g', rating: 4.7, image: 'https://images.unsplash.com/photo-1599909533601-fc07c0a19869?w=300', expiryDate: '2026-11-20' },
    { name: 'Authentic Fish Curry Masala', category: 'spices', price: 45, stock: 120, unit: '100g', rating: 4.6, image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300', expiryDate: '2026-10-15' },
    { name: 'Fragrant Biryani Masala', category: 'spices', price: 65, stock: 90, unit: '50g', rating: 4.9, image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300', expiryDate: '2026-09-30' },
    { name: 'Instant Rava Idli Mix', category: 'spices', price: 85, stock: 70, unit: '200g', rating: 4.5, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300', expiryDate: '2026-08-25' },
    { name: 'Instant Dosa Mix', category: 'spices', price: 75, stock: 85, unit: '200g', rating: 4.6, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300', expiryDate: '2026-07-15' },
    { name: 'Spicy Garam Masala', category: 'spices', price: 95, stock: 110, unit: '100g', rating: 4.7, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', expiryDate: '2026-11-30' },
    { name: 'Tangy Chaat Masala', category: 'spices', price: 55, stock: 4, unit: '100g', rating: 4.5, image: 'https://images.unsplash.com/photo-1599909533601-fc07c0a19869?w=300', expiryDate: '2026-02-10' },
    { name: 'Homemade Sambar Powder', category: 'spices', price: 68, stock: 55, unit: '100g', rating: 4.8, image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300', expiryDate: '2026-10-20' },
    { name: 'Roasted Vermicelli Mix', category: 'grains', price: 35, stock: 200, unit: '200g', rating: 4.4, image: 'https://images.unsplash.com/photo-1612966513837-dff58f0e3de8?w=300', expiryDate: '2026-12-31' },
    { name: 'Traditional Rasam Powder', category: 'spices', price: 42, stock: 7, unit: '100g', rating: 4.6, image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300', expiryDate: '2026-02-06' },

    // Household
    { name: 'Dish Washing Liquid', category: 'household', price: 120, stock: 80, unit: '500ml', rating: 4.3, image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300', expiryDate: '2027-06-15' },
    { name: 'Floor Cleaner', category: 'household', price: 150, stock: 60, unit: 'liter', rating: 4.4, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300', expiryDate: '2027-08-20' },
    { name: 'Kitchen Towel Roll', category: 'household', price: 85, stock: 350, unit: '2 rolls', rating: 4.5, image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300', expiryDate: '2028-12-31' },

    // Grains
    { name: 'Basmati Rice', category: 'grains', price: 180, stock: 100, unit: 'kg', rating: 4.7, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', expiryDate: '2027-03-15' },
    { name: 'Toor Dal', category: 'grains', price: 140, stock: 75, unit: 'kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1613758947307-f3b8f5d80711?w=300', expiryDate: '2026-12-20' },
    { name: 'Whole Wheat Flour', category: 'grains', price: 55, stock: 120, unit: 'kg', rating: 4.4, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300', expiryDate: '2026-08-30' }
];

export const sampleOrders = [
    {
        userId: 'user1',
        customerName: 'Rajesh Kumar',
        items: [
            { name: 'Premium Chicken Masala', quantity: 2, price: 55 },
            { name: 'Basmati Rice', quantity: 5, price: 180 }
        ],
        total: 1010,
        status: 'delivered',
        address: '123 Gandhi Street, Chennai',
        createdAt: '2026-02-01T10:30:00Z'
    },
    {
        userId: 'user2',
        customerName: 'Priya Sharma',
        items: [
            { name: 'Farm Fresh Milk', quantity: 2, price: 60 },
            { name: 'Brown Eggs Pack', quantity: 1, price: 85 },
            { name: 'Whole Wheat Bread', quantity: 2, price: 45 }
        ],
        total: 295,
        status: 'packed',
        address: '456 Nehru Road, Coimbatore',
        createdAt: '2026-02-03T14:20:00Z'
    },
    {
        userId: 'user3',
        customerName: 'Arun Venkatesh',
        items: [
            { name: 'Fragrant Biryani Masala', quantity: 3, price: 65 },
            { name: 'Instant Dosa Mix', quantity: 2, price: 75 }
        ],
        total: 345,
        status: 'pending',
        address: '789 Marina Beach Road, Chennai',
        createdAt: '2026-02-04T09:15:00Z'
    },
    {
        userId: 'user4',
        customerName: 'Lakshmi Narayanan',
        items: [
            { name: 'Green Tea Pack', quantity: 1, price: 180 },
            { name: 'Mixed Nuts', quantity: 2, price: 250 }
        ],
        total: 680,
        status: 'pending',
        address: '321 Temple Street, Madurai',
        createdAt: '2026-02-04T11:45:00Z'
    }
];

// Sales data for charts
export const monthlySalesData = [
    { month: 'Aug', sales: 45000 },
    { month: 'Sep', sales: 52000 },
    { month: 'Oct', sales: 48000 },
    { month: 'Nov', sales: 61000 },
    { month: 'Dec', sales: 85000 },
    { month: 'Jan', sales: 72000 },
    { month: 'Feb', sales: 68000 }
];


export const categorySalesData = [
    { name: 'Spices & Masala', value: 35, color: '#ef4444' },
    { name: 'Fruits & Vegetables', value: 20, color: '#22c55e' },
    { name: 'Dairy & Eggs', value: 15, color: '#3b82f6' },
    { name: 'Grains & Pulses', value: 12, color: '#84cc16' },
    { name: 'Beverages', value: 8, color: '#8b5cf6' },
    { name: 'Snacks', value: 5, color: '#ec4899' },
    { name: 'Bakery', value: 3, color: '#f59e0b' },
    { name: 'Soaps & Shampoos', value: 2, color: '#06b6d4' }
];

export const customerReviews = [
    { id: 1, name: 'Anitha Rajan', rating: 5, comment: 'Excellent quality products! The spices are always fresh.', avatar: '👩' },
    { id: 2, name: 'Murugan S', rating: 4, comment: 'Quick delivery and great prices. Will order again!', avatar: '👨' },
    { id: 3, name: 'Kavitha M', rating: 5, comment: 'Love the variety of quality essentials available here.', avatar: '👩' },
    { id: 4, name: 'Senthil Kumar', rating: 4, comment: 'Good service and fresh vegetables every time.', avatar: '👨' }
];

export const heroSlides = [
    {
        id: 1,
        title: 'Fresh & Organic Groceries',
        subtitle: 'Delivered to your doorstep',
        description: 'Get farm-fresh fruits, vegetables, and organic products at the best prices',
        cta: 'Shop Now',
        gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    },
    {
        id: 2,
        title: 'Big Discounts on Spices',
        subtitle: 'Up to 40% Off',
        description: 'Authentic regional spices and premium quality masala blends',
        cta: 'View Offers',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    },
    {
        id: 3,
        title: 'Seasonal Special Offers',
        subtitle: 'Limited Time Only',
        description: 'Stock up on essentials with our exclusive seasonal discounts',
        cta: 'Explore Deals',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    }
];