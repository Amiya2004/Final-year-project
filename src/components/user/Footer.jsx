import { Link } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const { settings } = useSettings();
    const { t } = useLanguage();
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src="/velmurgan-logo.png" alt={settings.storeName} className="footer-logo-img" style={{ width: '40px', height: '40px' }} />
                            <span className="logo-text">{settings.storeName}</span>
                        </Link>
                        <p className="footer-description">
                            {t('footerDescription')}
                        </p>

                    </div>

                    <div className="footer-links">
                        <h4>{t('quickLinks')}</h4>
                        <ul>
                            <li><Link to="/">{t('home')}</Link></li>
                            <li><Link to="/shop">{t('shop')}</Link></li>
                            <li><Link to="/about">{t('aboutUs')}</Link></li>
                            <li><Link to="/contact">{t('contact')}</Link></li>
                            <li><Link to="/orders">{t('trackOrder')}</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>{t('categories')}</h4>
                        <ul>
                            <li><Link to="/shop?category=fruits-vegetables">{t('fruitsVegetables')}</Link></li>
                            <li><Link to="/shop?category=dairy-eggs">{t('dairyEggs')}</Link></li>
                            <li><Link to="/shop?category=spices">{t('spicesMasala')}</Link></li>
                            <li><Link to="/shop?category=bakery">{t('bakery')}</Link></li>
                            <li><Link to="/shop?category=beverages">{t('beverages')}</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>{t('contactUs')}</h4>
                        <div className="contact-item">
                            <MapPin size={18} />
                            <span>156, Nellai Velmurgan Store, Sullipalayam, Perundurai-638052</span>
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
                            <h5>{t('subscribeNewsletter')}</h5>
                            <form className="newsletter-form">
                                <input type="email" placeholder={t('enterEmail')} />
                                <button type="submit">{t('subscribe')}</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {settings.storeName}. {t('allRightsReserved')}</p>
                    <div className="footer-bottom-links">
                        <a href="#">{t('privacyPolicy')}</a>
                        <a href="#">{t('termsOfService')}</a>
                        <a href="#">{t('refundPolicy')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
