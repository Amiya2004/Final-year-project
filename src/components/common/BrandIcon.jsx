import { motion } from 'framer-motion';

const BrandIcon = ({ 
    size = 24, 
    className = '', 
    animate = false,
    color = '#22c55e' 
}) => {
    const iconVariants = animate ? {
        animate: {
            rotate: 360,
            scale: [1, 1.1, 1]
        },
        transition: {
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity }
        }
    } : {};

    return (
        <motion.div
            className={`brand-icon ${className}`}
            style={{
                width: size,
                height: size,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            {...iconVariants}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Store/Shopping bag icon with fresh elements */}
                <path
                    d="M4 7V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V7"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Fresh elements - leaves */}
                <circle
                    cx="10"
                    cy="12"
                    r="1.5"
                    fill={color}
                    opacity="0.7"
                />
                <circle
                    cx="14"
                    cy="12"
                    r="1.5"
                    fill={color}
                    opacity="0.7"
                />
                <path
                    d="M9 15C9 15 10 16 12 16C14 16 15 15 15 15"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
        </motion.div>
    );
};

export default BrandIcon;