import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, AlertTriangle, TrendingDown, TrendingUp, Package, Loader } from 'lucide-react';
import { subscribeToProducts } from '../../services/database';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { sampleCategories } from '../../data/sampleData';
import './StockManagement.css';

const StockManagement = () => {
    const { settings } = useSettings();
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');

    useEffect(() => {
        const unsubscribe = subscribeToProducts((data) => {
            setProducts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getStockStatus = (stock, expiryDate, product) => {
        const daysUntilExpiry = expiryDate ? Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 999;
        const lowThreshold = product?.lowStockThreshold ?? 10;
        const overThreshold = product?.overStockThreshold ?? 200;

        if (stock === 0) return { status: 'out-of-stock', label: t('outOfStockLabel'), color: '#dc2626' };
        // Check variant-level stock status
        if (product?.brands?.length > 0 && typeof product.brands[0] === 'object' && product.brands[0].variants) {
            const hasLowVariant = product.brands.some(b => b.variants.some(v => (v.stock || 0) > 0 && (v.stock || 0) <= lowThreshold));
            const hasOverVariant = product.brands.some(b => b.variants.some(v => (v.stock || 0) > overThreshold));
            if (hasLowVariant) return { status: 'low-stock', label: t('lowStockLabel'), color: '#ef4444' };
            if (hasOverVariant) return { status: 'overstock', label: t('overstockLabel'), color: '#f59e0b' };
        } else {
            if (stock <= lowThreshold) return { status: 'low-stock', label: t('lowStockLabel'), color: '#ef4444' };
            if (stock > overThreshold) return { status: 'overstock', label: t('overstockLabel'), color: '#f59e0b' };
        }
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) return { status: 'expiring', label: t('expiringSoon'), color: '#f97316' };
        return { status: 'normal', label: t('inStock'), color: '#22c55e' };
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const stockStatus = getStockStatus(product.stock, product.expiryDate, product).status;
        const matchesStock = stockFilter === 'all' || stockStatus === stockFilter;

        return matchesSearch && matchesCategory && matchesStock;
    });

    const stockStats = {
        total: products.length,
        lowStock: products.filter(p => {
            const threshold = p.lowStockThreshold ?? 10;
            if (p.brands?.length > 0 && typeof p.brands[0] === 'object' && p.brands[0].variants) {
                return p.brands.some(b => b.variants.some(v => (v.stock || 0) > 0 && (v.stock || 0) <= threshold));
            }
            return p.stock > 0 && p.stock <= threshold;
        }).length,
        overstock: products.filter(p => {
            const threshold = p.overStockThreshold ?? 200;
            if (p.brands?.length > 0 && typeof p.brands[0] === 'object' && p.brands[0].variants) {
                return p.brands.some(b => b.variants.some(v => (v.stock || 0) > threshold));
            }
            return p.stock > threshold;
        }).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        expiring: products.filter(p => {
            if (!p.expiryDate) return false;
            const days = Math.ceil((new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return days <= 30 && days > 0;
        }).length
    };

    if (loading) {
        return (
            <div className="stock-management" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={32} className="spinning" />
                <span style={{ marginLeft: '12px' }}>{t('loadingStockData')}</span>
            </div>
        );
    }

    return (
        <div className="stock-management">
            <div className="page-header">
                <div>
                    <h1>{t('stockManagementTitle')}</h1>
                    <p>{t('monitorInventory')}</p>
                </div>
                <button className="export-btn">
                    <Download size={18} />
                    {t('exportReport')}
                </button>
            </div>

            {/* Stock Overview Cards */}
            <div className="stock-overview">
                <div className="overview-card">
                    <Package size={24} />
                    <div className="overview-info">
                        <span className="overview-value">{stockStats.total}</span>
                        <span className="overview-label">{t('totalProducts')}</span>
                    </div>
                </div>
                <div className="overview-card low">
                    <TrendingDown size={24} />
                    <div className="overview-info">
                        <span className="overview-value">{stockStats.lowStock}</span>
                        <span className="overview-label">{t('lowStockLabel')}</span>
                    </div>
                </div>
                <div className="overview-card overstock">
                    <TrendingUp size={24} />
                    <div className="overview-info">
                        <span className="overview-value">{stockStats.overstock}</span>
                        <span className="overview-label">{t('overstockLabel')}</span>
                    </div>
                </div>
                <div className="overview-card expiring">
                    <AlertTriangle size={24} />
                    <div className="overview-info">
                        <span className="overview-value">{stockStats.expiring}</span>
                        <span className="overview-label">{t('expiringSoon')}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder={t('searchProducts')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">{t('allCategories')}</option>
                    {sampleCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">{t('allStatus')}</option>
                    <option value="low-stock">{t('lowStockFilter')}</option>
                    <option value="overstock">{t('overstockFilter')}</option>
                    <option value="expiring">{t('expiringSoonFilter')}</option>
                    <option value="normal">{t('normalFilter')}</option>
                </select>
            </div>

            {/* Products Table */}
            <motion.div
                className="stock-table-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>{t('product')}</th>

                            <th>{t('category')}</th>
                            <th>{t('stock')}</th>
                            <th>{t('price')}</th>
                            <th>{t('expiryDate')}</th>
                            <th>{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => {
                            const stockInfo = getStockStatus(product.stock, product.expiryDate, product);
                            return (
                                <motion.tr
                                    key={product.id || product.name}
                                    className={stockInfo.status}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <td>
                                        <div className="product-cell">
                                            <img src={product.image} alt={product.name} />
                                            <span>{product.name}</span>
                                        </div>
                                    </td>

                                    <td className="category-cell">{product.category}</td>
                                    <td className="stock-cell">
                                        <span className={`stock-value ${stockInfo.status}`}>
                                            {product.stock} {product.unit}
                                        </span>
                                    </td>
                                    <td className="price-cell">₹{product.price}</td>
                                    <td className="expiry-cell">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString('en-IN') : 'N/A'}</td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: `${stockInfo.color}15`, color: stockInfo.color }}
                                        >
                                            {stockInfo.label}
                                        </span>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>

            {filteredProducts.length === 0 && (
                <div className="no-results">
                    <Package size={48} />
                    <h3>{t('noProductsFoundStock')}</h3>
                    <p>{t('tryAdjustingSearchFilters')}</p>
                </div>
            )}
        </div>
    );
};

export default StockManagement;
