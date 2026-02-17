import { motion } from 'framer-motion';
import './Loader.css';

const Loader = ({ message = 'Loading...' }) => {
    return (
        <motion.div
            className="loader-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="loader-content">
                <div className="loader-logo">
                    <motion.span
                        className="logo-icon"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1, repeat: Infinity }
                        }}
                    >
                        🛒
                    </motion.span>
                </div>
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
            </div>
        </motion.div>
    );
};

export default Loader;
