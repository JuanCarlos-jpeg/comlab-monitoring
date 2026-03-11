import { motion } from 'framer-motion';
import { Users, UserPlus, Search, MoreHorizontal } from 'lucide-react';
import FullPageBackground from '../../components/Layout/FullPageBackground';

const UserManagementPage = () => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
    ];

    return (
        <FullPageBackground>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            User Management
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Manage system users and access permissions.
                        </p>
                    </div>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserPlus size={18} />
                        <span>Add User</span>
                    </button>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Search users..."
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 42px',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <th style={{ padding: '12px 16px' }}>Name</th>
                                <th style={{ padding: '12px 16px' }}>Email</th>
                                <th style={{ padding: '12px 16px' }}>Role</th>
                                <th style={{ padding: '12px 16px' }}>Status</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: '1px solid var(--glass-border)',
                                        transition: 'background 0.3s'
                                    }}
                                >
                                    <td style={{ padding: '16px' }}>{user.name}</td>
                                    <td style={{ padding: '16px' }}>{user.email}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                color: 'var(--primary)',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div
                                                style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background:
                                                        user.status === 'Active'
                                                            ? '#10b981'
                                                            : '#94a3b8'
                                                }}
                                            ></div>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </FullPageBackground>
    );
};

export default UserManagementPage;