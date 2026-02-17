import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Boxes,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Tags,
    ShoppingCart,
    DollarSign,
    ArrowUp,
    ArrowDown
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
import { sampleProducts, monthlySalesData, brandSalesData, categorySalesData, sampleOrders } from '../../data/sampleData';
import './Dashboard.css';

const Dashboard = () => {
    const [products] = useState(sampleProducts);
    const [orders] = useState(sampleOrders);

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockItems = products.filter(p => p.stock <= 10 && p.stock > 0).length;
    const overstockItems = products.filter(p => p.stock > 200).length;
    const expiryAlertItems = products.filter(p => {
        const daysUntilExpiry = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;
    const uniqueBrands = [...new Set(products.map(p => p.brand))].length;

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const todaySales = orders.reduce((sum, o) => sum + o.total, 0);

    const statsCards = [
        { label: 'Total Products', value: totalProducts, icon: Package, color: '#3b82f6', change: '+12%', up: true },
        { label: 'Available Stock', value: totalStock, icon: Boxes, color: '#22c55e', change: '+8%', up: true },
        { label: 'Low Stock Items', value: lowStockItems, icon: TrendingDown, color: '#ef4444', change: '-3', up: false },
        { label: 'Overstock Items', value: overstockItems, icon: TrendingUp, color: '#f59e0b', change: '+2', up: true },
        { label: 'Expiry Alerts', value: expiryAlertItems, icon: AlertTriangle, color: '#f97316', change: '5 items', up: false },
        { label: 'Total Brands', value: uniqueBrands, icon: Tags, color: '#8b5cf6', change: '+1', up: true },
        { label: 'Pending Orders', value: pendingOrders, icon: ShoppingCart, color: '#06b6d4', change: '4 new', up: true },
        { label: "Today's Sales", value: `₹${todaySales.toLocaleString()}`, icon: DollarSign, color: '#10b981', change: '+18%', up: true }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening with your store today.</p>
                </div>
                <div className="header-date">
                    {new Date().toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
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

                {/* Brand-wise Sales */}
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3>Brand-wise Sales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={brandSalesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="brand" stroke="#64748b" />
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
                            <Bar
                                dataKey="sales"
                                fill="#8b5cf6"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
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
                        {orders.slice(0, 5).map((order, index) => (
                            <div key={index} className="order-item">
                                <div className="order-info">
                                    <span className="order-customer">{order.customerName}</span>
                                    <span className="order-items">{order.items.length} items</span>
                                </div>
                                <div className="order-details">
                                    <span className="order-amount">₹{order.total}</span>
                                    <span className={`order-status ${order.status}`}>{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
