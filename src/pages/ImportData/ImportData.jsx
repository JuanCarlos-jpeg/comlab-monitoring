import { motion } from 'framer-motion';
import { FileInput, Upload, CheckCircle2 } from 'lucide-react';
import bgImage from '../../assets/images/Mapua White Background 1.png';

const ImportDataPage = () => {
    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                overflow: 'auto',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                fontFamily: 'Inter, sans-serif'
            }}
        >
            <div
                style={{
                    minHeight: '100vh',
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    padding: '2rem 2rem 2rem 280px'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Import Data
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Upload data files to process and analyze.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div
                            className="glass-card"
                            style={{
                                padding: '3rem',
                                textAlign: 'center',
                                borderStyle: 'dashed',
                                borderWidth: '2px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1.5rem'
                            }}
                        >
                            <div
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)'
                                }}
                            >
                                <Upload size={32} />
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                    Select Files to Upload
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Drag and drop or click to browse CSV, XLSX, or JSON files.
                                </p>
                            </div>

                            <button className="btn-primary">Browse Files</button>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                                Import Status
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '12px',
                                        color: '#10b981',
                                        border: '1px solid rgba(16, 185, 129, 0.2)'
                                    }}
                                >
                                    <CheckCircle2 size={20} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                            Users_2024.csv
                                        </p>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                            Successfully processed 1,240 rows.
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '0.8rem' }}>2 min ago</span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(30, 41, 59, 0.5)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--glass-border)'
                                    }}
                                >
                                    <FileInput size={20} style={{ color: 'var(--text-muted)' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                            Analytics_Final.xlsx
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Waiting for processing...
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        10 min ago
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ImportDataPage;