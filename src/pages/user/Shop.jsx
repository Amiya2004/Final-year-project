import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal, Loader } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import ProductDetailsModal from '../../components/user/ProductDetailsModal';
import { subscribeToProducts } from '../../services/database';
import { sampleCategories } from '../../data/sampleData';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Shop.module.css';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { t } = useLanguage();

    // Subscribe to real-time product updates from Firebase
    useEffect(() => {
        const unsubscribe = subscribeToProducts((data) => {
            setAllProducts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Filter and sort products whenever dependencies change
    useEffect(() => {
        let filtered = [...allProducts];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setProducts(filtered);
    }, [searchQuery, selectedCategory, sortBy, allProducts]);

    if (loading) {
        return (
            <div className={styles.shopPage} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={32} className="spinning" />
                <span style={{ marginLeft: '12px' }}>{t('loadingProducts')}</span>
            </div>
        );
    }

    return (
        <div className={styles.shopPage}>
            <div className={styles.shopHeader}>
                <h1>{t('shopProducts')}</h1>
                <p>{t('shopSubtitle')}</p>
            </div>

            <div className={styles.shopContainer}>
                <aside className={`${styles.shopSidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
                    <div className={styles.sidebarSection}>
                        <h3>{t('categories')}</h3>
                        <ul className={styles.filterList}>
                            <li>
                                <button
                                    className={selectedCategory === 'all' ? styles.filterListActive : ''}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    {t('allCategories')}
                                </button>
                            </li>
                            {sampleCategories.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        className={selectedCategory === cat.id ? styles.filterListActive : ''}
                                        onClick={() => setSelectedCategory(cat.id)}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>


                </aside>

                <main className={styles.shopContent}>
                    <div className={styles.shopToolbar}>
                        <div className={styles.searchBox}>
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder={t('searchProducts')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className={styles.toolbarActions}>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option value="name">{t('sortByName')}</option>
                                <option value="price-low">{t('priceLowHigh')}</option>
                                <option value="price-high">{t('priceHighLow')}</option>
                                <option value="rating">{t('topRated')}</option>
                            </select>

                            <button
                                className={styles.filterToggle}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal size={20} />
                                {t('filters')}
                            </button>
                        </div>
                    </div>

                    <p className={styles.resultsCount}>{products.length} {t('productsFound')}</p>

                    <div className={styles.productsGrid}>
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id || product.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard product={product} onClick={setSelectedProduct} />
                            </motion.div>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className={styles.noResults}>
                            <span className={styles.noResultsIcon}>🔍</span>
                            <h3>{t('noProductsFound')}</h3>
                            <p>{t('tryAdjusting')}</p>
                        </div>
                    )}
                </main>
            </div>
            {/* Product Details Modal */}
            <ProductDetailsModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
};

export default Shop;
