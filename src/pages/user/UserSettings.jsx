import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Mail, Phone, MapPin, Save, ArrowLeft, Camera, Check, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { ref, get, update } from 'firebase/database';
import { auth, database } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './UserSettings.css';

const UserSettings = () => {
    const { currentUser } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        if (currentUser) {
            loadProfile();
        }
    }, [currentUser]);

    const loadProfile = async () => {
        try {
            const userRef = ref(database, `users/${currentUser.uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                setProfile({
                    name: data.name || currentUser.displayName || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || ''
                });
            } else {
                setProfile(prev => ({
                    ...prev,
                    name: currentUser.displayName || ''
                }));
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            // Update Firebase Auth display name
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: profile.name
                });
            }

            // Update user data in Realtime Database
            const userRef = ref(database, `users/${currentUser.uid}`);
            await update(userRef, {
                name: profile.name,
                phone: profile.phone,
                address: profile.address,
                city: profile.city,
                state: profile.state,
                pincode: profile.pincode,
                updatedAt: new Date().toISOString()
            });

            setMessage({ type: 'success', text: t('profileUpdated') });
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage({ type: 'error', text: t('profileUpdateFailed') });
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="user-settings-page">
                <div className="us-header-banner">
                    <h1>{t('settingsTitle')}</h1>
                    <p>{t('managePreferences')}</p>
                </div>
                <div className="us-content">
                    <div className="us-loading">
                        <div className="us-spinner"></div>
                        <p>{t('loadingProfile')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-settings-page">
            <div className="us-header-banner">
                <Link to="/" className="us-back-link">
                    <ArrowLeft size={20} />
                    {t('backToHome')}
                </Link>
                <h1>{t('settingsTitle')}</h1>
                <p>{t('manageAccount')}</p>
            </div>

            <div className="us-content">
                {message && (
                    <motion.div
                        className={`us-message ${message.type}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {message.type === 'success' && <Check size={18} />}
                        {message.text}
                    </motion.div>
                )}

                <motion.div
                    className="us-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="us-card-title">
                        <User size={22} />
                        <h2>{t('profileInformation')}</h2>
                    </div>

                    <div className="us-avatar-section">
                        <div className="us-avatar-circle">
                            {currentUser?.displayName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="us-avatar-info">
                            <p className="us-avatar-name">{profile.name || 'User'}</p>
                            <p className="us-avatar-email">{currentUser?.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave}>
                        <div className="us-form-grid">
                            <div className="us-form-group">
                                <label htmlFor="name">
                                    <User size={16} />
                                    {t('fullName')}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder={t('enterFullName')}
                                />
                            </div>

                            <div className="us-form-group">
                                <label htmlFor="email">
                                    <Mail size={16} />
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={currentUser?.email || ''}
                                    disabled
                                    className="us-disabled-input"
                                />
                                <span className="us-field-note">{t('emailCannotChange')}</span>
                            </div>

                            <div className="us-form-group">
                                <label htmlFor="phone">
                                    <Phone size={16} />
                                    {t('phoneNumber')}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder={t('enterPhoneNumber')}
                                />
                            </div>
                        </div>

                        <div className="us-card-title" style={{ marginTop: '2rem' }}>
                            <MapPin size={22} />
                            <h2>{t('defaultAddress')}</h2>
                        </div>
                        <p className="us-section-hint">{t('addressHint')}</p>

                        <div className="us-form-grid">
                            <div className="us-form-group us-full-width">
                                <label htmlFor="address">{t('streetAddress')}</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    placeholder={t('enterStreetAddress')}
                                />
                            </div>

                            <div className="us-form-group">
                                <label htmlFor="city">{t('city')}</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={profile.city}
                                    onChange={handleChange}
                                    placeholder={t('city')}
                                />
                            </div>

                            <div className="us-form-group">
                                <label htmlFor="state">{t('state')}</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={profile.state}
                                    onChange={handleChange}
                                    placeholder={t('state')}
                                />
                            </div>

                            <div className="us-form-group">
                                <label htmlFor="pincode">{t('pinCode')}</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={profile.pincode}
                                    onChange={handleChange}
                                    placeholder={t('pinCode')}
                                />
                            </div>
                        </div>

                        {/* Language Selection */}
                        <div className="us-card-title" style={{ marginTop: '2rem' }}>
                            <Globe size={22} />
                            <h2>{t('language')}</h2>
                        </div>
                        <p className="us-section-hint">{t('languageHint')}</p>

                        <div className="us-language-selector">
                            <button
                                type="button"
                                className={`us-lang-btn ${language === 'en' ? 'us-lang-active' : ''}`}
                                onClick={() => setLanguage('en')}
                            >
                                <span className="us-lang-flag">🇬🇧</span>
                                <span className="us-lang-name">English</span>
                                {language === 'en' && <Check size={16} className="us-lang-check" />}
                            </button>
                            <button
                                type="button"
                                className={`us-lang-btn ${language === 'ta' ? 'us-lang-active' : ''}`}
                                onClick={() => setLanguage('ta')}
                            >
                                <span className="us-lang-flag">🇮🇳</span>
                                <span className="us-lang-name">தமிழ் (Tamil)</span>
                                {language === 'ta' && <Check size={16} className="us-lang-check" />}
                            </button>
                        </div>

                        <div className="us-form-actions">
                            <button type="submit" className="us-save-btn" disabled={saving}>
                                <Save size={18} />
                                {saving ? t('saving') : t('saveChanges')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default UserSettings;
