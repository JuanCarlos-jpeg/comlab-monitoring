import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileInput, FileOutput, ArrowRight, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import FullPageBackground from '../../components/Layout/FullPageBackground';
import StatCard from '../../components/Dashboard/StatCard';
import BarChart from '../../components/Dashboard/BarChart';
import TimeLogTable from '../../components/Dashboard/TimeLogTable';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [timeLogs, setTimeLogs] = useState([]);
    const [stats, setStats] = useState({
        totalLogins: 0,
        uniqueUsers: 0,
    });
    const [loginsByProgram, setLoginsByProgram] = useState([]);

    useEffect(() => {
        const fetchTimeLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/time-logs');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTimeLogs(data);
                processAnalytics(data);
            } catch (error) {
                console.error('Error fetching time logs:', error);
            }
        };

        fetchTimeLogs();
    }, []);

    const processAnalytics = (data) => {
        if (!data || data.length === 0) return;

        const totalLogins = data.length;
        const uniqueUsers = new Set(data.map(log => log.id)).size;
        setStats({ totalLogins, uniqueUsers });

        const programCounts = data.reduce((acc, log) => {
            acc[log.program] = (acc[log.program] || 0) + 1;
            return acc;
        }, {});
        const programData = Object.keys(programCounts).map(program => ({
            label: program,
            value: programCounts[program]
        }));
        setLoginsByProgram(programData);
    };

    const navButtons = [
        { label: 'Dashboard', path: '/dashboard', color: '#6366f1', icon: LayoutDashboard },
        { label: 'User Management', path: '/users', color: '#38bdf8', icon: Users },
        { label: 'Import Data', path: '/import', color: '#10b981', icon: FileInput },
        { label: 'Export Data', path: '/export', color: '#f59e0b', icon: FileOutput },
    ];

    return (
        <FullPageBackground>
            <div>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Overview of your analytics and system status.
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}
                >
                    {navButtons.map((btn, index) => (
                        <motion.div
                            key={btn.path}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card"
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease'
                            }}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                            onClick={() => navigate(btn.path)}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: `${btn.color}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: btn.color,
                                    marginBottom: '0.5rem'
                                }}
                            >
                                <btn.icon size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                    {btn.label}
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Quick access to {btn.label.toLowerCase()} tools.
                                </p>
                            </div>
                            <div
                                style={{
                                    marginTop: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: btn.color
                                }}
                            >
                                <span>Open Page</span>
                                <ArrowRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                        Recent Analytics
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                        <StatCard
                            title="Total Logins"
                            value={stats.totalLogins}
                            icon={<LogIn size={20} />}
                            color="#38bdf8"
                        />
                        <StatCard
                            title="Unique Users"
                            value={stats.uniqueUsers}
                            icon={<Users size={20} />}
                            color="#6366f1"
                        />
                        <BarChart
                            title="Logins by Program"
                            data={loginsByProgram}
                            color="var(--accent)"
                            chartHeight="320px"
                        />
                        <TimeLogTable data={timeLogs} />
                    </div>
                </div>
            </div>
        </FullPageBackground>
    );
};

export default DashboardPage;