import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    AlertTriangle,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const { settings } = useSettings();
    const { t } = useLanguage();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: t('adminDashboardNav'), end: true },
        { path: '/admin/products', icon: Package, label: t('adminProducts') },
        { path: '/admin/orders', icon: ShoppingCart, label: t('adminOrders') },
        { path: '/admin/stock', icon: BarChart3, label: t('adminStockManagement') },

        { path: '/admin/expiry', icon: AlertTriangle, label: t('adminExpiryAlerts') },
        { path: '/admin/settings', icon: Settings, label: t('adminSettings') }
    ];

    return (
        <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img
                        src="/velmurgan-logo.png"
                        alt={settings.storeName}
                        className="sidebar-logo-img"
                        style={{ width: isCollapsed ? '42px' : '70px' }}
                    />
                </div>
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <div className="sidebar-home-link">
                <button className="home-btn" onClick={handleGoHome}>
                    <Home size={20} />
                    {!isCollapsed && <span>{t('backToHome')}</span>}
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    {!isCollapsed && <span>{t('logout')}</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
