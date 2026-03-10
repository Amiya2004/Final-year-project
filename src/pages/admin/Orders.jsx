import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, Search, Filter, Eye, MoreVertical, Loader, Trash2, Download } from 'lucide-react';
import { subscribeToOrders, updateOrderStatus as updateOrderStatusDB, updatePaymentStatus as updatePaymentStatusDB, deleteOrder as deleteOrderDB, getProductById, updateProduct } from '../../services/database';
import OrderDetailsModal from './OrderDetailsModal';
import { generateInvoice } from '../../utils/generateInvoice';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './Orders.css';

const Orders = () => {
    const { settings } = useSettings();
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToOrders((data) => {
            setOrders(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const reduceStock = async (items) => {
        for (const item of items) {
            try {
                const pid = item.productId || item.id;
                if (!pid) continue;
                const product = await getProductById(pid);
                if (product) {
                    const currentStock = Number(product.stock) || 0;
                    const qty = Number(item.quantity) || 1;
                    const newStock = Math.max(0, currentStock - qty);
                    await updateProduct(pid, { stock: newStock });
                }
            } catch (err) {
                console.error(`Failed to reduce stock for ${item.name}:`, err);
            }
        }
    };

    const handleUpdateStatus = async (order, newStatus) => {
        try {
            await updateOrderStatusDB(order.id, newStatus);
            if (newStatus === 'packed' && order.items?.length) {
                await reduceStock(order.items);
            }
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status.');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await deleteOrderDB(orderId);
            } catch (err) {
                console.error('Error deleting order:', err);
                alert('Failed to delete order.');
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            (order.customerName || '').toLowerCase().includes(searchLower) ||
            (order.id || '').toLowerCase().includes(searchLower) ||
            (order.items.some(item => item.name.toLowerCase().includes(searchLower)));
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
                <span style={{ marginLeft: '12px' }}>{t('loadingOrders')}</span>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="page-header">
                <div>
                    <h1>{t('ordersSales')}</h1>
                    <p>{t('manageOrders')}</p>
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
                        <span className="stat-label">{t('totalOrders')}</span>
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
                        <span className="stat-label">{t('pending')}</span>
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
                        <span className="stat-label">{t('packed')}</span>
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
                        <span className="stat-label">{t('delivered')}</span>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder={t('searchOrders')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="status-filters">
                    <button
                        className={statusFilter === 'all' ? 'active' : ''}
                        onClick={() => setStatusFilter('all')}
                    >
                        {t('all')}
                    </button>
                    <button
                        className={statusFilter === 'pending' ? 'active' : ''}
                        onClick={() => setStatusFilter('pending')}
                    >
                        {t('pending')}
                    </button>
                    <button
                        className={statusFilter === 'packed' ? 'active' : ''}
                        onClick={() => setStatusFilter('packed')}
                    >
                        {t('packed')}
                    </button>
                    <button
                        className={statusFilter === 'delivered' ? 'active' : ''}
                        onClick={() => setStatusFilter('delivered')}
                    >
                        {t('delivered')}
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
                            <th>{t('order')}</th>
                            <th>{t('customer')}</th>
                            <th>{t('items')}</th>
                            <th>{t('total')}</th>
                            <th>{t('status')}</th>
                            <th>{t('date')}</th>
                            <th>{t('actions')}</th>
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
                                    <td className="order-id" onClick={() => setSelectedOrder(order)}>
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
                                                <span className="more-items">+{order.items.length - 2} {t('items').toLowerCase()}</span>
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
                                            <button className="action-btn view" onClick={() => setSelectedOrder(order)}>
                                                <Eye size={16} />
                                            </button>
                                            {(order.status === 'packed' || order.status === 'delivered') && (
                                                <button
                                                    className="action-btn download"
                                                    title={t('downloadReceipt')}
                                                    onClick={() => {
                                                        try {
                                                            generateInvoice(order, settings?.storeName, settings?.contactPhone, settings?.contactEmail);
                                                        } catch (err) {
                                                            console.error('Receipt generation failed:', err);
                                                            alert('Failed to generate receipt.');
                                                        }
                                                    }}
                                                >
                                                    <Download size={16} />
                                                </button>
                                            )}
                                            {order.status === 'pending' && (
                                                <button
                                                    className="action-btn pack"
                                                    onClick={() => handleUpdateStatus(order, 'packed')}
                                                >
                                                    {t('pack')}
                                                </button>
                                            )}
                                            {order.status === 'packed' && (
                                                <button
                                                    className="action-btn deliver"
                                                    onClick={() => handleUpdateStatus(order, 'delivered')}
                                                >
                                                    {t('deliver')}
                                                </button>
                                            )}
                                            {(order.status === 'delivered' || order.status === 'cancelled') && (
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                >
                                                    <Trash2 size={16} />
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
                    <h3>{t('noOrdersFound')}</h3>
                    <p>{t('tryAdjustingFilters')}</p>
                </div>
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdatePaymentStatus={async (orderId, status) => {
                        await updatePaymentStatusDB(orderId, status);
                    }}
                    storeName={settings.storeName}
                    storePhone={settings.contactPhone}
                    storeEmail={settings.contactEmail}
                />
            )}
        </div>
    );
};

export default Orders;
