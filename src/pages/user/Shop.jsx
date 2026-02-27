import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import ProductDetailsModal from '../../components/user/ProductDetailsModal';
import { sampleProducts, sampleCategories } from '../../data/sampleData';
import styles from './Shop.module.css';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState(sampleProducts);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        let filtered = [...sampleProducts];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
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
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        setProducts(filtered);
    }, [searchQuery, selectedCategory, sortBy]);

    return (
        <div className={styles.shopPage}>
            <div className={styles.shopHeader}>
                <h1>Shop Products</h1>
                <p>Discover fresh groceries and high-quality daily essentials</p>
            </div>

            <div className={styles.shopContainer}>
                <aside className={`${styles.shopSidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
                    <div className={styles.sidebarSection}>
                        <h3>Categories</h3>
                        <ul className={styles.filterList}>
                            <li>
                                <button
                                    className={selectedCategory === 'all' ? styles.filterListActive : ''}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    All Categories
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
                                placeholder="Search products..."
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
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>

                            <button
                                className={styles.filterToggle}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal size={20} />
                                Filters
                            </button>
                        </div>
                    </div>

                    <p className={styles.resultsCount}>{products.length} products found</p>

                    <div className={styles.productsGrid}>
                        {products.map((product, index) => (
                            <motion.div
                                key={product.name}
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
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters</p>
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
