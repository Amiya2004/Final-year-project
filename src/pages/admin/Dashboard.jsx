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
    Loader
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
import { monthlySalesData, categorySalesData, sampleProducts } from '../../data/sampleData';
import './Dashboard.css';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

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
    const lowStockItems = products.filter(p => p.stock <= 10 && p.stock > 0).length;
    const overstockItems = products.filter(p => p.stock > 200).length;
    const expiryAlertItems = products.filter(p => {
        if (!p.expiryDate) return false;
        const daysUntilExpiry = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const todaySales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    const statsCards = [
        { label: 'Total Products', value: totalProducts, icon: Package, color: '#3b82f6', change: '+12%', up: true },
        { label: 'Available Stock', value: totalStock, icon: Boxes, color: '#22c55e', change: '+8%', up: true },
        { label: 'Low Stock Items', value: lowStockItems, icon: TrendingDown, color: '#ef4444', change: '-3', up: false },
        { label: 'Overstock Items', value: overstockItems, icon: TrendingUp, color: '#f59e0b', change: '+2', up: true },
        { label: 'Expiry Alerts', value: expiryAlertItems, icon: AlertTriangle, color: '#f97316', change: '5 items', up: false },
        { label: 'Pending Orders', value: pendingOrders, icon: ShoppingCart, color: '#06b6d4', change: '4 new', up: true },
        { label: "Today's Sales", value: `₹${todaySales.toLocaleString()}`, icon: DollarSign, color: '#10b981', change: '+18%', up: true }
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
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
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
                    </motion.div>
                ))}
            </div>

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
