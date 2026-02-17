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

export const tamilNaduBrands = [
    { id: 'sakthi', name: 'Sakthi', logo: '🌶️', description: 'Famous for masala powders' },
    { id: 'aachi', name: 'Aachi', logo: '🍛', description: 'Wide range of spices and ready mixes' },
    { id: 'jp-masala', name: 'J.P Masala', logo: '🥘', description: 'Traditional masala blends' },
    { id: 'meiyal', name: 'Meiyal', logo: '🌿', description: 'Organic and natural products' },
    { id: 'everest', name: 'Everest', logo: '🏔️', description: 'Premium quality spices' },
    { id: 'mtr', name: 'MTR', logo: '🍲', description: 'Ready to eat and instant mixes' },
    { id: 'anil', name: 'Anil', logo: '🍜', description: 'Noodles and vermicelli' },
    { id: 'brahmins', name: 'Brahmins', logo: '🥣', description: 'South Indian breakfast mixes' }
];

export const sampleProducts = [
    // Fruits & Vegetables
    { name: 'Fresh Organic Bananas', category: 'Vegetables', brand: 'local', price: 45, stock: 150, unit: 'dozen', rating: 4.5, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300', expiryDate: '2026-02-15' },
    { name: 'Red Tomatoes', category: 'Vegetables', brand: 'local', price: 35, stock: 200, unit: 'kg', rating: 4.3, image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=300', expiryDate: '2026-02-10' },
    { name: 'Fresh Spinach', category: 'Vegetables', brand: 'local', price: 25, stock: 80, unit: 'bunch', rating: 4.7, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300', expiryDate: '2026-02-08' },
    { name: 'Carrots', category: 'Vegetables', brand: 'local', price: 40, stock: 120, unit: 'kg', rating: 4.4, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300', expiryDate: '2026-02-20' },
    { name: 'Green Apples', category: 'Vegetables', brand: 'local', price: 180, stock: 5, unit: 'kg', rating: 4.6, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300', expiryDate: '2026-02-25' },

    // Dairy & Eggs
    { name: 'Farm Fresh Milk', category: 'dairy-eggs', brand: 'local', price: 60, stock: 100, unit: 'liter', rating: 4.8, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300', expiryDate: '2026-02-07' },
    { name: 'Brown Eggs Pack', category: 'dairy-eggs', brand: 'local', price: 85, stock: 50, unit: 'dozen', rating: 4.5, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300', expiryDate: '2026-02-14' },
    { name: 'Greek Yogurt', category: 'dairy-eggs', brand: 'local', price: 120, stock: 8, unit: '500g', rating: 4.6, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300', expiryDate: '2026-02-12' },
    { name: 'Cheese Slices', category: 'dairy-eggs', brand: 'local', price: 150, stock: 300, unit: 'pack', rating: 4.4, image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=300', expiryDate: '2026-03-15' },

    // Bakery
    { name: 'Whole Wheat Bread', category: 'bakery', brand: 'local', price: 45, stock: 60, unit: 'loaf', rating: 4.3, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', expiryDate: '2026-02-09' },
    { name: 'Croissants', category: 'bakery', brand: 'local', price: 80, stock: 25, unit: 'pack of 4', rating: 4.7, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300', expiryDate: '2026-02-08' },
    { name: 'Chocolate Muffins', category: 'bakery', brand: 'local', price: 120, stock: 40, unit: 'pack of 6', rating: 4.5, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300', expiryDate: '2026-02-10' },

    // Beverages
    { name: 'Orange Juice', category: 'beverages', brand: 'local', price: 95, stock: 75, unit: 'liter', rating: 4.4, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300', expiryDate: '2026-02-20' },
    { name: 'Green Tea Pack', category: 'beverages', brand: 'local', price: 180, stock: 100, unit: '25 bags', rating: 4.6, image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=300', expiryDate: '2026-08-15' },
    { name: 'Cold Brew Coffee', category: 'beverages', brand: 'local', price: 220, stock: 3, unit: 'bottle', rating: 4.8, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300', expiryDate: '2026-02-28' },

    // Snacks
    { name: 'Masala Chips', category: 'snacks', brand: 'local', price: 30, stock: 200, unit: 'pack', rating: 4.2, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300', expiryDate: '2026-06-15' },
    { name: 'Mixed Nuts', category: 'snacks', brand: 'local', price: 250, stock: 45, unit: '250g', rating: 4.7, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300', expiryDate: '2026-05-20' },
    { name: 'Protein Bars', category: 'snacks', brand: 'local', price: 180, stock: 60, unit: 'pack of 6', rating: 4.4, image: 'https://images.unsplash.com/photo-1622484212850-eb596d769eab?w=300', expiryDate: '2026-04-30' },

    // Spices - Tamil Nadu Brands
    { name: 'Sakthi Chicken Masala', category: 'spices', brand: 'sakthi', price: 55, stock: 150, unit: '100g', rating: 4.8, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', expiryDate: '2026-12-15' },
    { name: 'Sakthi Sambar Powder', category: 'spices', brand: 'sakthi', price: 48, stock: 180, unit: '100g', rating: 4.7, image: 'https://images.unsplash.com/photo-1599909533601-fc07c0a19869?w=300', expiryDate: '2026-11-20' },
    { name: 'Aachi Fish Curry Masala', category: 'spices', brand: 'aachi', price: 45, stock: 120, unit: '100g', rating: 4.6, image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300', expiryDate: '2026-10-15' },
    { name: 'Aachi Biryani Masala', category: 'spices', brand: 'aachi', price: 65, stock: 90, unit: '50g', rating: 4.9, image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300', expiryDate: '2026-09-30' },
    { name: 'MTR Rava Idli Mix', category: 'spices', brand: 'mtr', price: 85, stock: 70, unit: '200g', rating: 4.5, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300', expiryDate: '2026-08-25' },
    { name: 'MTR Dosa Mix', category: 'spices', brand: 'mtr', price: 75, stock: 85, unit: '200g', rating: 4.6, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300', expiryDate: '2026-07-15' },
    { name: 'Everest Garam Masala', category: 'spices', brand: 'everest', price: 95, stock: 110, unit: '100g', rating: 4.7, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300', expiryDate: '2026-11-30' },
    { name: 'Everest Chaat Masala', category: 'spices', brand: 'everest', price: 55, stock: 4, unit: '100g', rating: 4.5, image: 'https://images.unsplash.com/photo-1599909533601-fc07c0a19869?w=300', expiryDate: '2026-02-10' },
    { name: 'Brahmins Sambar Powder', category: 'spices', brand: 'brahmins', price: 68, stock: 55, unit: '100g', rating: 4.8, image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=300', expiryDate: '2026-10-20' },
    { name: 'Anil Vermicelli', category: 'grains', brand: 'anil', price: 35, stock: 200, unit: '200g', rating: 4.4, image: 'https://images.unsplash.com/photo-1612966513837-dff58f0e3de8?w=300', expiryDate: '2026-12-31' },
    { name: 'J.P Masala Rasam Powder', category: 'spices', brand: 'jp-masala', price: 42, stock: 7, unit: '100g', rating: 4.6, image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300', expiryDate: '2026-02-06' },

    // Household
    { name: 'Dish Washing Liquid', category: 'household', brand: 'local', price: 120, stock: 80, unit: '500ml', rating: 4.3, image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300', expiryDate: '2027-06-15' },
    { name: 'Floor Cleaner', category: 'household', brand: 'local', price: 150, stock: 60, unit: 'liter', rating: 4.4, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300', expiryDate: '2027-08-20' },
    { name: 'Kitchen Towel Roll', category: 'household', brand: 'local', price: 85, stock: 350, unit: '2 rolls', rating: 4.5, image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300', expiryDate: '2028-12-31' },

    // Grains
    { name: 'Basmati Rice', category: 'grains', brand: 'local', price: 180, stock: 100, unit: 'kg', rating: 4.7, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', expiryDate: '2027-03-15' },
    { name: 'Toor Dal', category: 'grains', brand: 'local', price: 140, stock: 75, unit: 'kg', rating: 4.5, image: 'https://images.unsplash.com/photo-1613758947307-f3b8f5d80711?w=300', expiryDate: '2026-12-20' },
    { name: 'Whole Wheat Flour', category: 'grains', brand: 'local', price: 55, stock: 120, unit: 'kg', rating: 4.4, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300', expiryDate: '2026-08-30' }
];

export const sampleOrders = [
    {
        userId: 'user1',
        customerName: 'Rajesh Kumar',
        items: [
            { name: 'Sakthi Chicken Masala', quantity: 2, price: 55 },
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
            { name: 'Aachi Biryani Masala', quantity: 3, price: 65 },
            { name: 'MTR Dosa Mix', quantity: 2, price: 75 }
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

export const brandSalesData = [
    { brand: 'Sakthi', sales: 45000, products: 12, demand: 'high' },
    { brand: 'Aachi', sales: 38000, products: 15, demand: 'high' },
    { brand: 'MTR', sales: 28000, products: 8, demand: 'medium' },
    { brand: 'Everest', sales: 25000, products: 10, demand: 'medium' },
    { brand: 'Brahmins', sales: 18000, products: 6, demand: 'medium' },
    { brand: 'J.P Masala', sales: 12000, products: 5, demand: 'low' },
    { brand: 'Anil', sales: 15000, products: 4, demand: 'medium' },
    { brand: 'Meiyal', sales: 8000, products: 3, demand: 'low' }
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
    { id: 1, name: 'Anitha Rajan', rating: 5, comment: 'Excellent quality products! The Sakthi masala is always fresh.', avatar: '👩' },
    { id: 2, name: 'Murugan S', rating: 4, comment: 'Quick delivery and great prices. Will order again!', avatar: '👨' },
    { id: 3, name: 'Kavitha M', rating: 5, comment: 'Love the variety of Tamil Nadu brands available here.', avatar: '👩' },
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
        description: 'Authentic Tamil Nadu brands - Sakthi, Aachi, MTR & more',
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
