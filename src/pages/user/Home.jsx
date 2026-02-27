import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Star, TrendingUp, Sparkles, Tag, Quote, Loader } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import { subscribeToProducts } from '../../services/database';
import { sampleCategories, heroSlides, customerReviews } from '../../data/sampleData';
import styles from './Home.module.css';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Subscribe to real-time product updates from Firebase
    useEffect(() => {
        const unsubscribe = subscribeToProducts((data) => {
            setAllProducts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    const bestSellers = allProducts.filter(p => (p.rating || 0) >= 4.5).slice(0, 4);
    const newArrivals = allProducts.slice(0, 4);
    const topDeals = allProducts.filter(p => p.category === 'spices').slice(0, 4);

    return (
        <div className={styles.homePage}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        className={styles.heroSlide}
                        style={{ background: heroSlides[currentSlide].gradient }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.heroContent}>
                            <motion.span
                                className={styles.heroSubtitle}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {heroSlides[currentSlide].subtitle}
                            </motion.span>
                            <motion.h1
                                className={styles.heroTitle}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {heroSlides[currentSlide].title}
                            </motion.h1>
                            <motion.p
                                className={styles.heroDescription}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {heroSlides[currentSlide].description}
                            </motion.p>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link to="/shop" className={styles.heroCta}>
                                    {heroSlides[currentSlide].cta}
                                    <ArrowRight size={20} />
                                </Link>
                            </motion.div>
                        </div>
                        <div className={styles.heroDecoration}>
                            <span className={styles.decoIcon}>🛒</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button className={`${styles.heroNav} ${styles.prev}`} onClick={prevSlide}>
                    <ChevronLeft size={24} />
                </button>
                <button className={`${styles.heroNav} ${styles.next}`} onClick={nextSlide}>
                    <ChevronRight size={24} />
                </button>

                <div className={styles.heroDots}>
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Shop by Category</h2>
                    <Link to="/shop" className={styles.sectionLink}>
                        View All <ArrowRight size={18} />
                    </Link>
                </div>
                <div className={styles.categoriesGrid}>
                    {sampleCategories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={`/shop?category=${category.id}`}
                                className={styles.categoryCard}
                                style={{ '--category-color': category.color }}
                            >
                                <div className={styles.categoryImageWrapper}>
                                    {category.image
                                        ? <img src={category.image} alt={category.name} className={styles.categoryImg} />
                                        : <span className={styles.categoryIcon}>{category.icon}</span>
                                    }
                                </div>
                                <span className={styles.categoryName}>{category.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>


            {/* Customer Reviews Section */}
            <section className={`${styles.section} ${styles.reviewsSection}`}>
                <div className={`${styles.sectionHeader} ${styles.sectionHeaderCenter}`}>
                    <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
                </div>
                <div className={styles.reviewsGrid}>
                    {customerReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            className={styles.reviewCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Quote className={styles.reviewQuote} size={32} />
                            <p className={styles.reviewComment}>{review.comment}</p>
                            <div className={styles.reviewRating}>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < review.rating ? '#f59e0b' : 'none'}
                                        color={i < review.rating ? '#f59e0b' : '#cbd5e1'}
                                    />
                                ))}
                            </div>
                            <div className={styles.reviewAuthor}>
                                <span className={styles.authorAvatar}>{review.avatar}</span>
                                <span className={styles.authorName}>{review.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className={styles.ctaBanner}>
                <div className={styles.ctaContent}>
                    <h2>Get Fresh Groceries Delivered!</h2>
                    <p>Free delivery on orders above ₹500. Shop now and save more!</p>
                    <Link to="/shop" className={styles.ctaButton}>
                        Start Shopping
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
