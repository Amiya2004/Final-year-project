import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <div className="wishlist-title-row">
                    <Heart size={28} fill="#ef4444" color="#ef4444" />
                    <h2>My Wishlist</h2>
                </div>
                <p>You have {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
            </div>

            {wishlist.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="empty-wishlist"
                >
                    <Heart size={64} color="#cbd5e1" />
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love and buy them later!</p>
                    <Link to="/shop" className="explore-btn">
                        Explore Products <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="wishlist-grid">
                    <AnimatePresence>
                        {wishlist.map((product) => (
                            <motion.div
                                key={product.name}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ duration: 0.3 }}
                                className="wishlist-card"
                            >
                                <div className="wishlist-img-wrap">
                                    <img src={product.image} alt={product.name} />
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromWishlist(product.name)}
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="wishlist-info">
                                    <span className="wishlist-category">{product.category}</span>
                                    <h3 className="wishlist-name">{product.name}</h3>
                                    <div className="wishlist-footer">
                                        <span className="wishlist-price">&#8377;{product.price}</span>
                                        <button
                                            className="add-cart-btn"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <ShoppingCart size={16} />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
