import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Lock, User, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const success = login(userId, password);
        if (!success) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background elements */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '3rem 2.5rem',
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>Welcome</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '4px' }}>UserID</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="2021280003"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 42px',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '4px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 42px',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#ef4444',
                                    fontSize: '0.85rem',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                <ShieldAlert size={14} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', height: '48px', fontSize: '1rem' }}>
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <p>Test Account: <span style={{ color: 'var(--text-main)' }}>2021280003</span> / <span style={{ color: 'var(--text-main)' }}>test12345!</span></p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
