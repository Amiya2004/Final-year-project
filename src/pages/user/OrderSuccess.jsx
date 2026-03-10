import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight, Package, Copy, CreditCard, Wallet, FileText, Hash } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const { t } = useLanguage();

    const orderData = location.state;

    // If no order data, redirect to home
    if (!orderData) {
        return <Navigate to="/" replace />;
    }

    const { orderId, paymentId, paymentMethod, total, itemCount } = orderData;
    const isCOD = paymentMethod === 'cod';

    const copyPaymentId = () => {
        if (isCOD) return;
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
                        <CheckCircle size={48} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h1>{t('orderPlacedSuccess')}</h1>
                    <p className="success-subtitle">
                        {t('orderSuccessMessage')}
                    </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                    className="order-details-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    {/* Order ID & Items Row */}
                    <div className="od-info-grid">
                        <div className="od-info-cell">
                            <div className="od-info-icon">
                                <Hash size={16} />
                            </div>
                            <div>
                                <span className="od-info-label">{t('orderId')}</span>
                                <span className="od-info-value od-order-id">{orderId}</span>
                            </div>
                        </div>
                        <div className="od-info-cell">
                            <div className="od-info-icon">
                                <ShoppingBag size={16} />
                            </div>
                            <div>
                                <span className="od-info-label">{t('items')}</span>
                                <span className="od-info-value">{itemCount} {t('items')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Amount Highlight */}
                    <div className="od-amount-card">
                        <div className="od-amount-left">
                            <span className="od-amount-label">{isCOD ? t('amountDue') : t('amountPaid')}</span>
                            <span className="od-amount-value">₹{total.toFixed(2)}</span>
                        </div>
                        <div className={`od-payment-status ${isCOD ? 'cod' : 'paid'}`}>
                            {isCOD ? t('payOnDelivery') : t('paid')}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="od-detail-row">
                        <div className="od-detail-left">
                            <CreditCard size={17} />
                            <span>{t('paymentMethod')}</span>
                        </div>
                        <span className="od-detail-value">{isCOD ? t('cashOnDelivery') : t('razorpayOnline')}</span>
                    </div>

                    {!isCOD && (
                        <div className="od-detail-row">
                            <div className="od-detail-left">
                                <Wallet size={17} />
                                <span>Payment ID</span>
                            </div>
                            <span className="od-detail-value od-payment-id">
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
                    )}

                    {isCOD && (
                        <div className="od-cod-note">
                            <FileText size={17} />
                            <p>{t('codNote')}</p>
                        </div>
                    )}
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
                            <strong>{t('orderConfirmed')}</strong>
                            <span>{t('justNow')}</span>
                        </div>
                    </div>
                    <div className="timeline-line" />
                    <div className="timeline-step">
                        <div className="timeline-dot" />
                        <div className="timeline-info">
                            <strong>{t('beingPacked')}</strong>
                            <span>{t('processing')}</span>
                        </div>
                    </div>
                    <div className="timeline-line" />
                    <div className="timeline-step">
                        <div className="timeline-dot" />
                        <div className="timeline-info">
                            <strong>{t('outForDelivery')}</strong>
                            <span>{t('estimated23Days')}</span>
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
                        {t('viewMyOrders')}
                    </button>
                    <button className="secondary-action" onClick={() => navigate('/shop')}>
                        {t('continueShopping')}
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
