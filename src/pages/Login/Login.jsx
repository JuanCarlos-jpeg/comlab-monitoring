import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Mail, Eye, Info, User, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import bgImage from '../../assets/images/Mapua White Background 1.png';
import logoImage from '../../assets/images/Mapua Library Logo 2.png';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isStudent, setIsStudent] = useState(true);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: 'Inter, sans-serif'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '950px',
                    height: '580px',
                    display: 'flex',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                }}
            >
                {/* Left Side - Black with 60% Opacity */}
                <div style={{
                    flex: 1.2,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: '4rem 4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'white'
                }}>
                    {/* Left Side - Black with 60% Opacity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3rem' }}>
                        <div style={{ width: '5px', height: '5px', backgroundColor: '#ffffffff', transform: 'rotate(45deg)', borderRadius: '4px' }}></div>
                        <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'white', letterSpacing: '1px' }}>  LIBRARY USAGE</span>
                    </div>

                    <h1 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '2.5rem', color: 'white' }}>Log In to Access Facility</h1>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <label style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '12px',
                                backgroundColor: '#1a1a1a',
                                padding: '0 8px',
                                fontSize: '0.8rem',
                                color: '#9ca3af',
                                borderRadius: '4px',
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
                                    backgroundColor: 'transparent',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <User size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                        </div>

                        <div style={{ position: 'relative', opacity: isStudent ? 0.4 : 1, transition: 'opacity 0.3s' }}>
                            <label style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '12px',
                                backgroundColor: '#1a1a1a',
                                padding: '0 8px',
                                fontSize: '0.8rem',
                                color: '#9ca3af',
                                borderRadius: '4px',
                                zIndex: 1
                            }}>Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••••••"
                                value={password}
                                disabled={isStudent}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 44px 14px 16px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isStudent}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: isStudent ? 'default' : 'pointer' }}
                            >
                                <Eye size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '2px', marginTop: '0.5rem' }}>
                            <button
                                type="submit"
                                style={{
                                    flex: 1.2,
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    padding: '14px',
                                    border: 'none',
                                    borderRadius: '8px 0 0 8px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
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
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    padding: '14px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '0 8px 8px 0',
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

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '4px', fontSize: '0.85rem', color: '#9ca3af' }}>
                        <span>No account?</span>
                        <a href="#" style={{ color: '#dc2626', textDecoration: 'underline', fontWeight: 500 }}>Contact an admin</a>
                    </div>
                </div>

                {/* Right Side - Red with 80% Opacity */}
                <div style={{
                    flex: 1,
                    backgroundColor: 'rgba(185, 28, 28, 0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: 'auto',
                        marginTop: '2rem',
                        letterSpacing: '1px'
                    }}>
                        Brought to you by Mapua Library Services
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 'auto'
                    }}>
                        <img
                            src={logoImage}
                            alt="Mapua Logo"
                            width="375"
                            height="375"
                        />
                    </div>

                    <div style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginTop: 'auto',
                        marginBottom: '1rem',
                        lineHeight: 1.6
                    }}>
                        All rights reserved to Group 7, ITS120L CM2
                        <br />
                        © 2026 Mapua University
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
