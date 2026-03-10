import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Store,
    Truck,
    Shield,
    Bell,
    Save,
    RefreshCw,
    Info,
    CheckCircle,
    AlertCircle,
    Loader,
    Palette,
    Clock,
    DollarSign,
    Eye,
    EyeOff,
    Key,
    Mail,
    Upload,
    HardDrive,
    Sliders,
    MessageSquare,
    Trash2,
    Globe
} from 'lucide-react';
import { getSettings, updateSettings, getFeedback, deleteFeedback } from '../../services/database';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../config/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import './Settings.css';

const Settings = () => {
    const { refreshSettings } = useSettings();
    const { currentUser } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [settings, setSettings] = useState({
        // General Settings
        storeName: '',
        contactEmail: '',
        contactPhone: '',
        deliveryFee: 0,
        minOrderForFreeDelivery: 0,
        maintenanceMode: false,
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
        overStockEmail: true,
        // System Settings
        maxFileUpload: 5,
        autoBackup: true,
        backupFrequency: 'weekly'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [feedbackItems, setFeedbackItems] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    
    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        // Apply theme settings when they change
        if (settings.primaryColor || settings.theme || settings.darkMode) {
            applyThemeSettings(settings);
        }
    }, [settings.theme, settings.primaryColor, settings.darkMode]);

    useEffect(() => {
        // Initialize default business hours if not present
        if (!settings.businessHours) {
            setSettings(prev => ({
                ...prev,
                businessHours: {
                    open: '09:00',
                    close: '21:00',
                    daysOpen: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
                }
            }));
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'feedback') {
            fetchFeedback();
        }
    }, [activeTab]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await getSettings();
            if (data) {
                setSettings(data);
                // Apply theme settings immediately
                applyThemeSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage({ type: 'error', text: t('failedLoadSettings') });
        } finally {
            setLoading(false);
        }
    };

    const applyThemeSettings = (settingsData) => {
        const root = document.documentElement;
        
        // Apply primary color
        if (settingsData.primaryColor) {
            root.style.setProperty('--primary-500', settingsData.primaryColor);
            // Generate complementary colors based on primary
            const hex = settingsData.primaryColor;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            // Generate lighter and darker shades
            root.style.setProperty('--primary-50', `hsl(${rgbToHsl(r, g, b)[0]}, 50%, 98%)`);
            root.style.setProperty('--primary-100', `hsl(${rgbToHsl(r, g, b)[0]}, 60%, 95%)`);
            root.style.setProperty('--primary-200', `hsl(${rgbToHsl(r, g, b)[0]}, 70%, 85%)`);
            root.style.setProperty('--primary-600', `hsl(${rgbToHsl(r, g, b)[0]}, 70%, 40%)`);
            root.style.setProperty('--primary-700', `hsl(${rgbToHsl(r, g, b)[0]}, 75%, 30%)`);
        }
        
        // Apply theme mode
        if (settingsData.theme === 'dark' || settingsData.darkMode) {
            root.classList.add('dark-theme');
        } else if (settingsData.theme === 'light') {
            root.classList.remove('dark-theme');
        } else if (settingsData.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark-theme');
            } else {
                root.classList.remove('dark-theme');
            }
        }
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        const isNumber = type === 'number';
        const parsedValue = isNumber ? parseFloat(value) : value;

        setSettings(prev => {
            const newSettings = {
                ...prev,
                [name]: type === 'checkbox' ? checked : (isNumber ? (isNaN(parsedValue) ? '' : parsedValue) : value)
            };
            
            // If theme or color changes, apply immediately
            if (name === 'theme' || name === 'darkMode' || name === 'primaryColor') {
                setTimeout(() => applyThemeSettings(newSettings), 10);
            }
            
            return newSettings;
        });
    };

    const handleNestedInputChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        // Basic validation
        if (!settings.storeName?.trim()) {
            setMessage({ type: 'error', text: t('storeNameRequired') });
            setSaving(false);
            return;
        }

        if (!settings.contactEmail?.trim() || !/\S+@\S+\.\S+/.test(settings.contactEmail)) {
            setMessage({ type: 'error', text: t('validEmailRequired') });
            setSaving(false);
            return;
        }

        if (settings.deliveryFee < 0) {
            setMessage({ type: 'error', text: t('deliveryFeeNonNegative') });
            setSaving(false);
            return;
        }

        try {
            await updateSettings(settings);
            await refreshSettings();
            setMessage({ type: 'success', text: t('settingsUpdatedSuccess') });
            // Clear success message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: t('settingsUpdateFailed') });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: t('passwordsDoNotMatch') });
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: t('passwordMinLength') });
            setPasswordLoading(false);
            return;
        }

        try {
            // Re-authenticate user with live auth reference
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(
                user.email,
                passwordData.currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            
            // Update password
            await updatePassword(user, passwordData.newPassword);
            
            setMessage({ type: 'success', text: t('passwordUpdatedSuccess') });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error updating password:', error);
            if (error.code === 'auth/wrong-password') {
                setMessage({ type: 'error', text: t('currentPasswordIncorrect') });
            } else {
                setMessage({ type: 'error', text: t('passwordUpdateFailed') });
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleColorChange = (color) => {
        // Validate hex color format
        const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
        if (!hexColorRegex.test(color)) {
            setMessage({ type: 'error', text: t('invalidHexColor') });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        setSettings(prev => {
            const newSettings = {
                ...prev,
                primaryColor: color
            };
            // Apply color immediately
            setTimeout(() => applyThemeSettings(newSettings), 10);
            return newSettings;
        });
        
        // Clear any previous error messages
        if (message.type === 'error') {
            setMessage({ type: '', text: '' });
        }
    };

    const handleBusinessHoursChange = (field, value) => {
        handleNestedInputChange('businessHours', field, value);
    };

    const handleDayToggle = (dayCode, checked) => {
        setSettings(prev => {
            const currentDays = prev.businessHours?.daysOpen || [];
            const newDays = checked
                ? [...currentDays, dayCode]
                : currentDays.filter(d => d !== dayCode);
            
            return {
                ...prev,
                businessHours: {
                    ...prev.businessHours,
                    daysOpen: newDays
                }
            };
        });
    };

    const resetToDefaults = () => {
        if (confirm(t('resetConfirm'))) {
            const defaultSettings = {
                storeName: 'FreshMart',
                contactEmail: 'contact@freshmart.com',
                contactPhone: '+91 98765 43210',
                deliveryFee: 40,
                minOrderForFreeDelivery: 500,
                maintenanceMode: false,
                orderNotifications: true,
                theme: 'light',
                primaryColor: '#059669',
                darkMode: false,
                currency: 'INR',
                businessHours: {
                    open: '09:00',
                    close: '21:00',
                    daysOpen: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
                },
                emailNotifications: true,
                orderConfirmationEmail: true,
                lowStockEmail: true,
                overStockEmail: true,
                maxFileUpload: 5,
                autoBackup: true,
                backupFrequency: 'weekly'
            };
            
            setSettings(defaultSettings);
            applyThemeSettings(defaultSettings);
            setMessage({ type: 'success', text: t('settingsResetDefaults') });
        }
    };

    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `settings-backup-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        setMessage({ type: 'success', text: t('settingsExportedSuccess') });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const fetchFeedback = async () => {
        setFeedbackLoading(true);
        try {
            const data = await getFeedback();
            const sorted = [...data].sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bTime - aTime;
            });
            setFeedbackItems(sorted);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setMessage({ type: 'error', text: t('failedLoadFeedback') });
        } finally {
            setFeedbackLoading(false);
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (!confirm(t('deleteFeedbackConfirm'))) {
            return;
        }
        try {
            await deleteFeedback(feedbackId);
            setFeedbackItems(prev => prev.filter(item => item.id !== feedbackId));
        } catch (error) {
            console.error('Error deleting feedback:', error);
            setMessage({ type: 'error', text: t('failedDeleteFeedback') });
        }
    };

    const tabs = [
        { id: 'general', icon: Store, label: t('general') },
        { id: 'appearance', icon: Palette, label: t('appearance') },
        { id: 'business', icon: Clock, label: t('business') },
        { id: 'shipping', icon: Truck, label: t('delivery') },
        { id: 'notifications', icon: Bell, label: t('notifications') },
        { id: 'preferences', icon: Sliders, label: t('preferences') },
        { id: 'feedback', icon: MessageSquare, label: t('userFeedback') }
    ];

    if (loading) {
        return (
            <div className="admin-page-loading">
                <Loader className="spinning" />
                <span>{t('loadingStoreSettings')}</span>
            </div>
        );
    }

    return (
        <div className="admin-settings-container">
            <header className="admin-page-header">
                <div>
                    <h1>{t('settingsTitle')}</h1>
                    <p>{t('configureStorePreferences')}</p>
                </div>
                <div className="header-actions">
                    <button
                        type="button"
                        className="outline-btn danger"
                        onClick={resetToDefaults}
                        title="Reset all settings to defaults"
                    >
                        <RefreshCw size={18} />
                        {t('reset')}
                    </button>
                    <button
                        className={`save-btn ${saving ? 'loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? <RefreshCw className="spinning" size={18} /> : <Save size={18} />}
                        {saving ? t('savingSettings') : t('saveChanges')}
                    </button>
                </div>
            </header>

            {message.text && (
                <motion.div
                    className={`settings-message ${message.type}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{message.text}</span>
                </motion.div>
            )}

            <div className="settings-content">
                <aside className="settings-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </aside>

                <main className="settings-cards">
                    <form onSubmit={handleSubmit}>
                        {activeTab === 'general' && (
                            <motion.div
                                className="settings-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="card-header">
                                    <Store size={22} />
                                    <h2>{t('storeInformation')}</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>{t('storeName')}</label>
                                        <input
                                            type="text"
                                            name="storeName"
                                            value={settings.storeName}
                                            onChange={handleInputChange}
                                            placeholder={t('enterStoreName')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('contactEmail')}</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={settings.contactEmail}
                                            onChange={handleInputChange}
                                            placeholder="support@freshmart.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('contactPhone')}</label>
                                        <input
                                            type="text"
                                            name="contactPhone"
                                            value={settings.contactPhone}
                                            onChange={handleInputChange}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>{t('maintenanceMode')}</label>
                                            <p>{t('maintenanceModeDesc')}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="maintenanceMode"
                                                checked={settings.maintenanceMode}
                                                onChange={handleInputChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'appearance' && (
                            <motion.div
                                className="settings-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="card-header">
                                    <Palette size={22} />
                                    <h2>{t('themeAppearance')}</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>{t('themeMode')}</label>
                                        <select
                                            name="theme"
                                            value={settings.theme}
                                            onChange={handleInputChange}
                                        >
                                            <option value="light">{t('lightTheme')}</option>
                                            <option value="dark">{t('darkTheme')}</option>
                                            <option value="auto">{t('autoSystem')}</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('primaryColor')}</label>
                                        <div className="color-picker-container">
                                            <input
                                                type="color"
                                                value={settings.primaryColor || '#059669'}
                                                onChange={(e) => handleColorChange(e.target.value)}
                                                className="color-picker"
                                                title="Pick a custom color"
                                            />
                                            <input
                                                type="text"
                                                value={settings.primaryColor || '#059669'}
                                                onChange={(e) => handleColorChange(e.target.value)}
                                                placeholder="#059669"
                                                pattern="^#[0-9A-Fa-f]{6}$"
                                                title="Enter a hex color code (e.g., #059669)"
                                            />
                                        </div>
                                        <p className="field-hint">{t('colorHint')}</p>
                                    </div>
                                    <div className="color-presets">
                                        <label>{t('quickColorPresets')}</label>
                                        <div className="preset-colors">
                                            {[
                                                { color: '#059669', name: 'Emerald' },
                                                { color: '#3B82F6', name: 'Blue' },
                                                { color: '#8B5CF6', name: 'Purple' },
                                                { color: '#EF4444', name: 'Red' },
                                                { color: '#F97316', name: 'Orange' },
                                                { color: '#10B981', name: 'Teal' },
                                                { color: '#6366F1', name: 'Indigo' },
                                                { color: '#EC4899', name: 'Pink' }
                                            ].map(({ color, name }) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`preset-color ${settings.primaryColor === color ? 'active' : ''}`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => handleColorChange(color)}
                                                    title={`${name} (${color})`}
                                                >
                                                    {settings.primaryColor === color && (
                                                        <CheckCircle size={16} color="white" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>{t('darkMode')}</label>
                                            <p>{t('darkModeDesc')}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="darkMode"
                                                checked={settings.darkMode}
                                                onChange={handleInputChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'business' && (
                            <motion.div
                                className="settings-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="card-header">
                                    <Clock size={22} />
                                    <h2>{t('businessConfiguration')}</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>{t('currency')}</label>
                                        <select
                                            name="currency"
                                            value={settings.currency}
                                            onChange={handleInputChange}
                                        >
                                            <option value="INR">Indian Rupee (₹)</option>
                                            <option value="USD">US Dollar ($)</option>
                                            <option value="EUR">Euro (€)</option>
                                            <option value="GBP">British Pound (£)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('openingTime')}</label>
                                        <input
                                            type="time"
                                            value={settings.businessHours?.open || '09:00'}
                                            onChange={(e) => handleBusinessHoursChange('open', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('closingTime')}</label>
                                        <input
                                            type="time"
                                            value={settings.businessHours?.close || '21:00'}
                                            onChange={(e) => handleBusinessHoursChange('close', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>{t('operatingDays')}</label>
                                        <div className="days-selector">
                                            {[t('dayMon'), t('dayTue'), t('dayWed'), t('dayThu'), t('dayFri'), t('daySat'), t('daySun')].map((day, index) => {
                                                const dayCode = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][index];
                                                return (
                                                    <label key={dayCode} className="day-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.businessHours?.daysOpen?.includes(dayCode) || false}
                                                            onChange={(e) => handleDayToggle(dayCode, e.target.checked)}
                                                        />
                                                        <span>{day}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'shipping' && (
                            <motion.div
                                className="settings-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="card-header">
                                    <Truck size={22} />
                                    <h2>{t('deliveryConfiguration')}</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>{t('standardDeliveryFee')}</label>
                                        <input
                                            type="number"
                                            name="deliveryFee"
                                            value={settings.deliveryFee}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('freeDeliveryThreshold')}</label>
                                        <input
                                            type="number"
                                            name="minOrderForFreeDelivery"
                                            value={settings.minOrderForFreeDelivery}
                                            onChange={handleInputChange}
                                        />
                                        <p className="field-hint">{t('freeDeliveryHint')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                className="settings-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="card-header">
                                    <Bell size={22} />
                                    <h2>{t('systemNotifications')}</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>{t('orderEmailNotifications')}</label>
                                            <p>{t('orderEmailNotificationsDesc')}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="orderNotifications"
                                                checked={settings.orderNotifications}
                                                onChange={handleInputChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>{t('emailNotifications')}</label>
                                            <p>{t('emailNotificationsDesc')}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="emailNotifications"
                                                checked={settings.emailNotifications}
                                                onChange={handleInputChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>{t('orderConfirmationEmails')}</label>
                                            <p>{t('orderConfirmationEmailsDesc')}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="orderConfirmationEmail"
                                                checked={settings.orderConfirmationEmail}
                                                onChange={handleInputChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>{t('lowStockEmailAlerts')}</label>
                                            <p>{t('lowStockEmailAlertsDesc')}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="lowStockEmail"
                                                checked={settings.lowStockEmail}
                                                onChange={handleInputChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>{t('overStockEmailAlerts')}</label>
                                            <p>{t('overStockEmailAlertsDesc')}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="overStockEmail"
                                                checked={settings.overStockEmail}
                                                onChange={handleInputChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'preferences' && (
                            <motion.div
                                className="settings-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="card-header">
                                    <Sliders size={22} />
                                    <h2>{t('systemPreferences')}</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>{t('maxFileUploadSize')}</label>
                                        <input
                                            type="number"
                                            name="maxFileUpload"
                                            value={settings.maxFileUpload}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="50"
                                        />
                                        <p className="field-hint">{t('maxFileUploadHint')}</p>
                                    </div>
                                    <div className="form-group">
                                        <label>{t('backupFrequency')}</label>
                                        <select
                                            name="backupFrequency"
                                            value={settings.backupFrequency}
                                            onChange={handleInputChange}
                                        >
                                            <option value="daily">{t('daily')}</option>
                                            <option value="weekly">{t('weekly')}</option>
                                            <option value="monthly">{t('monthly')}</option>
                                            <option value="disabled">{t('disabled')}</option>
                                        </select>
                                        <p className="field-hint">{t('backupFrequencyHint')}</p>
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>{t('autoBackup')}</label>
                                            <p>{t('autoBackupDesc')}</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="autoBackup"
                                                checked={settings.autoBackup}
                                                onChange={handleInputChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label><Globe size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />{t('languageLabel')}</label>
                                        <div className="admin-lang-selector">
                                            <button
                                                type="button"
                                                className={`admin-lang-btn ${language === 'en' ? 'active' : ''}`}
                                                onClick={() => setLanguage('en')}
                                            >
                                                <span className="admin-lang-flag">🇬🇧</span>
                                                <span>English</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={`admin-lang-btn ${language === 'ta' ? 'active' : ''}`}
                                                onClick={() => setLanguage('ta')}
                                            >
                                                <span className="admin-lang-flag">🇮🇳</span>
                                                <span>தமிழ் (Tamil)</span>
                                            </button>
                                        </div>
                                        <p className="field-hint">{t('languageHint')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}



                        {activeTab === 'feedback' && (
                            <motion.div
                                className="settings-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="card-header">
                                    <MessageSquare size={22} />
                                    <h2>{t('userFeedbackTitle')}</h2>
                                </div>
                                <div className="feedback-header">
                                    <p className="field-hint">{t('feedbackHint')}</p>
                                </div>

                                {feedbackLoading ? (
                                    <div className="feedback-loading">
                                        <Loader className="spinning" />
                                        <span>{t('loadingFeedback')}</span>
                                    </div>
                                ) : (
                                    <div className="feedback-list">
                                        {feedbackItems.length === 0 ? (
                                            <div className="feedback-empty">
                                                <p>{t('noFeedbackYet')}</p>
                                            </div>
                                        ) : (
                                            feedbackItems.map(item => (
                                                <div key={item.id} className="feedback-item">
                                                    <div className="feedback-main">
                                                        <div className="feedback-meta">
                                                            <strong>{item.name || t('customerFallback')}</strong>
                                                            {item.rating ? (
                                                                <span className="feedback-rating">{t('ratingLabel').replace('{rating}', item.rating)}</span>
                                                            ) : null}
                                                        </div>
                                                        <p>{item.comment}</p>
                                                        <span className="feedback-date">
                                                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : t('unknownDate')}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="feedback-delete"
                                                        onClick={() => handleDeleteFeedback(item.id)}
                                                        title={t('deleteFeedback')}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Settings;
