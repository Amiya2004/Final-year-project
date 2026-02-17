import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <motion.div
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                <button className="wishlist-btn">
                    <Heart size={18} />
                </button>
                {product.stock <= 10 && product.stock > 0 && (
                    <span className="product-badge low-stock">Low Stock</span>
                )}
                {product.stock === 0 && (
                    <span className="product-badge out-of-stock">Out of Stock</span>
                )}
            </div>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>

                <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'}
                            color={i < Math.floor(product.rating) ? '#f59e0b' : '#cbd5e1'}
                        />
                    ))}
                    <span className="rating-text">{product.rating}</span>
                </div>

                <div className="product-footer">
                    <div className="product-price">
                        <span className="price-current">₹{product.price}</span>
                        <span className="price-unit">/{product.unit}</span>
                    </div>

                    <motion.button
                        className="add-to-cart-btn"
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
