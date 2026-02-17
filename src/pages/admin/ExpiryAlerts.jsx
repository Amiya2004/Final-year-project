import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Trash2, Tag, Package, Clock } from 'lucide-react';
import { sampleProducts } from '../../data/sampleData';
import './ExpiryAlerts.css';

const ExpiryAlerts = () => {
    const today = new Date();

    const getExpiryStatus = (expiryDate) => {
        const expiry = new Date(expiryDate);
        const daysUntil = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysUntil < 0) return { status: 'expired', label: 'Expired', days: Math.abs(daysUntil), color: '#dc2626' };
        if (daysUntil <= 7) return { status: 'critical', label: 'Critical', days: daysUntil, color: '#ef4444' };
        if (daysUntil <= 14) return { status: 'warning', label: 'Warning', days: daysUntil, color: '#f97316' };
        if (daysUntil <= 30) return { status: 'caution', label: 'Caution', days: daysUntil, color: '#f59e0b' };
        return { status: 'safe', label: 'Safe', days: daysUntil, color: '#22c55e' };
    };

    const expiringProducts = sampleProducts
        .map(p => ({ ...p, expiryInfo: getExpiryStatus(p.expiryDate) }))
        .filter(p => p.expiryInfo.days <= 30)
        .sort((a, b) => a.expiryInfo.days - b.expiryInfo.days);

    const expired = expiringProducts.filter(p => p.expiryInfo.status === 'expired');
    const critical = expiringProducts.filter(p => p.expiryInfo.status === 'critical');
    const warning = expiringProducts.filter(p => p.expiryInfo.status === 'warning');
    const caution = expiringProducts.filter(p => p.expiryInfo.status === 'caution');

    const getSuggestion = (product) => {
        if (product.expiryInfo.status === 'expired') {
            return { action: 'Remove from inventory', icon: Trash2, color: '#dc2626' };
        }
        if (product.expiryInfo.status === 'critical') {
            return { action: 'Apply 50% discount', icon: Tag, color: '#ef4444' };
        }
        if (product.expiryInfo.status === 'warning') {
            return { action: 'Apply 30% discount', icon: Tag, color: '#f97316' };
        }
        return { action: 'Apply 15% discount', icon: Tag, color: '#f59e0b' };
    };

    return (
        <div className="expiry-alerts">
            <div className="page-header">
                <div>
                    <h1>Expiry & Waste Management</h1>
                    <p>Track and manage products nearing expiry to reduce waste</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="expiry-summary">
                <motion.div
                    className="summary-card expired"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <AlertTriangle size={28} />
                    <div className="summary-content">
                        <span className="summary-value">{expired.length}</span>
                        <span className="summary-label">Expired Items</span>
                    </div>
                </motion.div>

                <motion.div
                    className="summary-card critical"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Clock size={28} />
                    <div className="summary-content">
                        <span className="summary-value">{critical.length}</span>
                        <span className="summary-label">Expiring in 7 days</span>
                    </div>
                </motion.div>

                <motion.div
                    className="summary-card warning"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Calendar size={28} />
                    <div className="summary-content">
                        <span className="summary-value">{warning.length}</span>
                        <span className="summary-label">Expiring in 14 days</span>
                    </div>
                </motion.div>

                <motion.div
                    className="summary-card caution"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Package size={28} />
                    <div className="summary-content">
                        <span className="summary-value">{caution.length}</span>
                        <span className="summary-label">Expiring in 30 days</span>
                    </div>
                </motion.div>
            </div>

            {/* Expired Products Section */}
            {expired.length > 0 && (
                <div className="expiry-section">
                    <h2 className="section-title expired">
                        <AlertTriangle size={20} />
                        Expired Products - Remove Immediately
                    </h2>
                    <div className="products-grid">
                        {expired.map((product, index) => (
                            <ProductExpiryCard key={product.name} product={product} index={index} getSuggestion={getSuggestion} />
                        ))}
                    </div>
                </div>
            )}

            {/* Critical Products Section */}
            {critical.length > 0 && (
                <div className="expiry-section">
                    <h2 className="section-title critical">
                        <Clock size={20} />
                        Critical - Expiring Within 7 Days
                    </h2>
                    <div className="products-grid">
                        {critical.map((product, index) => (
                            <ProductExpiryCard key={product.name} product={product} index={index} getSuggestion={getSuggestion} />
                        ))}
                    </div>
                </div>
            )}

            {/* Warning Products Section */}
            {warning.length > 0 && (
                <div className="expiry-section">
                    <h2 className="section-title warning">
                        <Calendar size={20} />
                        Warning - Expiring Within 14 Days
                    </h2>
                    <div className="products-grid">
                        {warning.map((product, index) => (
                            <ProductExpiryCard key={product.name} product={product} index={index} getSuggestion={getSuggestion} />
                        ))}
                    </div>
                </div>
            )}

            {/* Caution Products Section */}
            {caution.length > 0 && (
                <div className="expiry-section">
                    <h2 className="section-title caution">
                        <Package size={20} />
                        Caution - Expiring Within 30 Days
                    </h2>
                    <div className="products-grid">
                        {caution.map((product, index) => (
                            <ProductExpiryCard key={product.name} product={product} index={index} getSuggestion={getSuggestion} />
                        ))}
                    </div>
                </div>
            )}

            {expiringProducts.length === 0 && (
                <div className="no-alerts">
                    <span className="success-icon">✅</span>
                    <h3>All Clear!</h3>
                    <p>No products are expiring within the next 30 days.</p>
                </div>
            )}
        </div>
    );
};

const ProductExpiryCard = ({ product, index, getSuggestion }) => {
    const suggestion = getSuggestion(product);

    return (
        <motion.div
            className={`expiry-card ${product.expiryInfo.status}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
                <h4>{product.name}</h4>
                <p className="product-brand">{product.brand} • {product.category}</p>
                <div className="expiry-info">
                    <span
                        className="expiry-badge"
                        style={{ backgroundColor: `${product.expiryInfo.color}15`, color: product.expiryInfo.color }}
                    >
                        {product.expiryInfo.status === 'expired'
                            ? `Expired ${product.expiryInfo.days} days ago`
                            : `${product.expiryInfo.days} days left`
                        }
                    </span>
                </div>
                <div className="stock-price">
                    <span>Stock: {product.stock} {product.unit}</span>
                    <span>₹{product.price}</span>
                </div>
            </div>
            <button
                className="action-btn"
                style={{ backgroundColor: `${suggestion.color}15`, color: suggestion.color }}
            >
                <suggestion.icon size={18} />
                {suggestion.action}
            </button>
        </motion.div>
    );
};

export default ExpiryAlerts;
