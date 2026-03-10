import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Shield, Truck, Clock, Check, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './ProductDetailsModal.module.css';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { t } = useLanguage();
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    // Detect new brand format: [{name, variants}] vs old: ['string']
    const isNewFormat = product?.brands && product.brands.length > 0 && typeof product.brands[0] === 'object' && product.brands[0].variants;

    const brandNames = isNewFormat
        ? product.brands.map(b => b.name)
        : (product?.brands || []);

    const getVariantsForBrand = (brandName) => {
        if (isNewFormat) {
            const brand = product.brands.find(b => b.name === brandName);
            return (brand?.variants || []).map(v => ({ label: v.label, price: v.price, stock: v.stock }));
        }
        return (product?.availableUnits || []).map(u =>
            typeof u === 'string' ? { label: u, price: product.price } : { label: u.label || u, price: (u.price && u.price > 0) ? u.price : product.price }
        );
    };

    useEffect(() => {
        if (product) {
            const firstBrand = brandNames[0] || '';
            setSelectedBrand(firstBrand);
            const variants = getVariantsForBrand(firstBrand);
            if (variants.length > 0) {
                setSelectedUnit({ label: variants[0].label, price: variants[0].price });
            } else {
                // Fallback to availableUnits if no brands
                const firstUnit = product.availableUnits?.[0];
                if (firstUnit) {
                    const label = firstUnit.label || firstUnit;
                    const price = (firstUnit.price && firstUnit.price > 0) ? firstUnit.price : product.price;
                    setSelectedUnit({ label, price });
                } else {
                    setSelectedUnit({ label: product.unit || '', price: product.price || 0 });
                }
            }
            setQuantity(1);
            setAdded(false);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    // Derived price based on selection
    const currentPrice = (selectedUnit?.price && selectedUnit.price > 0) ? selectedUnit.price : product.price;
    const unitLabel = selectedUnit?.label || selectedUnit || product.unit;

    const handleAddToCart = () => {
        const productToAdd = {
            ...product,
            brand: selectedBrand,
            unit: unitLabel,
            price: currentPrice, // Use the variant price
            quantity: quantity
        };
        addToCart(productToAdd);
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            onClose();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.modalOverlay} onClick={onClose}>
                    <motion.div
                        className={styles.modalContainer}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className={styles.modalContent}>
                            <div className={styles.imageSection}>
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                            </div>

                            <div className={styles.infoSection}>
                                <div className={styles.titleRow}>
                                    <span className={styles.categoryBadge}>{product.category}</span>
                                    <button
                                        className={`${styles.wishlistBtn} ${isInWishlist(product.name) ? styles.wishlisted : ''}`}
                                        onClick={() => toggleWishlist(product)}
                                        title={isInWishlist(product.name) ? t('removeFromWishlist') : t('addToWishlist')}
                                    >
                                        <Heart
                                            size={22}
                                            fill={isInWishlist(product.name) ? '#ef4444' : 'none'}
                                            color={isInWishlist(product.name) ? '#ef4444' : '#94a3b8'}
                                        />
                                    </button>
                                </div>
                                <h2 className={styles.productTitle}>{product.name}</h2>

                                <div className={styles.ratingInfo}>
                                    <div className={styles.stars}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                                                color={i < Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'}
                                            />
                                        ))}
                                    </div>
                                    <span className={styles.ratingValue}>{product.rating} {t('reviews50')}</span>
                                </div>

                                <div className={styles.priceSection}>
                                    <span className={styles.currentPrice}>₹{currentPrice}</span>
                                    <span className={styles.unitText}>/ {unitLabel}</span>
                                </div>

                                <p className={styles.description}>
                                    Fresh and high-quality {product.name.toLowerCase()} sourced directly from local farms.
                                    Rich in nutrients and guaranteed freshness.
                                </p>

                                {/* Brand Selection - Only show if brands exist */}
                                {brandNames.length > 0 && (
                                    <div className={styles.selectionGroup}>
                                        <label>{t('selectBrand')}</label>
                                        <div className={styles.optionGrid}>
                                            {brandNames.map(brand => (
                                                <button
                                                    key={brand}
                                                    className={`${styles.optionBtn} ${selectedBrand === brand ? styles.active : ''}`}
                                                    onClick={() => {
                                                        setSelectedBrand(brand);
                                                        const variants = getVariantsForBrand(brand);
                                                        if (variants.length > 0) {
                                                            setSelectedUnit({ label: variants[0].label, price: variants[0].price });
                                                        }
                                                    }}
                                                >
                                                    {brand}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Unit/Size Selection */}
                                {(() => {
                                    const variants = brandNames.length > 0 ? getVariantsForBrand(selectedBrand) : (product.availableUnits || []).map((u) => {
                                        const label = u.label || u;
                                        const unitPrice = (u.price && u.price > 0) ? u.price : product.price;
                                        return { label, price: unitPrice };
                                    });
                                    return variants.length > 0 && (
                                        <div className={styles.selectionGroup}>
                                            <label>{t('selectQuantityUnit')}</label>
                                            <div className={styles.optionGrid}>
                                                {variants.map((v, index) => {
                                                    const isActive = selectedUnit?.label === v.label;
                                                    return (
                                                        <button
                                                            key={index}
                                                            className={`${styles.optionBtn} ${isActive ? styles.active : ''}`}
                                                            onClick={() => setSelectedUnit({ label: v.label, price: v.price })}
                                                        >
                                                            {v.label} - ₹{v.price}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className={styles.quantitySection}>
                                    <label>{t('quantity')}</label>
                                    <div className={styles.quantityControls}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >-</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                    </div>
                                </div>

                                <div className={styles.trustBadges}>
                                    <div className={styles.badge}>
                                        <Shield size={18} />
                                        <span>{t('qualityGuaranteed')}</span>
                                    </div>
                                    <div className={styles.badge}>
                                        <Truck size={18} />
                                        <span>{t('freeDeliveryOver500')}</span>
                                    </div>
                                </div>

                                <motion.button
                                    className={`${styles.addToCartBtn} ${added ? styles.added : ''}`}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                >
                                    {added ? (
                                        <>
                                            <Check size={20} />
                                            {t('addedToCart')}
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={20} />
                                            {t('addToCart')} • ₹{currentPrice * quantity}
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailsModal;
