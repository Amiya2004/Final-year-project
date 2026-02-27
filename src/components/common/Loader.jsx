import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import './Loader.css';

const Loader = ({ message = 'Loading...' }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 3000; // 3 seconds
        const interval = 50; // Update every 50ms
        const increment = 100 / (duration / interval);
        
        const timer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + increment;
                if (newProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return newProgress;
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            className="loader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="loader-content">
                <motion.div
                    className="store-title"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <h1>Nellai Velmurugan Store</h1>
                </motion.div>

                <motion.div
                    className="progress-container"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <motion.div 
                        className="progress-percentage"
                        key={Math.floor(progress)}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {Math.floor(progress)}%
                    </motion.div>
                </motion.div>

                <div className="loader-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>

                <motion.p
                    className="loader-message"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {message}
                </motion.p>
                
                <motion.div
                    className="loader-subtitle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.7 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Freshness Delivered Daily
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Loader;
