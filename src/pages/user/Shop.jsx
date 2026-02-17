import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import { sampleProducts, sampleCategories, tamilNaduBrands } from '../../data/sampleData';
import './Shop.css';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState(sampleProducts);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        let filtered = [...sampleProducts];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Brand filter
        if (selectedBrand !== 'all') {
            filtered = filtered.filter(p => p.brand === selectedBrand);
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
    }, [searchQuery, selectedCategory, selectedBrand, sortBy]);

    return (
        <div className="shop-page">
            <div className="shop-header">
                <h1>Shop Products</h1>
                <p>Discover fresh groceries and authentic Tamil Nadu brands</p>
            </div>

            <div className="shop-container">
                <aside className={`shop-sidebar ${showFilters ? 'open' : ''}`}>
                    <div className="sidebar-section">
                        <h3>Categories</h3>
                        <ul className="filter-list">
                            <li>
                                <button
                                    className={selectedCategory === 'all' ? 'active' : ''}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    All Categories
                                </button>
                            </li>
                            {sampleCategories.map(cat => (
                                <li key={cat.id}>
                                    <button
                                        className={selectedCategory === cat.id ? 'active' : ''}
                                        onClick={() => setSelectedCategory(cat.id)}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <h3>Tamil Nadu Brands</h3>
                        <ul className="filter-list">
                            <li>
                                <button
                                    className={selectedBrand === 'all' ? 'active' : ''}
                                    onClick={() => setSelectedBrand('all')}
                                >
                                    All Brands
                                </button>
                            </li>
                            {tamilNaduBrands.map(brand => (
                                <li key={brand.id}>
                                    <button
                                        className={selectedBrand === brand.id ? 'active' : ''}
                                        onClick={() => setSelectedBrand(brand.id)}
                                    >
                                        {brand.logo} {brand.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="shop-content">
                    <div className="shop-toolbar">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="toolbar-actions">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>

                            <button
                                className="filter-toggle"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal size={20} />
                                Filters
                            </button>
                        </div>
                    </div>

                    <p className="results-count">{products.length} products found</p>

                    <div className="products-grid">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="no-results">
                            <span className="no-results-icon">🔍</span>
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
