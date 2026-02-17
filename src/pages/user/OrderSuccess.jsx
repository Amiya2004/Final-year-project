import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight, Package, Copy } from 'lucide-react';
import { useState } from 'react';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const orderData = location.state;

    // If no order data, redirect to home
    if (!orderData) {
        return <Navigate to="/" replace />;
    }

    const { orderId, paymentId, total, itemCount } = orderData;

    const copyPaymentId = () => {
        navigator.clipboard.writeText(paymentId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="order-success-page">
            <motion.div
                className="success-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Success Animation */}
                <motion.div
                    className="success-icon-wrapper"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <div className="success-icon-ring" />
                    <div className="success-icon-ring ring-2" />
                    <div className="success-icon">
                        <CheckCircle size={56} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h1>Order Placed Successfully! 🎉</h1>
                    <p className="success-subtitle">
                        Thank you for your purchase. Your order has been confirmed and will be delivered soon.
                    </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                    className="order-details-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="detail-row">
                        <span className="detail-label">
                            <Package size={16} />
                            Order ID
                        </span>
                        <span className="detail-value order-id">{orderId}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">
                            <ShoppingBag size={16} />
                            Items
                        </span>
                        <span className="detail-value">{itemCount} items</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">💰 Amount Paid</span>
                        <span className="detail-value amount">₹{total.toFixed(2)}</span>
                    </div>

                    <div className="detail-row payment-id-row">
                        <span className="detail-label">💳 Payment ID</span>
                        <span className="detail-value payment-id">
                            {paymentId}
                            <button
                                className="copy-btn"
                                onClick={copyPaymentId}
                                title="Copy Payment ID"
                            >
                                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                            </button>
                        </span>
                    </div>
                </motion.div>

                {/* Status Timeline */}
                <motion.div
                    className="status-timeline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="timeline-step active">
                        <div className="timeline-dot" />
                        <div className="timeline-info">
                            <strong>Order Confirmed</strong>
                            <span>Just now</span>
                        </div>
                    </div>
                    <div className="timeline-line" />
                    <div className="timeline-step">
                        <div className="timeline-dot" />
                        <div className="timeline-info">
                            <strong>Being Packed</strong>
                            <span>Processing</span>
                        </div>
                    </div>
                    <div className="timeline-line" />
                    <div className="timeline-step">
                        <div className="timeline-dot" />
                        <div className="timeline-info">
                            <strong>Out for Delivery</strong>
                            <span>Estimated 2-3 days</span>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="success-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                >
                    <button className="primary-action" onClick={() => navigate('/orders')}>
                        <Package size={20} />
                        View My Orders
                    </button>
                    <button className="secondary-action" onClick={() => navigate('/shop')}>
                        Continue Shopping
                        <ArrowRight size={18} />
                    </button>
                </motion.div>
            </motion.div>

            {/* Confetti Effect (CSS-only) */}
            <div className="confetti-container">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={`confetti confetti-${i % 5}`} style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`,
                    }} />
                ))}
            </div>
        </div>
    );
};

export default OrderSuccess;
