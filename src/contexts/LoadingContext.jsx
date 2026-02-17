import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    const showLoading = (message = 'Loading...') => {
        setLoadingMessage(message);
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    return (
        <LoadingContext.Provider value={{ isLoading, loadingMessage, showLoading, hideLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
