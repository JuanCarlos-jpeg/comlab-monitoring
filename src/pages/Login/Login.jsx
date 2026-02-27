import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Mail, Eye, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isStudent, setIsStudent] = useState(true);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        // For student role, password is bypassed/not needed but for our test account logic we handle it
        const success = login(userId, isStudent ? 'test12345!' : password);
        if (!success) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const toggleRole = () => {
        setIsStudent(!isStudent);
        setPassword('');
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--maroon)',
            fontFamily: 'Inter, sans-serif'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '900px',
                    height: '560px',
                    display: 'flex',
                    backgroundColor: 'white',
                    borderRadius: '40px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Left Side - Login Form */}
                <div style={{ flex: 1, padding: '4rem 3.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3rem' }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--orange)', transform: 'rotate(45deg)', borderRadius: '4px' }}></div>
                        <span style={{ fontWeight: 600, fontSize: '1.25rem', color: '#1a1a1a' }}>Library Usage</span>
                    </div>

                    <h1 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '2.5rem', color: '#1a1a1a' }}>Log In to Access Facility</h1>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '12px',
                                backgroundColor: 'white',
                                padding: '0 4px',
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                zIndex: 1
                            }}>ID</label>
                            <input
                                type="text"
                                placeholder="20********"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 44px 14px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    color: '#1a1a1a',
                                    outline: 'none'
                                }}
                            />
                            <Mail size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db' }} />
                        </div>

                        <div style={{ position: 'relative', opacity: isStudent ? 0.5 : 1 }}>
                            <label style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '12px',
                                backgroundColor: 'white',
                                padding: '0 4px',
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                zIndex: 1
                            }}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                disabled={isStudent}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 44px 14px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                    color: '#1a1a1a',
                                    outline: 'none',
                                    backgroundColor: isStudent ? '#f9fafb' : 'white'
                                }}
                            />
                            <Eye size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '1px' }}>
                            <button
                                type="submit"
                                style={{
                                    flex: 1,
                                    backgroundColor: 'var(--orange)',
                                    color: 'white',
                                    padding: '14px',
                                    border: 'none',
                                    borderRadius: '6px 0 0 6px',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase'
                                }}
                            >
                                LOG IN
                            </button>
                            <button
                                type="button"
                                onClick={toggleRole}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'var(--maroon)',
                                    color: 'white',
                                    padding: '14px',
                                    border: 'none',
                                    borderRadius: '0 6px 6px 0',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase'
                                }}
                            >
                                AS A {isStudent ? 'STUDENT' : 'STAFF'}
                            </button>
                        </div>
                    </form>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span>No account?</span>
                        <a href="#" style={{ color: 'var(--maroon)', textDecoration: 'underline', fontWeight: 500 }}>Contact an admin</a>
                    </div>
                </div>

                {/* Right Side - Branding */}
                <div style={{ flex: 1, backgroundColor: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{
                        width: '240px',
                        height: '240px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(0,0,0,0.4)' // Dark grey placeholder logo
                    }}>
                        {/* Vite Logo placeholder as requested */}
                        <svg viewBox="0 0 410 404" width="180" height="180" fill="currentColor">
                            <path d="M373.5 33L205 343L36.5 33L81 33L205 259L329 33L373.5 33Z" />
                            <path d="M410 33L235 33L205 88L175 33L0 33L205 404L410 33Z" />
                        </svg>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
