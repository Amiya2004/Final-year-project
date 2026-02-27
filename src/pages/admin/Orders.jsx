import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, Search, Filter, Eye, MoreVertical, Loader } from 'lucide-react';
import { subscribeToOrders, updateOrderStatus as updateOrderStatusDB } from '../../services/database';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToOrders((data) => {
            setOrders(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (order, newStatus) => {
        try {
            await updateOrderStatusDB(order.id, newStatus);
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status.');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch = (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        packed: orders.filter(o => o.status === 'packed').length,
        delivered: orders.filter(o => o.status === 'delivered').length
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return Clock;
            case 'packed': return Package;
            case 'delivered': return CheckCircle;
            default: return Clock;
        }
    };

    if (loading) {
        return (
            <div className="orders-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={32} className="spinning" />
                <span style={{ marginLeft: '12px' }}>Loading orders...</span>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="page-header">
                <div>
                    <h1>Orders & Sales</h1>
                    <p>Manage customer orders and track deliveries</p>
                </div>
            </div>

            {/* Order Stats */}
            <div className="order-stats">
                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="stat-icon total">
                        <Package size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{orderStats.total}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="stat-icon pending">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{orderStats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="stat-icon packed">
                        <Truck size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{orderStats.packed}</span>
                        <span className="stat-label">Packed</span>
                    </div>
                </motion.div>

                <motion.div
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="stat-icon delivered">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{orderStats.delivered}</span>
                        <span className="stat-label">Delivered</span>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="status-filters">
                    <button
                        className={statusFilter === 'all' ? 'active' : ''}
                        onClick={() => setStatusFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={statusFilter === 'pending' ? 'active' : ''}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={statusFilter === 'packed' ? 'active' : ''}
                        onClick={() => setStatusFilter('packed')}
                    >
                        Packed
                    </button>
                    <button
                        className={statusFilter === 'delivered' ? 'active' : ''}
                        onClick={() => setStatusFilter('delivered')}
                    >
                        Delivered
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <motion.div
                className="orders-table-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order, index) => {
                            const StatusIcon = getStatusIcon(order.status);
                            return (
                                <motion.tr
                                    key={order.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <td className="order-id">
                                        #{order.id ? order.id.slice(-6).toUpperCase() : `ORD${String(index + 1).padStart(4, '0')}`}
                                    </td>
                                    <td>
                                        <div className="customer-cell">
                                            <span className="customer-name">{order.customerName || 'Customer'}</span>
                                            <span className="customer-address">
                                                {order.address
                                                    ? (typeof order.address === 'string'
                                                        ? order.address
                                                        : `${order.address.addressLine1 || ''}${order.address.city ? ', ' + order.address.city : ''}${order.address.state ? ', ' + order.address.state : ''}`)
                                                    : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="items-cell">
                                            {(order.items || []).slice(0, 2).map((item, i) => (
                                                <span key={i} className="item-tag">{item.name}</span>
                                            ))}
                                            {(order.items || []).length > 2 && (
                                                <span className="more-items">+{order.items.length - 2} more</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="total-cell">₹{order.total || 0}</td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>
                                            <StatusIcon size={14} />
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="date-cell">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-btn view">
                                                <Eye size={16} />
                                            </button>
                                            {order.status === 'pending' && (
                                                <button
                                                    className="action-btn pack"
                                                    onClick={() => handleUpdateStatus(order, 'packed')}
                                                >
                                                    Pack
                                                </button>
                                            )}
                                            {order.status === 'packed' && (
                                                <button
                                                    className="action-btn deliver"
                                                    onClick={() => handleUpdateStatus(order, 'delivered')}
                                                >
                                                    Deliver
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>

            {filteredOrders.length === 0 && (
                <div className="no-orders">
                    <Package size={48} />
                    <h3>No orders found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
};

export default Orders;
