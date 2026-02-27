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
    Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/stock', icon: BarChart3, label: 'Stock Management' },

        { path: '/admin/expiry', icon: AlertTriangle, label: 'Expiry Alerts' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span className="logo-icon">🛒</span>
                    {!isCollapsed && <span className="logo-text">FreshMart</span>}
                </div>
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
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
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
