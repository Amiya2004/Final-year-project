import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Star, TrendingUp, Sparkles, Tag, Quote } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import { sampleProducts, sampleCategories, heroSlides, customerReviews } from '../../data/sampleData';
import './Home.css';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    const bestSellers = sampleProducts.filter(p => p.rating >= 4.5).slice(0, 4);
    const newArrivals = sampleProducts.slice(0, 4);
    const topDeals = sampleProducts.filter(p => p.category === 'spices').slice(0, 4);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        className="hero-slide"
                        style={{ background: heroSlides[currentSlide].gradient }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="hero-content">
                            <motion.span
                                className="hero-subtitle"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {heroSlides[currentSlide].subtitle}
                            </motion.span>
                            <motion.h1
                                className="hero-title"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {heroSlides[currentSlide].title}
                            </motion.h1>
                            <motion.p
                                className="hero-description"
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
                                <Link to="/shop" className="hero-cta">
                                    {heroSlides[currentSlide].cta}
                                    <ArrowRight size={20} />
                                </Link>
                            </motion.div>
                        </div>
                        <div className="hero-decoration">
                            <span className="deco-icon">🛒</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button className="hero-nav prev" onClick={prevSlide}>
                    <ChevronLeft size={24} />
                </button>
                <button className="hero-nav next" onClick={nextSlide}>
                    <ChevronRight size={24} />
                </button>

                <div className="hero-dots">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="section-header">
                    <h2 className="section-title">Shop by Category</h2>
                    <Link to="/shop" className="section-link">
                        View All <ArrowRight size={18} />
                    </Link>
                </div>
                <div className="categories-grid">
                    {sampleCategories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={`/shop?category=${category.id}`}
                                className="category-card"
                                style={{ '--category-color': category.color }}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>


            {/* Customer Reviews Section */}
            <section className="section reviews-section">
                <div className="section-header center">
                    <h2 className="section-title">What Our Customers Say</h2>
                </div>
                <div className="reviews-grid">
                    {customerReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            className="review-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Quote className="review-quote" size={32} />
                            <p className="review-comment">{review.comment}</p>
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < review.rating ? '#f59e0b' : 'none'}
                                        color={i < review.rating ? '#f59e0b' : '#cbd5e1'}
                                    />
                                ))}
                            </div>
                            <div className="review-author">
                                <span className="author-avatar">{review.avatar}</span>
                                <span className="author-name">{review.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <div className="cta-content">
                    <h2>Get Fresh Groceries Delivered!</h2>
                    <p>Free delivery on orders above ₹500. Shop now and save more!</p>
                    <Link to="/shop" className="cta-button">
                        Start Shopping
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
