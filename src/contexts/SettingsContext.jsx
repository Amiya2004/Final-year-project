import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/database';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        // General Settings
        storeName: 'Nellai Velmurgan Store',
        contactEmail: 'contact@example.com',
        contactPhone: '+91 98765 43210',
        deliveryFee: 40,
        minOrderForFreeDelivery: 500,
        maintenanceMode: false,
        lowStockThreshold: 10,
        orderNotifications: true,
        // Theme Settings
        theme: 'light',
        primaryColor: '#059669',
        darkMode: false,
        // Business Settings
        currency: 'INR',
        businessHours: {
            open: '09:00',
            close: '21:00',
            daysOpen: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        },
        // Email Settings
        emailNotifications: true,
        orderConfirmationEmail: true,
        lowStockEmail: true,
        // System Settings
        maxFileUpload: 5,
        autoBackup: true,
        backupFrequency: 'weekly'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                if (data) {
                    const normalized = {
                        ...data,
                        storeName: data.storeName === 'Nellai Velmurugan Store'
                            ? 'Nellai Velmurgan Store'
                            : data.storeName
                    };
                    setSettings(normalized);
                    // Apply theme settings
                    applyThemeSettings(normalized);
                    if (normalized.storeName !== data.storeName) {
                        updateSettings({ storeName: normalized.storeName });
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        // Apply theme settings when they change
        applyThemeSettings(settings);
    }, [settings.theme, settings.primaryColor, settings.darkMode]);

    const applyThemeSettings = (settingsData) => {
        const root = document.documentElement;
        
        // Apply primary color
        if (settingsData.primaryColor) {
            root.style.setProperty('--primary-500', settingsData.primaryColor);
        }
        
        // Apply theme mode
        if (settingsData.theme === 'dark' || settingsData.darkMode) {
            root.classList.add('dark-theme');
        } else if (settingsData.theme === 'light') {
            root.classList.remove('dark-theme');
        } else if (settingsData.theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark-theme');
            } else {
                root.classList.remove('dark-theme');
            }
        }
    };

    const refreshSettings = async () => {
        setLoading(true);
        try {
            const data = await getSettings();
            if (data) {
                setSettings(data);
                applyThemeSettings(data);
            }
        } catch (error) {
            console.error('Error refreshing settings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsContext.Provider value={{ 
            settings, 
            loading, 
            refreshSettings,
            applyThemeSettings 
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
