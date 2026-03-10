import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Package, Hash, User, MapPin, Phone, Mail, Calendar, DollarSign, ShoppingCart, CreditCard, Tag, Ruler, Store, CircleCheck, CircleAlert, Download } from 'lucide-react';
import { generateInvoice } from '../../utils/generateInvoice';
import { useLanguage } from '../../contexts/LanguageContext';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, onClose, onUpdatePaymentStatus, storeName, storePhone, storeEmail }) => {
    const [paymentStatus, setPaymentStatus] = useState(order?.payment?.status || 'unpaid');
    const [updatingPayment, setUpdatingPayment] = useState(false);
    const { t } = useLanguage();

    if (!order) return null;

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const subtotal = order.subtotal || order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const deliveryFee = order.deliveryFee || 0;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <motion.div
                className="odm-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="odm-header">
                    <div>
                        <h2>{t('orderDetails')}</h2>
                        <span className="odm-order-id">#{order.id.slice(-6).toUpperCase()}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </header>

                <div className="odm-body">
                    {/* Status & Meta Strip */}
                    <div className="odm-meta-strip">
                        <div className="odm-meta-item">
                            <Calendar size={16} />
                            <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="odm-meta-item">
                            <CreditCard size={16} />
                            <span>{order.payment?.method === 'cod' ? t('cashOnDelivery') : order.payment?.method || 'N/A'}</span>
                        </div>
                        <div className={`odm-status-badge ${order.status}`}>
                            {order.status}
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="odm-payment-status-strip">
                        <div className="odm-payment-info">
                            {paymentStatus === 'paid' ? <CircleCheck size={18} /> : <CircleAlert size={18} />}
                            <span className="odm-payment-label">{t('paymentStatus')}</span>
                            <span className={`odm-payment-badge ${paymentStatus}`}>
                                {paymentStatus === 'paid' ? t('paid') : t('unpaid')}
                            </span>
                        </div>
                        {order.payment?.method === 'cod' && paymentStatus !== 'paid' && (
                            <button
                                className="odm-mark-paid-btn"
                                disabled={updatingPayment}
                                onClick={async () => {
                                    setUpdatingPayment(true);
                                    try {
                                        await onUpdatePaymentStatus(order.id, 'paid');
                                        setPaymentStatus('paid');
                                    } catch (err) {
                                        console.error('Failed to update payment status:', err);
                                    } finally {
                                        setUpdatingPayment(false);
                                    }
                                }}
                            >
                                {updatingPayment ? t('updating') : t('markAsPaid')}
                            </button>
                        )}
                    </div>

                    {/* Customer Section */}
                    <section className="odm-section">
                        <h3><User size={18} /> {t('customerInformation')}</h3>
                        <div className="odm-customer-grid">
                            <div className="odm-customer-field">
                                <User size={15} />
                                <div>
                                    <label>{t('name')}</label>
                                    <p>{order.customerName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="odm-customer-field">
                                <Mail size={15} />
                                <div>
                                    <label>{t('email')}</label>
                                    <p>{order.email || order.customerEmail || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="odm-customer-field">
                                <Phone size={15} />
                                <div>
                                    <label>{t('phone')}</label>
                                    <p>{order.phone || order.customerPhone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="odm-customer-field">
                                <MapPin size={15} />
                                <div>
                                    <label>{t('address')}</label>
                                    <p>{order.address ? `${order.address.addressLine1 || ''}, ${order.address.city || ''}, ${order.address.state || ''} - ${order.address.pincode || ''}` : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Order Items Section */}
                    <section className="odm-section">
                        <h3><ShoppingCart size={18} /> {t('orderItems')} ({order.items.length})</h3>
                        <div className="odm-items-list">
                            {order.items.map((item, idx) => (
                                <div key={item.id || idx} className="odm-item-card">
                                    <div className="odm-item-image">
                                        {item.image ? <img src={item.image} alt={item.name} /> : <Package size={28} />}
                                    </div>
                                    <div className="odm-item-details">
                                        <div className="odm-item-title-row">
                                            <h4>{item.name}</h4>
                                            <span className="odm-item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="odm-item-tags">
                                            {item.category && (
                                                <span className="odm-tag odm-tag-category"><Tag size={12} /> {item.category}</span>
                                            )}
                                            {item.brand && (
                                                <span className="odm-tag odm-tag-brand"><Store size={12} /> {item.brand}</span>
                                            )}
                                            {item.unit && (
                                                <span className="odm-tag odm-tag-unit"><Ruler size={12} /> {item.unit}</span>
                                            )}
                                        </div>
                                        <div className="odm-item-pricing">
                                            <span className="odm-item-unit-price">₹{item.price.toFixed(2)} {t('each')}</span>
                                            <span className="odm-item-qty">x {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Order Summary */}
                    <section className="odm-summary">
                        <div className="odm-summary-row">
                            <span>{t('subtotal')}</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="odm-summary-row">
                            <span>{t('deliveryFee')}</span>
                            <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : t('free')}</span>
                        </div>
                        <div className="odm-summary-row odm-summary-total">
                            <span>{t('totalAmount')}</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </section>

                    {/* Download Invoice */}
                    <div className="odm-invoice-section">
                        <button
                            className="odm-download-invoice-btn"
                            onClick={() => {
                                try {
                                    generateInvoice(order, storeName, storePhone, storeEmail);
                                } catch (err) {
                                    console.error('Invoice generation failed:', err);
                                    alert('Failed to generate receipt. Please try again.');
                                }
                            }}
                        >
                            <Download size={16} />
                            {t('downloadReceiptPdf')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderDetailsModal;
