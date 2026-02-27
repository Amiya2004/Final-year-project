import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onClick }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const isFavorite = isInWishlist(product.name);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If product has brands or variants, open modal instead of quick add
        if (product.brands || product.availableUnits) {
            onClick(product);
            return;
        }

        addToCart(product);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <motion.div
            className={styles.productCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            onClick={() => onClick && onClick(product)}
        >
            <div className={styles.productImageContainer}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <button
                    className={`${styles.wishlistBtn} ${isFavorite ? styles.wishlistActive : ''}`}
                    onClick={handleWishlist}
                >
                    <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#64748b'} />
                </button>

                {product.stock <= 10 && product.stock > 0 && (
                    <span className={`${styles.productBadge} ${styles.lowStock}`}>Low Stock</span>
                )}
                {product.stock === 0 && (
                    <span className={`${styles.productBadge} ${styles.outOfStock}`}>Out of Stock</span>
                )}

                <div className={styles.overlay}>
                    <span>View Details</span>
                </div>
            </div>

            <div className={styles.productInfo}>
                <span className={styles.productCategory}>{product.category}</span>
                <h3 className={styles.productName}>{product.name}</h3>

                <div className={styles.productRating}>
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                            color={i < Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'}
                        />
                    ))}
                    <span className={styles.ratingText}>{product.rating}</span>
                </div>

                <div className={styles.productFooter}>
                    <div className={styles.productPrice}>
                        <span className={styles.priceCurrent}>₹{product.price}</span>
                        <span className={styles.priceUnit}>/{product.unit}</span>
                    </div>

                    <motion.button
                        className={styles.addToCartBtn}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        <ShoppingCart size={18} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
