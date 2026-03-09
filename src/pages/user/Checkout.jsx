import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Phone, User, Mail, CreditCard, Shield, Truck,
    ChevronRight, ShoppingBag, CheckCircle, ArrowLeft, Clock, Tag, Banknote
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { createOrder } from '../../services/database';
import { initiateRazorpayPayment, generateOrderId } from '../../services/razorpay';
import './Checkout.css';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const { settings } = useSettings();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Address, 2: Payment
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'
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

    const handleProceedToPayment = () => {
        if (validateAddress()) {
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
                    <h2>Your cart is empty</h2>
                    <p>Add some items before checking out.</p>
                    <button onClick={() => navigate('/shop')} className="checkout-back-to-shop">
                        <ArrowLeft size={20} />
                        Go to Shop
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            {/* Header */}
            <div className="checkout-header">
                <h1>Checkout</h1>
                <p>Complete your order securely</p>
            </div>

            {/* Progress Steps */}
            <div className="checkout-progress">
                <div className={`checkout-progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                    <div className="checkout-step-circle">
                        {step > 1 ? <CheckCircle size={20} /> : <span>1</span>}
                    </div>
                    <span className="checkout-step-label">Delivery Address</span>
                </div>
                <div className="checkout-progress-line" />
                <div className={`checkout-progress-step ${step >= 2 ? 'active' : ''}`}>
                    <div className="checkout-step-circle">
                        <span>2</span>
                    </div>
                    <span className="checkout-step-label">Payment</span>
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
                                    <h2>Delivery Address</h2>
                                </div>

                                <div className="checkout-form-grid">
                                    <div className="checkout-form-group full-width">
                                        <label>
                                            <User size={16} />
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={address.fullName}
                                            onChange={handleAddressChange}
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="checkout-form-group">
                                        <label>
                                            <Phone size={16} />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={address.phone}
                                            onChange={handleAddressChange}
                                            placeholder="10-digit mobile number"
                                            maxLength={10}
                                        />
                                    </div>

                                    <div className="checkout-form-group">
                                        <label>
                                            <Mail size={16} />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={address.email}
                                            onChange={handleAddressChange}
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="checkout-form-group full-width">
                                        <label>
                                            <MapPin size={16} />
                                            Address Line 1 *
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            value={address.addressLine1}
                                            onChange={handleAddressChange}
                                            placeholder="House/Flat No., Street Name"
                                        />
                                    </div>

                                    <div className="checkout-form-group full-width">
                                        <label>Address Line 2</label>
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={address.addressLine2}
                                            onChange={handleAddressChange}
                                            placeholder="Landmark, Area (Optional)"
                                        />
                                    </div>

                                    <div className="checkout-form-group">
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                            placeholder="City name"
                                        />
                                    </div>

                                    <div className="checkout-form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={address.state}
                                            onChange={handleAddressChange}
                                            placeholder="State"
                                        />
                                    </div>

                                    <div className="checkout-form-group">
                                        <label>Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={address.pincode}
                                            onChange={handleAddressChange}
                                            placeholder="6-digit pincode"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>

                                <button className="checkout-proceed-btn" onClick={handleProceedToPayment}>
                                    Proceed to Payment
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
                                    <h2>Payment</h2>
                                </div>

                                {/* Delivery Address Summary */}
                                <div className="checkout-address-summary-card">
                                    <div className="checkout-address-summary-label">
                                        <MapPin size={16} />
                                        <span>Delivering to</span>
                                        <button className="checkout-change-btn" onClick={() => setStep(1)}>Change</button>
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
                                    <h3>Select Payment Method</h3>

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
                                                <span>Pay with Razorpay</span>
                                            </div>
                                            <p className="checkout-option-desc">
                                                Credit/Debit Card, UPI, Net Banking, Wallets
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
                                                <span>Cash on Delivery</span>
                                            </div>
                                            <p className="checkout-option-desc">
                                                Pay when your order is delivered to your doorstep
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
                                                <strong>100% Secure Payment</strong>
                                                <p>All transactions are secure and encrypted by Razorpay</p>
                                            </>
                                        ) : (
                                            <>
                                                <strong>Cash on Delivery</strong>
                                                <p>Pay with cash when your order arrives. No advance payment needed.</p>
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
                                            Processing...
                                        </>
                                    ) : paymentMethod === 'cod' ? (
                                        <>
                                            <Banknote size={20} />
                                            Place Order — ₹{finalTotal.toFixed(2)}
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={20} />
                                            Pay ₹{finalTotal.toFixed(2)}
                                        </>
                                    )}
                                </button>

                                <button className="checkout-back-btn" onClick={() => setStep(1)}>
                                    <ArrowLeft size={18} />
                                    Back to Address
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
                            Order Summary
                        </h3>

                        <div className="checkout-summary-items">
                            {cart.map((item, index) => (
                                <div key={item.id || `cart-item-${index}`} className="checkout-summary-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="checkout-summary-item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-summary-breakdown">
                            <div className="checkout-breakdown-row">
                                <span>Subtotal ({cart.length} items)</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="checkout-breakdown-row">
                                <span>
                                    <Truck size={16} /> Delivery
                                </span>
                                <span className={deliveryFee === 0 ? 'free-tag' : ''}>
                                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                </span>
                            </div>
                        </div>

                        <div className="checkout-grand-total">
                            <span>Total</span>
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
