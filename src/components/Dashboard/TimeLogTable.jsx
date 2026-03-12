import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const TimeLogTable = ({ data }) => {
  const [programFilter, setProgramFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const programs = useMemo(() => [...new Set(data.map(d => d.program))].filter(Boolean).sort(), [data]);
  const years = useMemo(() => [...new Set(data.map(d => d.year))].filter(Boolean).sort(), [data]);
  const filteredData = useMemo(() => {
    let result = data;

    if (programFilter !== 'All') {
      result = result.filter(log => log.program === programFilter);
    }

    if (yearFilter !== 'All') {
      result = result.filter(log => String(log.year) === String(yearFilter));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        log =>
          (log.name?.toLowerCase() || '').includes(q) ||
          (log.id?.toLowerCase() || '').includes(q)
      );
    }

    return result;
  }, [data, programFilter, yearFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [programFilter, yearFilter, searchQuery]);

  const selectStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    background: '#1e293b',
    color: 'white',
    fontSize: '0.85rem',
    outline: 'none'
  };

  const cellStyle = {
    padding: '0.75rem',
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'left'
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '480px' }}>
      <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 600 }}>Time Logs</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <select value={programFilter} onChange={e => setProgramFilter(e.target.value)} style={selectStyle}>
          <option value="All">All Programs</option>
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={selectStyle}>
          <option value="All">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search Name or ID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ ...selectStyle, paddingLeft: '2.5rem' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      </div>

      <div style={{ flex: 1, border: '1px solid var(--glass-border)', borderRadius: '12px', overflowX: 'auto', marginBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <tr>
              {['ID', 'Name', 'Program', 'Year', 'Date', 'Time In'].map(h => (
                <th key={h} style={{ ...cellStyle, color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((log, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{log.id}</td>
                  <td style={cellStyle}>{log.name}</td>
                  <td style={cellStyle}>{log.program}</td>
                  <td style={cellStyle}>{log.year}</td>
                  <td style={cellStyle}>{log.date}</td>
                  <td style={cellStyle}>{log.timeIn}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: 'auto' }}>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1 }}><ChevronLeft size={18} /></button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: currentPage === totalPages ? 0.3 : 1 }}><ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );
};

export default TimeLogTable;