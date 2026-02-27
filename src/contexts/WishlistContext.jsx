import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        if (!wishlist.find(item => item.name === product.name)) {
            setWishlist([...wishlist, product]);
        }
    };

    const removeFromWishlist = (productName) => {
        setWishlist(wishlist.filter(item => item.name !== productName));
    };

    const toggleWishlist = (product) => {
        if (wishlist.find(item => item.name === product.name)) {
            removeFromWishlist(product.name);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productName) => {
        return wishlist.some(item => item.name === productName);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
