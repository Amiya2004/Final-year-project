import { Link } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const { settings } = useSettings();
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">🛒</span>
                            <span className="logo-text">{settings.storeName}</span>
                        </Link>
                        <p className="footer-description">
                            At our grocery store, we are committed to bringing you the freshest and highest-quality products every day. From farm-fresh vegetables to everyday grocery essentials, we carefully select every item to meet your family’s needs. Our goal is to make grocery shopping simple, reliable, and affordable for everyone.
                        </p>

                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/orders">Track Order</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Categories</h4>
                        <ul>
                            <li><Link to="/shop?category=fruits-vegetables">Fruits & Vegetables</Link></li>
                            <li><Link to="/shop?category=dairy-eggs">Dairy & Eggs</Link></li>
                            <li><Link to="/shop?category=spices">Spices & Masala</Link></li>
                            <li><Link to="/shop?category=bakery">Bakery</Link></li>
                            <li><Link to="/shop?category=beverages">Beverages</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <div className="contact-item">
                            <MapPin size={18} />
                            <span>{settings.storeName}, Sullipalayam, Perundurai-638052</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={18} />
                            <span>+91 9842856303</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={18} />
                            <span>{settings.contactEmail}</span>
                        </div>

                        <div className="newsletter">
                            <h5>Subscribe to Newsletter</h5>
                            <form className="newsletter-form">
                                <input type="email" placeholder="Enter your email" />
                                <button type="submit">Subscribe</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Refund Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
