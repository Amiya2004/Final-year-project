import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Preparing fresh experience...');

    const brandedMessages = [
        'Preparing fresh experience...',
        'Loading freshest products...',
        'Setting up your store...',
        'Organizing fresh inventory...',
        'Getting everything ready...',
        'Loading Nellai Velmurgan Store...'
    ];

    const showLoading = (message = null) => {
        if (message) {
            setLoadingMessage(message);
        } else {
            // Use a random branded message if none provided
            const randomMessage = brandedMessages[Math.floor(Math.random() * brandedMessages.length)];
            setLoadingMessage(randomMessage);
        }
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ 
            isLoading, 
            loadingMessage, 
            showLoading, 
            hideLoading,
            brandedMessages 
        }}>
            {children}
        </LoadingContext.Provider>
    );
};
