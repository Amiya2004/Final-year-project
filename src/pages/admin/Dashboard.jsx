import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Boxes,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    ShoppingCart,
    DollarSign,
    ArrowUp,
    ArrowDown,
    Loader,
    X,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { subscribeToProducts, subscribeToOrders, seedProducts } from '../../services/database';
import { useSettings } from '../../contexts/SettingsContext';
import { monthlySalesData, categorySalesData, sampleProducts } from '../../data/sampleData';
import './Dashboard.css';

const Dashboard = () => {
    const { settings } = useSettings();
    const lowStockThreshold = settings.lowStockThreshold ?? 10;
    const overStockThreshold = settings.overStockThreshold ?? 200;
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [expandedProduct, setExpandedProduct] = useState(null);

    useEffect(() => {
        let productsLoaded = false;
        let ordersLoaded = false;

        const checkLoaded = () => {
            if (productsLoaded && ordersLoaded) setLoading(false);
        };

        const unsubProducts = subscribeToProducts((data) => {
            setProducts(data);
            productsLoaded = true;
            checkLoaded();
        });

        const unsubOrders = subscribeToOrders((data) => {
            setOrders(data);
            ordersLoaded = true;
            checkLoaded();
        });

        return () => {
            unsubProducts();
            unsubOrders();
        };
    }, []);

    const handleSeedData = async () => {
        setSeeding(true);
        try {
            const result = await seedProducts(sampleProducts);
            if (result) {
                alert('Initial product data has been seeded to Firebase successfully!');
            } else {
                alert('Products already exist in the database. No seeding needed.');
            }
        } catch (err) {
            console.error('Seeding error:', err);
            alert('Failed to seed data: ' + err.message);
        }
        setSeeding(false);
    };

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockItems = products.filter(p => p.stock <= lowStockThreshold && p.stock > 0).length;
    const overstockItems = products.filter(p => p.stock > overStockThreshold).length;
    const expiryAlertProducts = products.filter(p => {
        if (!p.expiryDate) return false;
        const daysUntilExpiry = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });
    const expiryAlertItems = expiryAlertProducts.length;
    const lowStockProducts = products.filter(p => p.stock <= lowStockThreshold && p.stock > 0);
    const overstockProducts = products.filter(p => p.stock > overStockThreshold);
    const pendingOrdersList = orders.filter(o => o.status === 'pending');
    const todayOrdersList = orders;

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const todaySales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    const getBrands = (p) => {
        if (p.brands && p.brands.length > 0 && typeof p.brands[0] === 'object' && p.brands[0].variants) {
            return p.brands;
        }
        if (p.brands && p.brands.length > 0 && typeof p.brands[0] === 'string') {
            const variants = (p.availableUnits || []).map(u => typeof u === 'string' ? { label: u, price: p.price, stock: 0 } : { label: u.label || u, price: u.price || p.price, stock: u.stock || 0 });
            return p.brands.filter(b => b.trim()).map(name => ({ name, variants }));
        }
        if (p.availableUnits && p.availableUnits.length > 0) {
            const variants = p.availableUnits.map(u => typeof u === 'string' ? { label: u, price: p.price, stock: 0 } : { label: u.label || u, price: u.price || p.price, stock: u.stock || 0 });
            return [{ name: 'Default', variants }];
        }
        return [];
    };

    const getDetailItems = (key) => {
        switch (key) {
            case 'total-products':
                return products.map(p => ({ id: p.id, name: p.name, category: p.category, stock: p.stock, price: p.price, image: p.image, unit: p.unit, brands: getBrands(p) }));
            case 'available-stock':
                return products.map(p => ({ id: p.id, name: p.name, category: p.category, stock: p.stock, unit: p.unit || 'pcs', image: p.image, brands: getBrands(p) }));
            case 'low-stock':
                return lowStockProducts.map(p => ({ id: p.id, name: p.name, category: p.category, stock: p.stock, unit: p.unit || 'pcs', image: p.image, brands: getBrands(p) }));
            case 'overstock':
                return overstockProducts.map(p => ({ id: p.id, name: p.name, category: p.category, stock: p.stock, unit: p.unit || 'pcs', image: p.image, brands: getBrands(p) }));
            case 'expiry-alerts':
                return expiryAlertProducts.map(p => {
                    const days = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return { id: p.id, name: p.name, category: p.category, expiryDate: p.expiryDate, daysLeft: days, image: p.image, brands: getBrands(p) };
                });
            case 'pending-orders':
                return pendingOrdersList.map(o => ({ name: o.customerName || 'Customer', items: o.items ? o.items.length : 0, total: o.total || 0, status: o.status }));
            case 'today-sales':
                return todayOrdersList.map(o => ({ name: o.customerName || 'Customer', total: o.total || 0, status: o.status, items: o.items ? o.items.length : 0 }));
            default:
                return [];
        }
    };

    const statsCards = [
        { key: 'total-products', label: 'Total Products', value: totalProducts, icon: Package, color: '#3b82f6', change: '+12%', up: true },
        { key: 'available-stock', label: 'Available Stock', value: totalStock, icon: Boxes, color: '#22c55e', change: '+8%', up: true },
        { key: 'low-stock', label: 'Low Stock Items', value: lowStockItems, icon: TrendingDown, color: '#ef4444', change: '-3', up: false },
        { key: 'overstock', label: 'Overstock Items', value: overstockItems, icon: TrendingUp, color: '#f59e0b', change: '+2', up: true },
        { key: 'expiry-alerts', label: 'Expiry Alerts', value: expiryAlertItems, icon: AlertTriangle, color: '#f97316', change: '5 items', up: false },
        { key: 'pending-orders', label: 'Pending Orders', value: pendingOrders, icon: ShoppingCart, color: '#06b6d4', change: '4 new', up: true },
        { key: 'today-sales', label: "Today's Sales", value: `₹${todaySales.toLocaleString()}`, icon: DollarSign, color: '#10b981', change: '+18%', up: true }
    ];

    if (loading) {
        return (
            <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={32} className="spinning" />
                <span style={{ marginLeft: '12px' }}>Loading dashboard data...</span>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening with your store today.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {products.length === 0 && (
                        <button
                            onClick={handleSeedData}
                            disabled={seeding}
                            style={{
                                padding: '10px 20px',
                                background: '#22c55e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: seeding ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                opacity: seeding ? 0.7 : 1
                            }}
                        >
                            {seeding ? 'Seeding...' : '🌱 Seed Initial Data'}
                        </button>
                    )}
                    <div className="header-date">
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {statsCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`stat-card ${expandedCard === stat.key ? 'stat-card-active' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setExpandedCard(expandedCard === stat.key ? null : stat.key)}
                    >
                        <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className={`stat-change ${stat.up ? 'up' : 'down'}`}>
                                {stat.up ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                {stat.change}
                            </span>
                        </div>
                        <ChevronRight size={16} className={`stat-chevron ${expandedCard === stat.key ? 'rotated' : ''}`} />
                    </motion.div>
                ))}
            </div>

            {/* Expanded Detail Panel */}
            {expandedCard && (
                <motion.div
                    className="detail-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <div className="detail-panel-header">
                        <h3>{statsCards.find(s => s.key === expandedCard)?.label} — Details</h3>
                        <button className="detail-close-btn" onClick={(e) => { e.stopPropagation(); setExpandedCard(null); }}>
                            <X size={18} />
                        </button>
                    </div>
                    <div className="detail-panel-body">
                        {getDetailItems(expandedCard).length === 0 ? (
                            <p className="detail-empty">No items to display</p>
                        ) : (
                            <div className="detail-list">
                                {/* Product-type cards */}
                                {(expandedCard === 'total-products' || expandedCard === 'available-stock' || expandedCard === 'low-stock' || expandedCard === 'overstock') && (
                                    <>
                                        <div className="detail-row detail-row-header">
                                            <span className="detail-col-img"></span>
                                            <span className="detail-col-name">Product</span>
                                            <span className="detail-col-cat">Category</span>
                                            <span className="detail-col-stock">Total Stock</span>
                                            <span className="detail-col-price">Brands</span>
                                        </div>
                                        {getDetailItems(expandedCard).map((item, i) => (
                                            <div key={i} className="detail-product-block">
                                                <div
                                                    className={`detail-row detail-row-clickable ${expandedProduct === item.id ? 'detail-row-expanded' : ''}`}
                                                    onClick={() => setExpandedProduct(expandedProduct === item.id ? null : item.id)}
                                                >
                                                    <span className="detail-col-img">
                                                        {item.image ? <img src={item.image} alt={item.name} /> : <Package size={20} />}
                                                    </span>
                                                    <span className="detail-col-name">{item.name}</span>
                                                    <span className="detail-col-cat">{item.category}</span>
                                                    <span className={`detail-col-stock ${item.stock <= lowStockThreshold ? 'stock-low' : item.stock > overStockThreshold ? 'stock-over' : 'stock-ok'}`}>
                                                        {item.stock} {item.unit || ''}
                                                    </span>
                                                    <span className="detail-col-price detail-brand-count">
                                                        {item.brands.length > 0 ? `${item.brands.length} brand${item.brands.length > 1 ? 's' : ''}` : 'N/A'}
                                                        {item.brands.length > 0 && <ChevronDown size={14} className={`brand-chevron ${expandedProduct === item.id ? 'rotated' : ''}`} />}
                                                    </span>
                                                </div>
                                                {expandedProduct === item.id && item.brands.length > 0 && (
                                                    <div className="brand-detail-panel">
                                                        {item.brands.map((brand, bi) => (
                                                            <div key={bi} className="brand-detail-card">
                                                                <div className="brand-detail-name">{brand.name}</div>
                                                                <div className="brand-variant-grid">
                                                                    <div className="brand-variant-header">
                                                                        <span>Quantity</span>
                                                                        <span>Price</span>
                                                                        <span>Stock</span>
                                                                    </div>
                                                                    {brand.variants.map((v, vi) => (
                                                                        <div key={vi} className="brand-variant-row">
                                                                            <span>{v.label}</span>
                                                                            <span className="variant-price">₹{v.price}</span>
                                                                            <span className={`variant-stock ${(v.stock || 0) <= lowStockThreshold ? 'stock-low' : 'stock-ok'}`}>
                                                                                {v.stock || 0}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* Expiry alerts */}
                                {expandedCard === 'expiry-alerts' && (
                                    <>
                                        <div className="detail-row detail-row-header">
                                            <span className="detail-col-img"></span>
                                            <span className="detail-col-name">Product</span>
                                            <span className="detail-col-cat">Category</span>
                                            <span className="detail-col-stock">Expiry Date</span>
                                            <span className="detail-col-price">Days Left</span>
                                        </div>
                                        {getDetailItems(expandedCard).map((item, i) => (
                                            <div key={i} className="detail-product-block">
                                                <div
                                                    className={`detail-row detail-row-clickable ${expandedProduct === item.id ? 'detail-row-expanded' : ''}`}
                                                    onClick={() => setExpandedProduct(expandedProduct === item.id ? null : item.id)}
                                                >
                                                    <span className="detail-col-img">
                                                        {item.image ? <img src={item.image} alt={item.name} /> : <Package size={20} />}
                                                    </span>
                                                    <span className="detail-col-name">{item.name}</span>
                                                    <span className="detail-col-cat">{item.category}</span>
                                                    <span className="detail-col-stock">{item.expiryDate}</span>
                                                    <span className={`detail-col-price ${item.daysLeft <= 7 ? 'stock-low' : 'stock-warn'}`}>
                                                        {item.daysLeft} days
                                                        {item.brands.length > 0 && <ChevronDown size={14} className={`brand-chevron ${expandedProduct === item.id ? 'rotated' : ''}`} />}
                                                    </span>
                                                </div>
                                                {expandedProduct === item.id && item.brands.length > 0 && (
                                                    <div className="brand-detail-panel">
                                                        {item.brands.map((brand, bi) => (
                                                            <div key={bi} className="brand-detail-card">
                                                                <div className="brand-detail-name">{brand.name}</div>
                                                                <div className="brand-variant-grid">
                                                                    <div className="brand-variant-header">
                                                                        <span>Quantity</span>
                                                                        <span>Price</span>
                                                                        <span>Stock</span>
                                                                    </div>
                                                                    {brand.variants.map((v, vi) => (
                                                                        <div key={vi} className="brand-variant-row">
                                                                            <span>{v.label}</span>
                                                                            <span className="variant-price">₹{v.price}</span>
                                                                            <span className={`variant-stock ${(v.stock || 0) <= lowStockThreshold ? 'stock-low' : 'stock-ok'}`}>
                                                                                {v.stock || 0}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* Orders */}
                                {(expandedCard === 'pending-orders' || expandedCard === 'today-sales') && (
                                    <>
                                        <div className="detail-row detail-row-header detail-row-orders">
                                            <span className="detail-col-name">Customer</span>
                                            <span className="detail-col-cat">Items</span>
                                            <span className="detail-col-stock">Total</span>
                                            <span className="detail-col-price">Status</span>
                                        </div>
                                        {getDetailItems(expandedCard).map((item, i) => (
                                            <div key={i} className="detail-row detail-row-orders">
                                                <span className="detail-col-name">{item.name}</span>
                                                <span className="detail-col-cat">{item.items} items</span>
                                                <span className="detail-col-stock">₹{item.total}</span>
                                                <span className={`detail-col-price order-badge ${item.status}`}>{item.status}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Charts Row */}
            <div className="charts-row">
                {/* Monthly Sales Chart */}
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3>Monthly Sales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlySalesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1e293b',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}
                                formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                            />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#22c55e"
                                strokeWidth={3}
                                dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

            </div>

            {/* Category Demand & Recent Orders */}
            <div className="charts-row">
                {/* Category Demand Pie Chart */}
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3>Category-wise Demand</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categorySalesData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categorySalesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: '#1e293b',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white'
                                }}
                                formatter={(value) => [`${value}%`, 'Share']}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                    className="chart-card orders-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3>Recent Orders</h3>
                    <div className="orders-list">
                        {orders.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No orders yet</p>
                        ) : (
                            orders.slice(0, 5).map((order, index) => (
                                <div key={order.id || index} className="order-item">
                                    <div className="order-info">
                                        <span className="order-customer">{order.customerName || 'Customer'}</span>
                                        <span className="order-items">{order.items ? order.items.length : 0} items</span>
                                    </div>
                                    <div className="order-details">
                                        <span className="order-amount">₹{order.total || 0}</span>
                                        <span className={`order-status ${order.status}`}>{order.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
