import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Mail, Eye, Info, User, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '../../assets/images/Mapua White Background 1.png';
import logoImage from '../../assets/images/Mapua Library Logo 2.png';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isStudent, setIsStudent] = useState(true);

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // New state for 2-step verification
    const [timeInStep, setTimeInStep] = useState(1);
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!userId.trim()) {
            setError('Please enter an ID.');
            return;
        }

        if (isStudent) {
            if (timeInStep === 1) {
                // Step 1: Fetch student data
                setIsLoading(true);
                try {
                    const response = await fetch(`http://localhost:5000/api/students/${userId}`);
                    if (!response.ok) {
                        throw new Error('Student ID not found.');
                    }
                    const data = await response.json();
                    setStudentData(data);
                    setTimeInStep(2);
                } catch (err) {
                    setError('Student ID not found. Please check and try again.');
                } finally {
                    setIsLoading(false);
                }
            } else if (timeInStep === 2) {
                // Step 2: Confirm time in
                setIsLoading(true);
                try {
                    const now = new Date();
                    // format date for mysql (YYYY-MM-DD)
                    const dateStr = now.toISOString().split('T')[0];
                    /* format time for mysql - handle local time zone properly by taking time from Date object */
                    const timeStr = now.toTimeString().split(' ')[0];

                    const response = await fetch('http://localhost:5000/api/time-in', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: studentData.id,
                            name: studentData.name,
                            program: studentData.program,
                            year: studentData.year,
                            date: dateStr,
                            timeIn: timeStr
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to record time in.');
                    }

                    setSuccessMessage('Successfully timed in!');
                    setUserId('');
                    setStudentData(null);
                    setTimeInStep(1);

                    // Clear success message after 3 seconds
                    setTimeout(() => setSuccessMessage(''), 3000);
                } catch (err) {
                    setError('Failed to record time in. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            // Staff login
            const success = login(userId, password);
            if (!success) {
                setError('Invalid credentials. Please try again.');
            }
        }
    };

    const toggleRole = () => {
        setIsStudent(!isStudent);
        setPassword('');
        setError('');
        setSuccessMessage('');
        setTimeInStep(1);
        setStudentData(null);
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
                {/* Left Side - Black with 90% Opacity */}
                <div style={{
                    flex: 1.2,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: '4rem 4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3rem' }}>
                        <div style={{ width: '5px', height: '5px', backgroundColor: '#ffffffff', transform: 'rotate(45deg)', borderRadius: '4px' }}></div>
                        <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'white', letterSpacing: '1px' }}>  LIBRARY USAGE</span>
                    </div>

                    <h1 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '2.5rem', color: 'white' }}>
                        {isStudent && timeInStep === 2 ? 'Verify Student Info' : 'Log In to Access Facility'}
                    </h1>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>

                        <div style={{ minHeight: '1.5rem', marginTop: '-1rem' }}>
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                {successMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <CheckCircle2 size={16} />
                                        {successMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {(!isStudent || timeInStep === 1) && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative' }}>
                                <label style={{
                                    position: 'absolute', top: '-10px', left: '12px', backgroundColor: '#1a1a1a', padding: '0 8px', fontSize: '0.8rem', color: '#9ca3af', borderRadius: '4px', zIndex: 1
                                }}>ID</label>
                                <input
                                    type="text"
                                    placeholder="20********"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    disabled={isLoading}
                                    style={{
                                        width: '100%', padding: '14px 44px 14px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', fontSize: '1rem', color: 'white', outline: 'none', opacity: isLoading ? 0.6 : 1
                                    }}
                                />
                                <User size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                            </motion.div>
                        )}

                        {isStudent && timeInStep === 2 && studentData && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.85rem'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>ID:</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{studentData.id}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Name:</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{studentData.name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Program:</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{studentData.program}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Year:</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{studentData.year}</span>
                                </div>
                            </motion.div>
                        )}

                        {!isStudent && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative' }}>
                                <label style={{
                                    position: 'absolute', top: '-10px', left: '12px', backgroundColor: '#1a1a1a', padding: '0 8px', fontSize: '0.8rem', color: '#9ca3af', borderRadius: '4px', zIndex: 1
                                }}>Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%', padding: '14px 44px 14px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', fontSize: '1rem', color: 'white', outline: 'none'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                                >
                                    <Eye size={18} />
                                </button>
                            </motion.div>
                        )}

                        <div style={{ display: 'flex', gap: '2px', marginTop: 'auto' }}>
                            {isStudent && timeInStep === 2 ? (
                                <>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        style={{
                                            flex: 1.2, backgroundColor: '#10b981', color: 'white', padding: '14px', border: 'none', borderRadius: '8px 0 0 8px', fontWeight: 600, fontSize: '0.95rem', cursor: isLoading ? 'default' : 'pointer', textTransform: 'uppercase', opacity: isLoading ? 0.7 : 1, transition: 'background 0.2s'
                                        }}
                                    >
                                        {isLoading ? 'RECORDING...' : 'CONFIRM TIME IN'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setTimeInStep(1)}
                                        style={{
                                            flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0 8px 8px 0', fontWeight: 600, fontSize: '0.9rem', cursor: isLoading ? 'default' : 'pointer', textTransform: 'uppercase'
                                        }}
                                    >
                                        CANCEL
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        style={{
                                            flex: 1.2, backgroundColor: '#dc2626', color: 'white', padding: '14px', border: 'none', borderRadius: '8px 0 0 8px', fontWeight: 600, fontSize: '0.95rem', cursor: isLoading ? 'default' : 'pointer', textTransform: 'uppercase', opacity: isLoading ? 0.7 : 1
                                        }}
                                    >
                                        {isLoading ? 'LOADING...' : (isStudent ? 'VERIFY ID' : 'LOG IN')}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={toggleRole}
                                        style={{
                                            flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0 8px 8px 0', fontWeight: 600, fontSize: '0.9rem', cursor: isLoading ? 'default' : 'pointer', textTransform: 'uppercase'
                                        }}
                                    >
                                        AS A {isStudent ? 'STAFF' : 'STUDENT'}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
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
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 'auto', marginTop: '2rem', letterSpacing: '1px' }}>
                        Brought to you by Mapua Library Services
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                        <img src={logoImage} alt="Mapua Logo" width="375" height="375" />
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: 'auto', marginBottom: '1rem', lineHeight: 1.6 }}>
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
