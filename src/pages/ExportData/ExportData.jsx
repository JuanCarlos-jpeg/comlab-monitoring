import { motion } from 'framer-motion';
import { FileOutput, Download, FileText, PieChart, BarChart } from 'lucide-react';
import FullPageBackground from '../../components/Layout/FullPageBackground';

const ExportDataPage = () => {
    const reports = [
        { title: 'Monthly Usage Report', type: 'PDF', date: 'Feb 2026', icon: FileText },
        { title: 'User Engagement Analytics', type: 'Excel', date: 'Jan 2026', icon: BarChart },
        { title: 'System Performance Overview', type: 'JSON', date: 'Feb 15, 2026', icon: PieChart },
    ];

    return (
        <FullPageBackground>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Export Data
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Generate and download analytics reports.
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}
                >
                    {reports.map((report, index) => (
                        <div
                            key={index}
                            className="glass-card"
                            style={{
                                padding: '1.5rem',
                                display: 'flex',
                                gap: '1.25rem',
                                alignItems: 'center'
                            }}
                        >
                            <div
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '12px',
                                    background: 'rgba(56, 189, 248, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent)'
                                }}
                            >
                                <report.icon size={24} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                    {report.title}
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {report.type} • {report.date}
                                </p>
                            </div>

                            <button
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        'rgba(255, 255, 255, 0.1)')
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        'rgba(255, 255, 255, 0.05)')
                                }
                            >
                                <Download size={18} />
                            </button>
                        </div>
                    ))}

                    <div
                        className="glass-card"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                            background:
                                'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)'
                        }}
                    >
                        <p style={{ fontWeight: 600 }}>Need a custom report?</p>
                        <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                            Create Custom Export
                        </button>
                    </div>
                </div>
            </motion.div>
        </FullPageBackground>
    );
};

export default ExportDataPage;