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
    Sliders
} from 'lucide-react';
import { getSettings, updateSettings } from '../../services/database';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import './Settings.css';

const Settings = () => {
    const { refreshSettings } = useSettings();
    const { currentUser } = useAuth();
    const [settings, setSettings] = useState({
        // General Settings
        storeName: '',
        contactEmail: '',
        contactPhone: '',
        deliveryFee: 0,
        minOrderForFreeDelivery: 0,
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
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [message, setMessage] = useState({ type: '', text: '' });
    
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
            setMessage({ type: 'error', text: 'Failed to load settings.' });
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
            setMessage({ type: 'error', text: 'Store name is required!' });
            setSaving(false);
            return;
        }

        if (!settings.contactEmail?.trim() || !/\S+@\S+\.\S+/.test(settings.contactEmail)) {
            setMessage({ type: 'error', text: 'Valid contact email is required!' });
            setSaving(false);
            return;
        }

        if (settings.deliveryFee < 0) {
            setMessage({ type: 'error', text: 'Delivery fee cannot be negative!' });
            setSaving(false);
            return;
        }

        try {
            await updateSettings(settings);
            await refreshSettings();
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            // Clear success message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
            setPasswordLoading(false);
            return;
        }

        try {
            // Re-authenticate user
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                passwordData.currentPassword
            );
            await reauthenticateWithCredential(currentUser, credential);
            
            // Update password
            await updatePassword(currentUser, passwordData.newPassword);
            
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error updating password:', error);
            if (error.code === 'auth/wrong-password') {
                setMessage({ type: 'error', text: 'Current password is incorrect!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
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
            setMessage({ type: 'error', text: 'Please enter a valid hex color code (e.g., #059669)' });
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
        if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
            const defaultSettings = {
                storeName: 'FreshMart',
                contactEmail: 'contact@freshmart.com',
                contactPhone: '+91 98765 43210',
                deliveryFee: 40,
                minOrderForFreeDelivery: 500,
                maintenanceMode: false,
                lowStockThreshold: 10,
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
                maxFileUpload: 5,
                autoBackup: true,
                backupFrequency: 'weekly'
            };
            
            setSettings(defaultSettings);
            applyThemeSettings(defaultSettings);
            setMessage({ type: 'success', text: 'Settings reset to defaults. Don\'t forget to save!' });
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
        
        setMessage({ type: 'success', text: 'Settings exported successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const tabs = [
        { id: 'general', icon: Store, label: 'General' },
        { id: 'appearance', icon: Palette, label: 'Appearance' },
        { id: 'business', icon: Clock, label: 'Business' },
        { id: 'shipping', icon: Truck, label: 'Delivery' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'preferences', icon: Sliders, label: 'Preferences' },
        { id: 'security', icon: Shield, label: 'Security' }
    ];

    if (loading) {
        return (
            <div className="admin-page-loading">
                <Loader className="spinning" />
                <span>Loading store settings...</span>
            </div>
        );
    }

    return (
        <div className="admin-settings-container">
            <header className="admin-page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Configure your store operations and preferences</p>
                </div>
                <div className="header-actions">
                    <button
                        type="button"
                        className="outline-btn"
                        onClick={exportSettings}
                        title="Export settings as JSON"
                    >
                        <Upload size={18} />
                        Export
                    </button>
                    <button
                        type="button"
                        className="outline-btn danger"
                        onClick={resetToDefaults}
                        title="Reset all settings to defaults"
                    >
                        <RefreshCw size={18} />
                        Reset
                    </button>
                    <button
                        className={`save-btn ${saving ? 'loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? <RefreshCw className="spinning" size={18} /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Changes'}
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
                                    <h2>Store Information</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Store Name</label>
                                        <input
                                            type="text"
                                            name="storeName"
                                            value={settings.storeName}
                                            onChange={handleInputChange}
                                            placeholder="Enter store name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={settings.contactEmail}
                                            onChange={handleInputChange}
                                            placeholder="support@freshmart.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact Phone</label>
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
                                            <label>Maintenance Mode</label>
                                            <p>When active, customers will see a maintenance page.</p>
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
                                    <h2>Theme & Appearance</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Theme Mode</label>
                                        <select
                                            name="theme"
                                            value={settings.theme}
                                            onChange={handleInputChange}
                                        >
                                            <option value="light">Light Theme</option>
                                            <option value="dark">Dark Theme</option>
                                            <option value="auto">Auto (System)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Primary Color</label>
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
                                        <p className="field-hint">This color will be used throughout the application interface.</p>
                                    </div>
                                    <div className="color-presets">
                                        <label>Quick Color Presets</label>
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
                                            <label>Dark Mode</label>
                                            <p>Enable dark mode for the admin interface.</p>
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
                                    <h2>Business Configuration</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Currency</label>
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
                                        <label>Opening Time</label>
                                        <input
                                            type="time"
                                            value={settings.businessHours?.open || '09:00'}
                                            onChange={(e) => handleBusinessHoursChange('open', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Closing Time</label>
                                        <input
                                            type="time"
                                            value={settings.businessHours?.close || '21:00'}
                                            onChange={(e) => handleBusinessHoursChange('close', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Operating Days</label>
                                        <div className="days-selector">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                                                const dayCode = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][index];
                                                return (
                                                    <label key={day} className="day-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.businessHours?.daysOpen?.includes(dayCode) || false}
                                                            onChange={(e) => handleDayToggle(dayCode, e.target.checked)}
                                                        />
                                                        <span>{day.slice(0, 3)}</span>
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
                                    <h2>Delivery Configuration</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Standard Delivery Fee (₹)</label>
                                        <input
                                            type="number"
                                            name="deliveryFee"
                                            value={settings.deliveryFee}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Free Delivery Threshold (₹)</label>
                                        <input
                                            type="number"
                                            name="minOrderForFreeDelivery"
                                            value={settings.minOrderForFreeDelivery}
                                            onChange={handleInputChange}
                                        />
                                        <p className="field-hint">Orders above this amount will have zero delivery fee.</p>
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
                                    <h2>System Notifications</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Low Stock Threshold</label>
                                        <input
                                            type="number"
                                            name="lowStockThreshold"
                                            value={settings.lowStockThreshold}
                                            onChange={handleInputChange}
                                        />
                                        <p className="field-hint">Items with stock below this will trigger a low-stock alert.</p>
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>Order Email Notifications</label>
                                            <p>Send internal notification when a new order is placed.</p>
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
                                            <label>Email Notifications</label>
                                            <p>Enable general email notifications for admin activities.</p>
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
                                            <label>Order Confirmation Emails</label>
                                            <p>Send confirmation emails to customers for new orders.</p>
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
                                            <label>Low Stock Email Alerts</label>
                                            <p>Send email alerts when products reach low stock threshold.</p>
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
                                    <h2>System Preferences</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Max File Upload Size (MB)</label>
                                        <input
                                            type="number"
                                            name="maxFileUpload"
                                            value={settings.maxFileUpload}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="50"
                                        />
                                        <p className="field-hint">Maximum size for uploaded images and files.</p>
                                    </div>
                                    <div className="form-group">
                                        <label>Backup Frequency</label>
                                        <select
                                            name="backupFrequency"
                                            value={settings.backupFrequency}
                                            onChange={handleInputChange}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="disabled">Disabled</option>
                                        </select>
                                        <p className="field-hint">How often to create automatic data backups.</p>
                                    </div>
                                    <div className="form-group toggle">
                                        <div className="toggle-info">
                                            <label>Auto Backup</label>
                                            <p>Automatically create system backups based on frequency.</p>
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
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div
                                className="settings-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="card-header">
                                    <Shield size={22} />
                                    <h2>Security & Privacy</h2>
                                </div>
                                
                                <div className="security-section">
                                    <div className="password-section">
                                        <div className="section-header">
                                            <h3>Password Management</h3>
                                            <button
                                                type="button"
                                                className="outline-btn"
                                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                            >
                                                <Key size={18} />
                                                {showPasswordForm ? 'Cancel' : 'Change Password'}
                                            </button>
                                        </div>
                                        
                                        {showPasswordForm && (
                                            <motion.form
                                                className="password-form"
                                                onSubmit={handlePasswordChange}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <div className="form-grid">
                                                    <div className="form-group">
                                                        <label>Current Password</label>
                                                        <div className="password-input-container">
                                                            <input
                                                                type={showPasswords.current ? "text" : "password"}
                                                                value={passwordData.currentPassword}
                                                                onChange={(e) => setPasswordData(prev => ({
                                                                    ...prev,
                                                                    currentPassword: e.target.value
                                                                }))}
                                                                required
                                                                placeholder="Enter current password"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="password-toggle"
                                                                onClick={() => togglePasswordVisibility('current')}
                                                            >
                                                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>New Password</label>
                                                        <div className="password-input-container">
                                                            <input
                                                                type={showPasswords.new ? "text" : "password"}
                                                                value={passwordData.newPassword}
                                                                onChange={(e) => setPasswordData(prev => ({
                                                                    ...prev,
                                                                    newPassword: e.target.value
                                                                }))}
                                                                required
                                                                minLength={6}
                                                                placeholder="Enter new password"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="password-toggle"
                                                                onClick={() => togglePasswordVisibility('new')}
                                                            >
                                                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Confirm New Password</label>
                                                        <div className="password-input-container">
                                                            <input
                                                                type={showPasswords.confirm ? "text" : "password"}
                                                                value={passwordData.confirmPassword}
                                                                onChange={(e) => setPasswordData(prev => ({
                                                                    ...prev,
                                                                    confirmPassword: e.target.value
                                                                }))}
                                                                required
                                                                minLength={6}
                                                                placeholder="Confirm new password"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="password-toggle"
                                                                onClick={() => togglePasswordVisibility('confirm')}
                                                            >
                                                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="password-form-actions">
                                                    <button
                                                        type="submit"
                                                        className={`save-btn ${passwordLoading ? 'loading' : ''}`}
                                                        disabled={passwordLoading}
                                                    >
                                                        {passwordLoading ? <RefreshCw className="spinning" size={18} /> : <Save size={18} />}
                                                        {passwordLoading ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </div>
                                            </motion.form>
                                        )}
                                    </div>
                                    
                                    <div className="security-info">
                                        <div className="info-section">
                                            <h3>Account Information</h3>
                                            <div className="info-item">
                                                <Mail size={20} />
                                                <div>
                                                    <strong>Email:</strong>
                                                    <span>{currentUser?.email}</span>
                                                </div>
                                            </div>
                                            <div className="info-item">
                                                <Key size={20} />
                                                <div>
                                                    <strong>Last Password Change:</strong>
                                                    <span>Not tracked</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="firebase-section">
                                            <Info size={40} />
                                            <p>Advanced authentication settings are managed through Firebase Console for maximum security. Contact system administrator for privileged role management.</p>
                                            <button
                                                type="button"
                                                className="outline-btn"
                                                onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
                                            >
                                                Go to Firebase Console
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Settings;
