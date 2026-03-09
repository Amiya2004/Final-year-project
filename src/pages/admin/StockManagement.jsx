import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, AlertTriangle, TrendingDown, TrendingUp, Package, Loader } from 'lucide-react';
import { subscribeToProducts } from '../../services/database';
import { useSettings } from '../../contexts/SettingsContext';
import { sampleCategories } from '../../data/sampleData';
import './StockManagement.css';

const StockManagement = () => {
    const { settings } = useSettings();
    const lowStockThreshold = settings.lowStockThreshold ?? 10;
    const overStockThreshold = settings.overStockThreshold ?? 200;
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

    const getStockStatus = (stock, expiryDate) => {
        const daysUntilExpiry = expiryDate ? Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 999;

        if (stock === 0) return { status: 'out-of-stock', label: 'Out of Stock', color: '#dc2626' };
        if (stock <= lowStockThreshold) return { status: 'low-stock', label: 'Low Stock', color: '#ef4444' };
        if (stock > overStockThreshold) return { status: 'overstock', label: 'Overstock', color: '#f59e0b' };
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) return { status: 'expiring', label: 'Expiring Soon', color: '#f97316' };
        return { status: 'normal', label: 'In Stock', color: '#22c55e' };
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const stockStatus = getStockStatus(product.stock, product.expiryDate).status;
        const matchesStock = stockFilter === 'all' || stockStatus === stockFilter;

        return matchesSearch && matchesCategory && matchesStock;
    });

    const stockStats = {
        total: products.length,
        lowStock: products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold).length,
        overstock: products.filter(p => p.stock > overStockThreshold).length,
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
                <span style={{ marginLeft: '12px' }}>Loading stock data...</span>
            </div>
        );
    }

    return (
        <div className="stock-management">
            <div className="page-header">
                <div>
                    <h1>Stock Management</h1>
                    <p>Monitor and manage your inventory levels</p>
                </div>
                <button className="export-btn">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Stock Overview Cards */}
            <div className="stock-overview">
                <div className="overview-card">
                    <Package size={24} />
                    <div className="overview-info">
                        <span className="overview-value">{stockStats.total}</span>
                        <span className="overview-label">Total Products</span>
                    </div>
                </div>
                <div className="overview-card low">
                    <TrendingDown size={24} />
                    <div className="overview-info">
                        <span className="overview-value">{stockStats.lowStock}</span>
                        <span className="overview-label">Low Stock</span>
                    </div>
                </div>
                <div className="overview-card overstock">
                    <TrendingUp size={24} />
                    <div className="overview-info">
                        <span className="overview-value">{stockStats.overstock}</span>
                        <span className="overview-label">Overstock</span>
                    </div>
                </div>
                <div className="overview-card expiring">
                    <AlertTriangle size={24} />
                    <div className="overview-info">
                        <span className="overview-value">{stockStats.expiring}</span>
                        <span className="overview-label">Expiring Soon</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Categories</option>
                    {sampleCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Status</option>
                    <option value="low-stock">🔴 Low Stock</option>
                    <option value="overstock">🟡 Overstock</option>
                    <option value="expiring">🟠 Expiring Soon</option>
                    <option value="normal">🟢 Normal</option>
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
                            <th>Product</th>

                            <th>Category</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => {
                            const stockInfo = getStockStatus(product.stock, product.expiryDate);
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
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default StockManagement;
