import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileInput, FileOutput, LogOut } from 'lucide-react';
import { useAuth } from '../../AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/users', label: 'User Management', icon: Users },
        { path: '/import', label: 'Import Data', icon: FileInput },
        { path: '/export', label: 'Export Data', icon: FileOutput },
    ];

    return (
        <div className="sidebar glass-card" style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1rem',
            borderRadius: '0 24px 24px 0',
            zIndex: 100
        }}>
            <div className="sidebar-header" style={{ marginBottom: '3rem', padding: '0 1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>AnalyticsPro</h2>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                marginBottom: '8px',
                                textDecoration: 'none',
                                borderRadius: '12px',
                                color: isActive ? 'white' : 'var(--text-muted)',
                                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                                transition: 'all 0.3s ease',
                                fontWeight: isActive ? 600 : 400
                            }}
                            className={isActive ? 'sidebar-item active' : 'sidebar-item'}
                        >
                            <item.icon size={20} style={{ marginRight: '12px' }} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={logout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    marginTop: 'auto',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    width: '100%'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
                <LogOut size={20} style={{ marginRight: '12px' }} />
                <span style={{ fontWeight: 500 }}>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
