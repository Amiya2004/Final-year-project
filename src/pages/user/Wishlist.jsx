import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Row, Col, Empty, Button, Card } from 'antd';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const { Title, Text, Paragraph } = Typography;

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
        // Optionally remove from wishlist after adding to cart
        // removeFromWishlist(product.name);
    };

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <Title level={2}>My Wishlist</Title>
                <Text type="secondary">Keep track of items you love</Text>
            </div>

            <div className="wishlist-container">
                {wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="empty-wishlist"
                    >
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div className="empty-description">
                                    <Title level={4}>Your wishlist is empty</Title>
                                    <Paragraph>Add items that you'd like to buy later!</Paragraph>
                                </div>
                            }
                        >
                            <Link to="/shop">
                                <Button type="primary" size="large" className="shop-now-btn">
                                    Explore Products
                                </Button>
                            </Link>
                        </Empty>
                    </motion.div>
                ) : (
                    <Row gutter={[24, 24]}>
                        <AnimatePresence>
                            {wishlist.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.name}>
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card
                                            className="wishlist-item-card"
                                            cover={
                                                <div className="wishlist-image-container">
                                                    <img alt={product.name} src={product.image} />
                                                    <button
                                                        className="remove-wishlist-btn"
                                                        onClick={() => removeFromWishlist(product.name)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            }
                                        >
                                            <div className="wishlist-item-info">
                                                <span className="item-category">{product.category}</span>
                                                <h3 className="item-name">{product.name}</h3>
                                                <div className="item-footer">
                                                    <span className="item-price">₹{product.price}</span>
                                                    <Button
                                                        type="primary"
                                                        icon={<ShoppingCart size={16} />}
                                                        onClick={() => handleAddToCart(product)}
                                                        className="add-to-cart-btn"
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </AnimatePresence>
                    </Row>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
