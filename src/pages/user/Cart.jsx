import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { currentUser } = useAuth();
    const { settings } = useSettings();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const deliveryFee = cartTotal >= settings.minOrderForFreeDelivery ? 0 : settings.deliveryFee;
    const finalTotal = cartTotal + deliveryFee;

    const handleCheckout = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <motion.div
                    className="empty-cart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <ShoppingBag size={80} strokeWidth={1} />
                    <h2>{t('yourCartEmpty')}</h2>
                    <p>{t('cartEmptyMessage')}</p>
                    <Link to="/shop" className="continue-shopping">
                        <ArrowLeft size={20} />
                        {t('continueShopping')}
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>{t('shoppingCart')}</h1>
                <p>{cart.length} {t('itemsInCart')}</p>
            </div>

            <div className="cart-container">
                <div className="cart-items">
                    {cart.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className="cart-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <img src={item.image} alt={item.name} className="item-image" />

                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="item-category">{item.category}</p>
                                <p className="item-unit">₹{item.price}/{item.unit}</p>
                            </div>

                            <div className="quantity-controls">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus size={18} />
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="item-price">
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </div>

                            <button
                                className="remove-btn"
                                onClick={() => removeFromCart(item.id)}
                            >
                                <Trash2 size={20} />
                            </button>
                        </motion.div>
                    ))}

                    <div className="cart-actions">
                        <Link to="/shop" className="continue-link">
                            <ArrowLeft size={18} />
                            {t('continueShopping')}
                        </Link>
                        <button className="clear-cart" onClick={clearCart}>
                            {t('clearCart')}
                        </button>
                    </div>
                </div>

                <div className="cart-summary">
                    <h3>{t('orderSummary')}</h3>

                    <div className="summary-rows">
                        <div className="summary-row">
                            <span>{t('subtotal')}</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>{t('delivery')}</span>
                            <span>{deliveryFee === 0 ? t('free') : `₹${deliveryFee}`}</span>
                        </div>
                        {cartTotal < settings.minOrderForFreeDelivery && cartTotal > 0 && (
                            <p className="free-delivery-hint">
                                Add ₹{(settings.minOrderForFreeDelivery - cartTotal).toFixed(2)} more for free delivery
                            </p>
                        )}
                    </div>

                    <div className="summary-total">
                        <span>{t('total')}</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                    </div>

                    <button className="checkout-btn" onClick={handleCheckout}>
                        <CreditCard size={20} />
                        {t('proceedToCheckout')}
                    </button>

                    <div className="payment-methods">
                        <p>{t('weAccept')}</p>
                        <div className="methods-icons">
                            <span>💳</span>
                            <span>📱</span>
                            <span>🏦</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
