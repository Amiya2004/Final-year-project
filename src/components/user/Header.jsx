import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { currentUser, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop by Category' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' }
    ];

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <span className="logo-icon">🛒</span>
                    <span className="logo-accent">Nellai Velmurgan Store</span>
                </Link>

                <form className="header-search" onSubmit={handleSearch}>
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">


                    <Link to="/cart" className="action-btn cart-btn">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <motion.span
                                className="cart-badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                key={`cart-${cartCount}`}
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </Link>

                    {currentUser ? (
                        <div className="profile-dropdown">
                            <button
                                className="action-btn profile-btn"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <User size={22} />
                            </button>
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        className="dropdown-menu"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div className="dropdown-header">
                                            <p className="dropdown-name">{currentUser.displayName || 'User'}</p>
                                            <p className="dropdown-email">{currentUser.email}</p>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        {isAdmin && (
                                            <Link to="/admin" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                                <Package size={18} />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link to="/orders" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                            <Package size={18} />
                                            My Orders
                                        </Link>
                                        <Link to="/wishlist" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                            <Heart size={18} />
                                            Wishlist
                                        </Link>

                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">
                            Login
                        </Link>
                    )}

                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
