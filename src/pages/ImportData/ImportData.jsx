import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileInput, Upload, CheckCircle2, XCircle, AlertCircle, Trash2, Eye, EyeOff, Server, Loader2 } from 'lucide-react';
import FullPageBackground from '../../components/Layout/FullPageBackground';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const EXPECTED_HEADERS = ['ID', 'Name', 'Program', 'Year'];

// Finds the header row and maps data regardless of the leading empty columns (|||)
const parseRows = (rawRows) => {
    // Find header row — locate a row containing both 'ID' and 'Name'
    let headerRowIndex = -1;
    for (let i = 0; i < rawRows.length; i++) {
        const row = rawRows[i].map(c => String(c ?? '').trim());
        if (row.includes('ID') && row.includes('Name')) {
            headerRowIndex = i;
            break;
        }
    }

    if (headerRowIndex === -1) {
        return { error: 'Could not find a header row containing ID and Name columns.' };
    }

    const headerRow = rawRows[headerRowIndex].map(c => String(c ?? '').trim());

    // Map column names to their index positions
    const colMap = {};
    EXPECTED_HEADERS.forEach(col => {
        const idx = headerRow.indexOf(col);
        if (idx !== -1) colMap[col] = idx;
    });

    const missing = EXPECTED_HEADERS.filter(c => !(c in colMap));
    if (missing.length > 0) {
        return { error: `Missing columns: ${missing.join(', ')}` };
    }

    const data = [];
    for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
        const row = rawRows[i];
        if (!row || row.every(c => c === null || c === undefined || String(c).trim() === '')) continue;

        const entry = {};
        EXPECTED_HEADERS.forEach(col => {
            entry[col] = String(row[colMap[col]] ?? '').trim();
        });

        if (!entry['ID']) continue; // skip rows with no ID
        data.push(entry);
    }

    return { data };
};

const StatusBadge = ({ status }) => {
    const map = {
        success: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)', label: 'Valid Data' },
        uploaded: { bg: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: 'rgba(56,189,248,0.25)', label: 'Uploaded' },
        error: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)', label: 'Error' },
        parsing: { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', border: 'rgba(99,102,241,0.25)', label: 'Parsing…' },
        uploading: { bg: 'rgba(234,179,8,0.12)', color: '#eab308', border: 'rgba(234,179,8,0.25)', label: 'Uploading…' },
    };
    const s = map[status] || map.parsing;
    return (
        <span style={{
            fontSize: '0.72rem', fontWeight: 600, padding: '2px 9px', borderRadius: '999px',
            background: s.bg, color: s.color, border: `1px solid ${s.border}`
        }}>
            {s.label}
        </span>
    );
};

const ImportDataPage = () => {
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const fileInputRef = useRef(null);

    const processFile = useCallback((file) => {
        const ext = file.name.split('.').pop().toLowerCase();
        const id = `${file.name}-${Date.now()}`;

        setFiles(prev => [...prev, { id, rawFile: file, name: file.name, size: file.size, status: 'parsing', data: null, error: null, rowCount: 0 }]);

        const update = (updates) =>
            setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));

        const finish = (rawRows) => {
            const { data, error } = parseRows(rawRows);
            if (error) update({ status: 'error', error });
            else update({ status: 'success', data, rowCount: data.length });
        };

        if (ext === 'csv') {
            Papa.parse(file, {
                complete: (result) => finish(result.data),
                error: (err) => update({ status: 'error', error: err.message }),
                skipEmptyLines: false,
            });
        } else if (ext === 'xlsx' || ext === 'xls') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const wb = XLSX.read(e.target.result, { type: 'array' });
                    const sheet = wb.Sheets[wb.SheetNames[0]];
                    finish(XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }));
                } catch (err) {
                    update({ status: 'error', error: err.message });
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            update({ status: 'error', error: 'Unsupported file type. Use .xlsx, .xls, or .csv' });
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        Array.from(e.dataTransfer.files).forEach(processFile);
    }, [processFile]);

    const handleInput = (e) => {
        Array.from(e.target.files).forEach(processFile);
        e.target.value = '';
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        if (previewFile?.id === id) setPreviewFile(null);
    };

    const handleUpload = async (fileObj) => {
        if (!fileObj.rawFile || fileObj.status === 'uploading') return;

        const confirmOverwrite = window.confirm("You are about to overwrite the students list, this includes deleting everything in the time_logs. Please export them first before proceeding.");
        if (!confirmOverwrite) return;

        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));

        const formData = new FormData();
        formData.append('file', fileObj.rawFile);

        try {
            const response = await fetch('http://localhost:5000/api/students/import', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploaded', error: null } : f));
            alert(data.message || 'Successfully uploaded and overwritten database list!');
        } catch (err) {
            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error', error: err.message } : f));
        }
    };

    const fmtSize = (b) =>
        b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;

    return (
        <FullPageBackground>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>

                {/* ── Header ── */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Import Data</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Upload <strong style={{ color: 'var(--text)' }}>.xlsx</strong> or{' '}
                        <strong style={{ color: 'var(--text)' }}>.csv</strong> files with the format:{' '}
                        <code style={{ fontSize: '0.8rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '6px' }}>
                            ID|Name|Program|Year
                        </code>
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    {/* ── Drop Zone + Format Hint ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <motion.div
                            className="glass-card"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            animate={{ scale: dragging ? 1.01 : 1 }}
                            style={{
                                padding: '3rem', textAlign: 'center', borderStyle: 'dashed',
                                borderWidth: '2px', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: '1.5rem', cursor: 'pointer',
                                background: dragging ? 'rgba(99,102,241,0.06)' : undefined,
                                borderColor: dragging ? '#6366f1' : undefined,
                                transition: 'background 0.2s, border-color 0.2s',
                            }}
                        >
                            <motion.div
                                animate={{ y: dragging ? -6 : 0 }}
                                style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: 'rgba(99,102,241,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                                }}
                            >
                                <Upload size={32} />
                            </motion.div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                    {dragging ? 'Drop to upload' : 'Select Files to Upload'}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Drag & drop or click to browse.<br />
                                    Supports <strong>.xlsx</strong>, <strong>.xls</strong>, <strong>.csv</strong>
                                </p>
                            </div>
                            <button
                                className="btn-primary"
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            >
                                Browse Files
                            </button>
                            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" multiple style={{ display: 'none' }} onChange={handleInput} />
                        </motion.div>

                        {/* Column hint */}
                        <div className="glass-card" style={{ padding: '1.25rem' }}>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Required Columns:
                            </p>
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                {EXPECTED_HEADERS.map((col, i) => (
                                    <span key={i} style={{
                                        fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px',
                                        background: col.startsWith('(') ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.15)',
                                        color: col.startsWith('(') ? 'var(--text-muted)' : '#818cf8',
                                        border: '1px solid',
                                        borderColor: col.startsWith('(') ? 'var(--glass-border)' : 'rgba(99,102,241,0.3)'
                                    }}>
                                        {col}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Status Panel ── */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Import Status</h3>

                        {files.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '1rem', color: 'var(--text-muted)' }}>
                                <FileInput size={40} style={{ opacity: 0.3 }} />
                                <p style={{ fontSize: '0.9rem' }}>No files uploaded yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                                <AnimatePresence>
                                    {files.map((file) => (
                                        <motion.div
                                            key={file.id}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            style={{
                                                padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid',
                                                borderColor: file.status === 'success' ? 'rgba(16,185,129,0.25)' : file.status === 'error' ? 'rgba(239,68,68,0.25)' : 'var(--glass-border)',
                                                background: file.status === 'success' ? 'rgba(16,185,129,0.07)' : file.status === 'error' ? 'rgba(239,68,68,0.07)' : 'rgba(30,41,59,0.5)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {file.status === 'success' && <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />}
                                                {file.status === 'uploaded' && <Server size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />}
                                                {file.status === 'error' && <XCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />}
                                                {file.status === 'parsing' && <AlertCircle size={18} style={{ color: '#6366f1', flexShrink: 0 }} />}
                                                {file.status === 'uploading' && <Loader2 size={18} className="animate-spin" style={{ color: '#eab308', flexShrink: 0 }} />}

                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {file.name}
                                                        </p>
                                                        <StatusBadge status={file.status} />
                                                    </div>
                                                    <p style={{ fontSize: '0.78rem', color: file.status === 'error' ? '#f87171' : 'var(--text-muted)' }}>
                                                        {(file.status === 'success' || file.status === 'uploaded') && `${file.rowCount} rows parsed locally · ${fmtSize(file.size)}`}
                                                        {file.status === 'error' && file.error}
                                                        {file.status === 'parsing' && 'Processing file…'}
                                                        {file.status === 'uploading' && 'Sending to database…'}
                                                    </p>
                                                </div>

                                                <div style={{ display: 'flex', gap: '4px', flexShrink: 0, alignItems: 'center' }}>
                                                    {file.status === 'success' && (
                                                        <button
                                                            className="btn-primary"
                                                            onClick={() => handleUpload(file)}
                                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                                                        >
                                                            Upload DB
                                                        </button>
                                                    )}
                                                    {(file.status === 'success' || file.status === 'uploaded') && (
                                                        <button title="Preview" onClick={() => setPreviewFile(p => p?.id === file.id ? null : file)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: previewFile?.id === file.id ? '#6366f1' : 'var(--text-muted)', padding: '4px' }}>
                                                            {previewFile?.id === file.id ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    )}
                                                    <button title="Remove" onClick={() => removeFile(file.id)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Data Preview Table ── */}
                <AnimatePresence>
                    {previewFile?.data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="glass-card"
                            style={{ padding: '2rem', marginTop: '2rem', overflowX: 'auto' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Preview: {previewFile.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                        Showing {Math.min(previewFile.data.length, 50)} of {previewFile.data.length} rows
                                    </p>
                                </div>
                                <button onClick={() => setPreviewFile(null)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr>
                                        {EXPECTED_HEADERS.map(col => (
                                            <th key={col} style={{
                                                padding: '0.6rem 1rem', textAlign: 'left', fontWeight: 600,
                                                fontSize: '0.72rem', color: '#818cf8',
                                                borderBottom: '1px solid var(--glass-border)',
                                                whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em'
                                            }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewFile.data.slice(0, 50).map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            {EXPECTED_HEADERS.map(col => (
                                                <td key={col} style={{
                                                    padding: '0.6rem 1rem', whiteSpace: 'nowrap',
                                                    color: col === 'ID' ? '#6366f1' : 'var(--text)',
                                                    fontWeight: col === 'ID' ? 600 : 400,
                                                }}>
                                                    {row[col] || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>—</span>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </FullPageBackground >
    );
};

export default ImportDataPage;