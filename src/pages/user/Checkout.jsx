import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Phone, User, Mail, CreditCard, Shield, Truck,
    ChevronRight, ShoppingBag, CheckCircle, ArrowLeft, Clock, Tag, Banknote, Plus, Trash2
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { createOrder, getUserAddresses, saveUserAddress, deleteUserAddress } from '../../services/database';
import { initiateRazorpayPayment, generateOrderId } from '../../services/razorpay';
import { useLanguage } from '../../contexts/LanguageContext';
import './Checkout.css';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const { settings } = useSettings();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [address, setAddress] = useState({
        fullName: currentUser?.displayName || '',
        phone: '',
        email: currentUser?.email || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: '',
    });

    const deliveryFee = cartTotal >= settings.minOrderForFreeDelivery ? 0 : settings.deliveryFee;
    const finalTotal = cartTotal + deliveryFee;

    useEffect(() => {
        const loadAddresses = async () => {
            if (!currentUser) return;
            try {
                const addresses = await getUserAddresses(currentUser.uid);
                setSavedAddresses(addresses);
                if (addresses.length > 0) {
                    setSelectedAddressId(addresses[0].id);
                    const first = addresses[0];
                    setAddress({
                        fullName: first.fullName || '',
                        phone: first.phone || '',
                        email: first.email || '',
                        addressLine1: first.addressLine1 || '',
                        addressLine2: first.addressLine2 || '',
                        city: first.city || '',
                        state: first.state || 'Tamil Nadu',
                        pincode: first.pincode || '',
                    });
                } else {
                    setShowNewForm(true);
                }
            } catch (err) {
                console.error('Error loading addresses:', err);
                setShowNewForm(true);
            } finally {
                setLoadingAddresses(false);
            }
        };
        loadAddresses();
    }, [currentUser]);

    const selectAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setShowNewForm(false);
        setAddress({
            fullName: addr.fullName || '',
            phone: addr.phone || '',
            email: addr.email || '',
            addressLine1: addr.addressLine1 || '',
            addressLine2: addr.addressLine2 || '',
            city: addr.city || '',
            state: addr.state || 'Tamil Nadu',
            pincode: addr.pincode || '',
        });
    };

    const startNewAddress = () => {
        setSelectedAddressId(null);
        setShowNewForm(true);
        setAddress({
            fullName: currentUser?.displayName || '',
            phone: '',
            email: currentUser?.email || '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: 'Tamil Nadu',
            pincode: '',
        });
    };

    const handleDeleteAddress = async (addrId) => {
        try {
            await deleteUserAddress(currentUser.uid, addrId);
            const updated = savedAddresses.filter(a => a.id !== addrId);
            setSavedAddresses(updated);
            if (selectedAddressId === addrId) {
                if (updated.length > 0) {
                    selectAddress(updated[0]);
                } else {
                    startNewAddress();
                }
            }
        } catch (err) {
            console.error('Error deleting address:', err);
        }
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const validateAddress = () => {
        const required = ['fullName', 'phone', 'addressLine1', 'city', 'pincode'];
        for (const field of required) {
            if (!address[field].trim()) {
                alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }
        if (address.phone.length < 10) {
            alert('Please enter a valid phone number');
            return false;
        }
        if (address.pincode.length < 6) {
            alert('Please enter a valid pincode');
            return false;
        }
        return true;
    };

    const handleProceedToPayment = async () => {
        if (validateAddress()) {
            // Save this address if it's a new one
            if (showNewForm && currentUser) {
                try {
                    const newId = await saveUserAddress(currentUser.uid, {
                        fullName: address.fullName,
                        phone: address.phone,
                        email: address.email,
                        addressLine1: address.addressLine1,
                        addressLine2: address.addressLine2,
                        city: address.city,
                        state: address.state,
                        pincode: address.pincode,
                    });
                    const newAddr = { id: newId, ...address };
                    setSavedAddresses(prev => [...prev, newAddr]);
                    setSelectedAddressId(newId);
                    setShowNewForm(false);
                } catch (err) {
                    console.error('Error saving address:', err);
                }
            }
            setStep(2);
        }
    };

    // Remove undefined values recursively (Firebase rejects undefined)
    const removeUndefined = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(item => removeUndefined(item));
        }
        if (obj !== null && typeof obj === 'object') {
            const cleaned = {};
            for (const [key, value] of Object.entries(obj)) {
                if (value !== undefined) {
                    cleaned[key] = removeUndefined(value);
                }
            }
            return cleaned;
        }
        return obj;
    };

    const handlePayment = async () => {
        if (processing) return;
        setProcessing(true);

        const orderId = generateOrderId();

        // Helper to build common order data
        const buildOrderData = (paymentInfo) => ({
            orderId: orderId,
            items: cart.map((item, index) => ({
                productId: String(item.id || `item_${index}`),
                name: String(item.name || 'Unknown Item'),
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 1,
                image: String(item.image || ''),
                category: String(item.category || ''),
                unit: String(item.unit || ''),
                brand: String(item.brand || ''),
            })),
            address: {
                fullName: String(address.fullName || ''),
                phone: String(address.phone || ''),
                email: String(address.email || ''),
                addressLine1: String(address.addressLine1 || ''),
                addressLine2: String(address.addressLine2 || ''),
                city: String(address.city || ''),
                state: String(address.state || ''),
                pincode: String(address.pincode || ''),
            },
            subtotal: Number(cartTotal) || 0,
            deliveryFee: Number(deliveryFee) || 0,
            total: Number(finalTotal) || 0,
            payment: paymentInfo,
            customerName: String(address.fullName || ''),
            customerEmail: String(address.email || ''),
            customerPhone: String(address.phone || ''),
            status: 'pending',
        });

        // ===== Cash on Delivery =====
        if (paymentMethod === 'cod') {
            try {
                const orderData = buildOrderData({
                    method: 'cod',
                    status: 'unpaid',
                });
                const cleanOrderData = removeUndefined(orderData);
                await createOrder(currentUser.uid, cleanOrderData);
                await clearCart();
                navigate('/order-success', {
                    state: {
                        orderId,
                        paymentId: 'COD',
                        paymentMethod: 'cod',
                        total: finalTotal,
                        itemCount: cart.length,
                    }
                });
            } catch (error) {
                console.error('Error placing COD order:', error);
                alert('Failed to place order. Please try again.');
            } finally {
                setProcessing(false);
            }
            return;
        }

        // ===== Razorpay Payment =====
        try {
            const payment = await initiateRazorpayPayment({
                amount: finalTotal,
                description: `Order ${orderId} - ${cart.length} items`,
                orderId,
                prefill: {
                    name: address.fullName,
                    email: address.email,
                    contact: address.phone,
                },
            });

            try {
                const orderData = buildOrderData({
                    razorpay_payment_id: String(payment.razorpay_payment_id || ''),
                    razorpay_order_id: String(payment.razorpay_order_id || ''),
                    method: 'razorpay',
                    status: 'paid',
                });
                const cleanOrderData = removeUndefined(orderData);
                await createOrder(currentUser.uid, cleanOrderData);
                await clearCart();
                navigate('/order-success', {
                    state: {
                        orderId,
                        paymentId: payment.razorpay_payment_id,
                        paymentMethod: 'razorpay',
                        total: finalTotal,
                        itemCount: cart.length,
                    }
                });
            } catch (error) {
                console.error('Error saving order:', error);
                await clearCart();
                navigate('/order-success', {
                    state: {
                        orderId,
                        paymentId: payment.razorpay_payment_id,
                        paymentMethod: 'razorpay',
                        total: finalTotal,
                        itemCount: cart.length,
                    }
                });
            }
        } catch (error) {
            console.log('Payment not completed:', error.message || error);
        } finally {
            setProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <motion.div
                    className="checkout-empty-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <ShoppingBag size={80} strokeWidth={1} />
                    <h2>{t('yourCartEmpty')}</h2>
                    <p>{t('addItemsBeforeCheckout')}</p>
                    <button onClick={() => navigate('/shop')} className="checkout-back-to-shop">
                        <ArrowLeft size={20} />
                        {t('goToShop')}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            {/* Header */}
            <div className="checkout-header">
                <h1>{t('checkout')}</h1>
                <p>{t('completeOrderSecurely')}</p>
            </div>

            {/* Progress Steps */}
            <div className="checkout-progress">
                <div className={`checkout-progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                    <div className="checkout-step-circle">
                        {step > 1 ? <CheckCircle size={20} /> : <span>1</span>}
                    </div>
                    <span className="checkout-step-label">{t('deliveryAddress')}</span>
                </div>
                <div className="checkout-progress-line" />
                <div className={`checkout-progress-step ${step >= 2 ? 'active' : ''}`}>
                    <div className="checkout-step-circle">
                        <span>2</span>
                    </div>
                    <span className="checkout-step-label">{t('payment')}</span>
                </div>
            </div>

            <div className="checkout-container">
                {/* Left - Form */}
                <div className="checkout-form-area">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="address"
                                className="checkout-card"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                            >
                                <div className="checkout-card-header">
                                    <MapPin size={22} />
                                    <h2>{t('deliveryAddress')}</h2>
                                </div>

                                {/* Saved Addresses */}
                                {!loadingAddresses && savedAddresses.length > 0 && (
                                    <div className="saved-addresses-section">
                                        <h3 className="saved-addresses-title">{t('savedAddresses')}</h3>
                                        <div className="saved-addresses-list">
                                            {savedAddresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    className={`saved-address-card ${selectedAddressId === addr.id && !showNewForm ? 'selected' : ''}`}
                                                    onClick={() => selectAddress(addr)}
                                                >
                                                    <div className="saved-address-radio">
                                                        <div className="saved-radio-dot" />
                                                    </div>
                                                    <div className="saved-address-info">
                                                        <strong>{addr.fullName}</strong>
                                                        <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                                                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                        <span className="saved-address-phone"><Phone size={12} /> {addr.phone}</span>
                                                    </div>
                                                    <button
                                                        className="saved-address-delete"
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                                                        title="Delete address"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {!showNewForm && (
                                            <button className="add-new-address-btn" onClick={startNewAddress}>
                                                <Plus size={18} />
                                                {t('addNewAddress')}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {loadingAddresses && (
                                    <div className="address-loading">
                                        <div className="address-loading-spinner" />
                                        <p>{t('loadingSavedAddresses')}</p>
                                    </div>
                                )}

                                {/* New Address Form */}
                                {showNewForm && (
                                    <div className="new-address-form-wrapper">
                                        {savedAddresses.length > 0 && (
                                            <div className="new-address-form-header">
                                                <h3>{t('newAddress')}</h3>
                                                <button className="cancel-new-btn" onClick={() => {
                                                    if (savedAddresses.length > 0) {
                                                        selectAddress(savedAddresses[0]);
                                                    }
                                                }}>{t('cancel')}</button>
                                            </div>
                                        )}
                                        <div className="checkout-form-grid">
                                            <div className="checkout-form-group full-width">
                                                <label>
                                                    <User size={16} />
                                                    {t('fullName')} *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={address.fullName}
                                                    onChange={handleAddressChange}
                                                    placeholder={t('enterFullName')}
                                                />
                                            </div>

                                            <div className="checkout-form-group">
                                                <label>
                                                    <Phone size={16} />
                                                    {t('phoneNumber')} *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={address.phone}
                                                    onChange={handleAddressChange}
                                                    placeholder={t('mobileNumber')}
                                                    maxLength={10}
                                                />
                                            </div>

                                            <div className="checkout-form-group">
                                                <label>
                                                    <Mail size={16} />
                                                    {t('email')}
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={address.email}
                                                    onChange={handleAddressChange}
                                                    placeholder={t('emailPlaceholder')}
                                                />
                                            </div>

                                            <div className="checkout-form-group full-width">
                                                <label>
                                                    <MapPin size={16} />
                                                    {t('addressLine1')} *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="addressLine1"
                                                    value={address.addressLine1}
                                                    onChange={handleAddressChange}
                                                    placeholder={t('houseFlatStreet')}
                                                />
                                            </div>

                                            <div className="checkout-form-group full-width">
                                                <label>{t('addressLine2')}</label>
                                                <input
                                                    type="text"
                                                    name="addressLine2"
                                                    value={address.addressLine2}
                                                    onChange={handleAddressChange}
                                                    placeholder={t('landmarkArea')}
                                                />
                                            </div>

                                            <div className="checkout-form-group">
                                                <label>{t('city')} *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={address.city}
                                                    onChange={handleAddressChange}
                                                    placeholder={t('city')}
                                                />
                                            </div>

                                            <div className="checkout-form-group">
                                                <label>{t('state')}</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={address.state}
                                                    onChange={handleAddressChange}
                                                    placeholder={t('state')}
                                                />
                                            </div>

                                            <div className="checkout-form-group">
                                                <label>{t('pinCode')} *</label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={address.pincode}
                                                    onChange={handleAddressChange}
                                                    placeholder={t('pincodePlaceholder')}
                                                    maxLength={6}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button className="checkout-proceed-btn" onClick={handleProceedToPayment}>
                                    {t('proceedToPayment')}
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="payment"
                                className="checkout-card"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                            >
                                <div className="checkout-card-header">
                                    <CreditCard size={22} />
                                    <h2>{t('payment')}</h2>
                                </div>

                                {/* Delivery Address Summary */}
                                <div className="checkout-address-summary-card">
                                    <div className="checkout-address-summary-label">
                                        <MapPin size={16} />
                                        <span>{t('deliveringTo')}</span>
                                        <button className="checkout-change-btn" onClick={() => setStep(1)}>{t('change')}</button>
                                    </div>
                                    <div className="checkout-address-summary-content">
                                        <strong>{address.fullName}</strong>
                                        <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                                        <p>{address.city}, {address.state} - {address.pincode}</p>
                                        <p className="checkout-summary-phone">📞 {address.phone}</p>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="checkout-payment-options">
                                    <h3>{t('selectPaymentMethod')}</h3>

                                    <div
                                        className={`checkout-payment-option ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('razorpay')}
                                    >
                                        <div className="checkout-option-radio">
                                            <div className="checkout-radio-dot" />
                                        </div>
                                        <div className="checkout-option-info">
                                            <div className="checkout-option-title">
                                                <CreditCard size={18} />
                                                <span>{t('payWithRazorpay')}</span>
                                            </div>
                                            <p className="checkout-option-desc">
                                                {t('razorpayDesc')}
                                            </p>
                                        </div>
                                        <div className="checkout-option-icons">
                                            <span>💳</span>
                                            <span>📱</span>
                                            <span>🏦</span>
                                        </div>
                                    </div>

                                    <div
                                        className={`checkout-payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        <div className="checkout-option-radio">
                                            <div className="checkout-radio-dot" />
                                        </div>
                                        <div className="checkout-option-info">
                                            <div className="checkout-option-title">
                                                <Banknote size={18} />
                                                <span>{t('cashOnDelivery')}</span>
                                            </div>
                                            <p className="checkout-option-desc">
                                                {t('codDesc')}
                                            </p>
                                        </div>
                                        <div className="checkout-option-icons">
                                            <span>💵</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Info */}
                                <div className="checkout-security-info">
                                    <Shield size={18} />
                                    <div>
                                        {paymentMethod === 'razorpay' ? (
                                            <>
                                                <strong>{t('securePayment')}</strong>
                                                <p>{t('securePaymentDesc')}</p>
                                            </>
                                        ) : (
                                            <>
                                                <strong>{t('cashOnDelivery')}</strong>
                                                <p>{t('codInfo')}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className={`checkout-pay-now-btn ${processing ? 'processing' : ''} ${paymentMethod === 'cod' ? 'cod-btn' : ''}`}
                                    onClick={handlePayment}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <div className="checkout-btn-spinner" />
                                            {t('processing')}
                                        </>
                                    ) : paymentMethod === 'cod' ? (
                                        <>
                                            <Banknote size={20} />
                                            {t('placeOrder')} — ₹{finalTotal.toFixed(2)}
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={20} />
                                            {t('pay')} ₹{finalTotal.toFixed(2)}
                                        </>
                                    )}
                                </button>

                                <button className="checkout-back-btn" onClick={() => setStep(1)}>
                                    <ArrowLeft size={18} />
                                    {t('backToAddress')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right - Order Summary */}
                <div className="checkout-summary-area">
                    <div className="checkout-order-summary">
                        <h3>
                            <ShoppingBag size={20} />
                            {t('orderSummary')}
                        </h3>

                        <div className="checkout-summary-items">
                            {cart.map((item, index) => (
                                <div key={item.id || `cart-item-${index}`} className="checkout-summary-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="checkout-summary-item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">{t('qty')}: {item.quantity}</span>
                                    </div>
                                    <span className="item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-summary-breakdown">
                            <div className="checkout-breakdown-row">
                                <span>{t('subtotal')} ({cart.length} {t('items')})</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="checkout-breakdown-row">
                                <span>
                                    <Truck size={16} /> {t('delivery')}
                                </span>
                                <span className={deliveryFee === 0 ? 'free-tag' : ''}>
                                    {deliveryFee === 0 ? t('free') : `₹${deliveryFee}`}
                                </span>
                            </div>
                        </div>

                        <div className="checkout-grand-total">
                            <span>{t('total')}</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>

                        <div className="checkout-delivery-estimate">
                            <Clock size={16} />
                            <span>Estimated delivery: <strong>2-3 days</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
