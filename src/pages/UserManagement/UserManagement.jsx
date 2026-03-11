import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Trash2, X, Eye, EyeOff, ShieldCheck, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';
import FullPageBackground from '../../components/Layout/FullPageBackground';

const API = 'http://localhost:5000/api';

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onDone }) => {
    useEffect(() => {
        const t = setTimeout(onDone, 3000);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 20px',
                borderRadius: '12px',
                background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.15)',
                border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(220,38,38,0.4)'}`,
                backdropFilter: 'blur(12px)',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                maxWidth: '360px',
            }}
        >
            {type === 'success'
                ? <CheckCircle size={18} color="#10b981" />
                : <AlertCircle size={18} color="#dc2626" />}
            {msg}
        </motion.div>
    );
};

// ─── Floating Add Modal ───────────────────────────────────────────────────────
const AddModal = ({ onClose, onSuccess }) => {
    const [userType, setUserType] = useState('staff');
    const [form, setForm] = useState({ username: '', password: '', id: '', name: '', program: '', year: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (userType === 'staff') {
                if (!form.username || !form.password) { setError('Username and password are required.'); setLoading(false); return; }
                const res = await fetch(`${API}/admin-credentials`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: form.username, password: form.password }),
                });
                const data = await res.json();
                if (!res.ok) { setError(data.message); setLoading(false); return; }
            } else {
                if (!form.id || !form.name || !form.program || !form.year) { setError('All fields are required.'); setLoading(false); return; }
                if (!/^\d+$/.test(form.id)) { setError('Student ID must be numeric only.'); setLoading(false); return; }
                const res = await fetch(`${API}/students`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: form.id, name: form.name, program: form.program, year: form.year }),
                });
                const data = await res.json();
                if (!res.ok) { setError(data.message); setLoading(false); return; }
            }
            onSuccess(userType === 'staff' ? 'Staff account created.' : 'Student added.');
            onClose();
        } catch {
            setError('Network error. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 500,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                style={{
                    width: '100%', maxWidth: '440px',
                    background: 'rgba(15,15,20,0.95)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '20px',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
                    padding: '2rem',
                    position: 'relative',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.35rem', fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Add User</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>Choose a type below to proceed</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Radio Type Selector */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.75rem' }}>
                    {[
                        { val: 'staff', label: 'Staff', Icon: ShieldCheck },
                        { val: 'student', label: 'Student', Icon: GraduationCap },
                    ].map(({ val, label, Icon }) => (
                        <label key={val} style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                            background: userType === val ? 'rgba(220,38,38,0.18)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${userType === val ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.1)'}`,
                            transition: 'all 0.2s',
                        }}>
                            <input
                                type="radio" name="userType" value={val}
                                checked={userType === val}
                                onChange={() => { setUserType(val); setError(''); }}
                                style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                            />
                            <Icon size={16} color={userType === val ? '#dc2626' : 'var(--text-muted)'} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: userType === val ? 'white' : 'var(--text-muted)' }}>{label}</span>
                        </label>
                    ))}
                </div>

                {/* Form Fields */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={userType}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                    >
                        {userType === 'staff' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <Field label="Username" value={form.username} onChange={v => set('username', v)} placeholder="e.g. jdelacruz" />
                                <div style={{ position: 'relative' }}>
                                    <Field label="Password" value={form.password} onChange={v => set('password', v)} placeholder="••••••••" type={showPw ? 'text' : 'password'} />
                                    <button
                                        onClick={() => setShowPw(p => !p)}
                                        style={{
                                            position: 'absolute', right: '12px', bottom: '10px',
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                                            display: 'flex', alignItems: 'center',
                                        }}
                                    >
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <Field label="Student ID" value={form.id} onChange={v => set('id', v)} placeholder="Numbers only (e.g. 20231234)" inputMode="numeric" />
                                <Field label="Full Name" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Juan dela Cruz" />
                                <Field label="Program" value={form.program} onChange={v => set('program', v)} placeholder="e.g. BSIT" />
                                <Field label="Year" value={form.year} onChange={v => set('year', v)} placeholder="e.g. 2" inputMode="numeric" />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {error && (
                    <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', color: '#fca5a5', fontSize: '0.83rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <AlertCircle size={14} /> {error}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '1.5rem', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Saving…' : `Add ${userType === 'staff' ? 'Staff' : 'Student'}`}
                </button>
            </motion.div>
        </motion.div>
    );
};

const Field = ({ label, value, onChange, placeholder, type = 'text', inputMode }) => (
    <div>
        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>{label}</label>
        <input
            type={type}
            inputMode={inputMode}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', color: 'white', outline: 'none',
                fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(220,38,38,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const UserManagementPage = () => {
    const [tab, setTab] = useState('staff');
    const [showModal, setShowModal] = useState(false);
    const [staff, setStaff] = useState([]);
    const [students, setStudents] = useState([]);
    const [toast, setToast] = useState(null);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);

    const showToast = (msg, type = 'success') => setToast({ msg, type });

    const fetchStaff = useCallback(async () => {
        setLoadingStaff(true);
        try {
            const res = await fetch(`${API}/admin-credentials`);
            setStaff(await res.json());
        } catch { showToast('Failed to load staff.', 'error'); }
        finally { setLoadingStaff(false); }
    }, []);

    const fetchStudents = useCallback(async () => {
        setLoadingStudents(true);
        try {
            const res = await fetch(`${API}/students`);
            setStudents(await res.json());
        } catch { showToast('Failed to load students.', 'error'); }
        finally { setLoadingStudents(false); }
    }, []);

    useEffect(() => { fetchStaff(); fetchStudents(); }, [fetchStaff, fetchStudents]);

    const deleteStaff = async (id) => {
        try {
            const res = await fetch(`${API}/admin-credentials/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) { showToast(data.message, 'error'); return; }
            showToast('Staff removed.');
            setStaff(prev => prev.filter(s => s.id !== id));
        } catch { showToast('Failed to delete.', 'error'); }
    };

    const handleSuccess = (msg) => {
        showToast(msg);
        fetchStaff();
        fetchStudents();
    };

    const thStyle = {
        padding: '12px 16px', color: 'var(--text-muted)',
        fontSize: '0.78rem', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        textAlign: 'left', borderBottom: '1px solid var(--glass-border)'
    };
    const tdStyle = { padding: '14px 16px', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.05)' };

    return (
        <FullPageBackground>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, fontFamily: 'Outfit,sans-serif', marginBottom: '0.4rem' }}>User Management</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage staff accounts and student records.</p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                    >
                        <UserPlus size={17} />
                        Add User
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '1.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {[
                        { key: 'staff', label: 'Staff', Icon: ShieldCheck },
                        { key: 'students', label: 'Students', Icon: GraduationCap },
                    ].map(({ key, label, Icon }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '7px',
                                padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                                fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.88rem',
                                transition: 'all 0.2s',
                                background: tab === key ? 'var(--primary)' : 'transparent',
                                color: tab === key ? 'white' : 'var(--text-muted)',
                            }}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tables */}
                <AnimatePresence mode="wait">
                    {tab === 'staff' ? (
                        <motion.div key="staff" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card" style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ShieldCheck size={18} color="var(--primary)" />
                                <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600 }}>Staff Accounts</span>
                                <span style={{ marginLeft: 'auto', background: 'rgba(220,38,38,0.15)', color: 'var(--primary)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>{staff.length}</span>
                            </div>
                            {loadingStaff ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
                            ) : staff.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <ShieldCheck size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p>No staff accounts yet.</p>
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>#</th>
                                            <th style={thStyle}>Username</th>
                                            <th style={thStyle}>Created</th>
                                            <th style={{ ...thStyle, textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staff.map((s, i) => (
                                            <tr key={s.id} style={{ transition: 'background 0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <td style={{ ...tdStyle, color: 'var(--text-muted)', width: '48px' }}>{i + 1}</td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                                                            {s.username[0].toUpperCase()}
                                                        </div>
                                                        {s.username}
                                                    </div>
                                                </td>
                                                <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                                    {new Date(s.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => deleteStaff(s.id)}
                                                        style={{
                                                            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
                                                            borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#f87171',
                                                            display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem',
                                                            transition: 'all 0.2s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.25)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.5)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.2)'; }}
                                                    >
                                                        <Trash2 size={13} /> Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="students" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card" style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <GraduationCap size={18} color="var(--accent)" />
                                <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 600 }}>Students</span>
                                <span style={{ marginLeft: 'auto', background: 'rgba(250,204,21,0.12)', color: 'var(--accent)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>{students.length}</span>
                            </div>
                            {loadingStudents ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
                            ) : students.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <GraduationCap size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p>No students yet. Add one using the button above.</p>
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>ID</th>
                                            <th style={thStyle}>Name</th>
                                            <th style={thStyle}>Program</th>
                                            <th style={thStyle}>Year</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(s => (
                                            <tr key={s.id} style={{ transition: 'background 0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', fontFamily: 'monospace' }}>{s.id}</td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(250,204,21,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>
                                                            {s.name[0].toUpperCase()}
                                                        </div>
                                                        {s.name}
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{ background: 'rgba(250,204,21,0.08)', color: 'var(--accent)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        {s.program}
                                                    </span>
                                                </td>
                                                <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>Year {s.year}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Floating Modal */}
            <AnimatePresence>
                {showModal && (
                    <AddModal
                        onClose={() => setShowModal(false)}
                        onSuccess={handleSuccess}
                    />
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
                )}
            </AnimatePresence>
        </FullPageBackground>
    );
};

export default UserManagementPage;