import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../data/translations';
import { ref, get, update } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('appLanguage') || 'en';
    });

    // Load language preference from Firebase when user logs in
    useEffect(() => {
        if (currentUser) {
            const userRef = ref(database, `users/${currentUser.uid}/language`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const savedLang = snapshot.val();
                    setLanguageState(savedLang);
                    localStorage.setItem('appLanguage', savedLang);
                }
            }).catch(() => {});
        }
    }, [currentUser]);

    const setLanguage = async (lang) => {
        setLanguageState(lang);
        localStorage.setItem('appLanguage', lang);
        // Save to Firebase if user is logged in
        if (currentUser) {
            try {
                const userRef = ref(database, `users/${currentUser.uid}`);
                await update(userRef, { language: lang });
            } catch (error) {
                console.error('Error saving language preference:', error);
            }
        }
    };

    const t = (key, replacements = {}) => {
        let text = translations[language]?.[key] || translations.en[key] || key;
        Object.entries(replacements).forEach(([k, v]) => {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        });
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
