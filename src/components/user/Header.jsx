import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { currentUser, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { settings } = useSettings();
    const { t } = useLanguage();
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
        { path: '/', label: t('home') },
        { path: '/shop', label: t('shopByCategory') },
        { path: '/about', label: t('about') },
        { path: '/contact', label: t('contact') }
    ];

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <img src="/velmurgan-logo.png" alt={settings.storeName} className="header-logo-img" />
                    <span className="header-logo-name">{settings.storeName}</span>
                </Link>

                <form className="header-search" onSubmit={handleSearch}>
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
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
                                            <p className="dropdown-name">{isAdmin ? "Velmurgan Store" : currentUser.displayName || t('user')}</p>
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
                                            {t('myOrders')}
                                        </Link>
                                        {!isAdmin && (
                                            <Link to="/wishlist" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                                <Heart size={18} />
                                                {t('wishlist')}
                                            </Link>
                                        )}
                                        {!isAdmin && (
                                            <Link to="/settings" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                                                <Settings size={18} />
                                                {t('settings')}
                                            </Link>
                                        )}

                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            <LogOut size={18} />
                                            {t('logout')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">
                            {t('login')}
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
