import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, ArrowLeft, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders } from '../../services/database';
import './MyOrders.css';

const MyOrders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [currentUser]);

    const loadOrders = async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }
        try {
            const userOrders = await getUserOrders(currentUser.uid);
            // Sort by date, newest first
            userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(userOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
        setLoading(false);
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return {
                    icon: Clock,
                    label: 'Order Placed',
                    color: '#f59e0b',
                    bg: '#fffbeb',
                    borderColor: '#fde68a',
                };
            case 'packed':
                return {
                    icon: Package,
                    label: 'Packed',
                    color: '#3b82f6',
                    bg: '#eff6ff',
                    borderColor: '#bfdbfe',
                };
            case 'delivered':
                return {
                    icon: CheckCircle,
                    label: 'Delivered',
                    color: '#22c55e',
                    bg: '#f0fdf4',
                    borderColor: '#bbf7d0',
                };
            default:
                return {
                    icon: Clock,
                    label: status,
                    color: '#94a3b8',
                    bg: '#f8fafc',
                    borderColor: '#e2e8f0',
                };
        }
    };

    const getTrackingSteps = (order) => {
        const status = order.status;
        const createdAt = order.createdAt ? new Date(order.createdAt) : null;
        const statusMap = { pending: 0, packed: 1, delivered: 2 };
        const activeStep = statusMap[status] ?? 0;

        const formatDate = (date) =>
            date
                ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '';

        return [
            {
                icon: CheckCircle,
                label: 'Order Confirmed',
                subtitle: activeStep >= 0 && createdAt ? formatDate(createdAt) : 'Pending',
            },
            {
                icon: Package,
                label: 'Being Packed',
                subtitle: activeStep >= 1 ? 'Packed' : 'Processing',
            },
            {
                icon: Truck,
                label: 'Out for Delivery',
                subtitle: activeStep >= 2 ? 'Delivered' : 'Estimated 2-3 days',
            },
        ].map((step, i) => ({ ...step, completed: i <= activeStep, active: i === activeStep }));
    };

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <div className="my-orders-page">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p>Track your order history</p>
                </div>
                <div className="loading-orders">
                    <div className="loading-spinner" />
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="my-orders-page">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p>Track your order history</p>
                </div>
                <div className="empty-orders">
                    <ShoppingBag size={80} strokeWidth={1} />
                    <h2>Please login to view your orders</h2>
                    <Link to="/login" className="login-link">Login Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            </div>

            <div className="orders-content">
                {orders.length === 0 ? (
                    <motion.div
                        className="empty-orders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ShoppingBag size={80} strokeWidth={1} />
                        <h2>No orders yet</h2>
                        <p>Start shopping to see your orders here!</p>
                        <Link to="/shop" className="shop-link">
                            <ArrowLeft size={18} />
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, index) => {
                            const statusConfig = getStatusConfig(order.status);
                            const StatusIcon = statusConfig.icon;
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <motion.div
                                    key={order.id}
                                    className="order-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="order-card-header" onClick={() => toggleExpand(order.id)}>
                                        <div className="order-main-info">
                                            <div className="order-id-date">
                                                <span className="order-number">
                                                    #{order.orderId || order.id?.substring(0, 8) || 'N/A'}
                                                </span>
                                                <span className="order-date">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="order-meta">
                                                <span className="order-items-count">
                                                    {order.items?.length || 0} items
                                                </span>
                                                <span className="order-total-price">
                                                    ₹{(order.total || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="order-status-expand">
                                            <span
                                                className="order-status-badge"
                                                style={{
                                                    color: statusConfig.color,
                                                    background: statusConfig.bg,
                                                    borderColor: statusConfig.borderColor,
                                                }}
                                            >
                                                <StatusIcon size={14} />
                                                {statusConfig.label}
                                            </span>
                                            <button className="expand-btn">
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <motion.div
                                            className="order-card-details"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Order Tracking */}
                                            <div className="order-tracking">
                                                <div className="tracking-stepper">
                                                    {getTrackingSteps(order).map((step, i, arr) => {
                                                        const StepIcon = step.icon;
                                                        return (
                                                            <div key={i} className={`tracking-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                                                                <div className="step-indicator">
                                                                    <div className="step-circle">
                                                                        {step.completed ? (
                                                                            <div className="step-dot" />
                                                                        ) : (
                                                                            <div className="step-dot empty" />
                                                                        )}
                                                                    </div>
                                                                    {i < arr.length - 1 && (
                                                                        <div className={`step-line ${arr[i + 1].completed ? 'completed' : ''}`} />
                                                                    )}
                                                                </div>
                                                                <div className="step-content">
                                                                    <span className="step-label">{step.label}</span>
                                                                    <span className="step-subtitle">{step.subtitle}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div className="order-items-list">
                                                {order.items?.map((item, i) => (
                                                    <div key={i} className="order-item-row">
                                                        {item.image && (
                                                            <img src={item.image} alt={item.name} className="order-item-img" />
                                                        )}
                                                        <div className="order-item-info">
                                                            <span className="order-item-name">{item.name}</span>
                                                            <span className="order-item-qty">Qty: {item.quantity}</span>
                                                        </div>
                                                        <span className="order-item-price">
                                                            ₹{(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Summary */}
                                            <div className="order-price-breakdown">
                                                <div className="price-row">
                                                    <span>Subtotal</span>
                                                    <span>₹{(order.subtotal || 0).toFixed(2)}</span>
                                                </div>
                                                <div className="price-row">
                                                    <span>Delivery</span>
                                                    <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee || 0}`}</span>
                                                </div>
                                                <div className="price-row total">
                                                    <span>Total Paid</span>
                                                    <span>₹{(order.total || 0).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Delivery Address */}
                                            {order.address && (
                                                <div className="order-address">
                                                    <strong>📍 Delivery Address</strong>
                                                    <p>{order.address.fullName}</p>
                                                    <p>{order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ''}</p>
                                                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                                </div>
                                            )}

                                            {/* Payment Info */}
                                            {order.payment && (
                                                <div className="order-payment-info">
                                                    <strong>💳 Payment</strong>
                                                    <p>Method: Razorpay</p>
                                                    <p className="payment-id-display">
                                                        ID: {order.payment.razorpay_payment_id}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
