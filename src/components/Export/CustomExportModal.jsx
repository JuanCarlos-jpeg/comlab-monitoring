import { useState } from "react";
import { exportToExcel, exportToPDF, exportToJSON } from "../../services/exportService";

const CustomExportModal = ({ data, close }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [program, setProgram] = useState("All");
  const [year, setYear] = useState("All");
  const [format, setFormat] = useState("excel");

  const programs = [...new Set(data.map(d => d.program))].sort();
  const years = [...new Set(data.map(d => d.year))].sort();

  const generate = () => {
    let filtered = [...data];

    if (start) {
      filtered = filtered.filter(d => d.date >= start);
    }
    if (end) {
      filtered = filtered.filter(d => d.date <= end);
    }
    if (program !== "All") {
      filtered = filtered.filter(d => d.program === program);
    }
    if (year !== "All") {
      filtered = filtered.filter(d => String(d.year) === String(year));
    }

    if (format === "excel") {
      exportToExcel(filtered, "custom_report.xlsx", { raw: true });
    } else if (format === "pdf") {
      exportToPDF(filtered, "custom_report.pdf");
    } else if (format === "json") {
      exportToJSON(filtered, "custom_report.json");
    }

    close();
  };

  const labelStyle = {
    marginBottom: '0.5rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    display: 'block'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    background: '#1e293b',
    color: 'white',
    outline: 'none'
  };

  const optionStyle = {
    background: '#1e293b',
    color: 'white'
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-card"
        style={{
          padding: "2rem",
          width: "480px",
          position: "relative"
        }}>

        <h2 style={{ marginBottom: "1.5rem" }}>Create Custom Export</h2>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Start Date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>End Date</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Filter by Program</label>
            <select value={program} onChange={e => setProgram(e.target.value)} style={inputStyle}>
              <option value="All" style={optionStyle}>All</option>
              {programs.map(p => <option key={p} value={p} style={optionStyle}>{p}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Filter by Year Level</label>
            <select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>
              <option value="All" style={optionStyle}>All</option>
              {years.map(y => <option key={y} value={y} style={optionStyle}>{y}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Export Format</label>
            <select value={format} onChange={e => setFormat(e.target.value)} style={inputStyle}>
              <option value="excel" style={optionStyle}>Excel</option>
              <option value="pdf" style={optionStyle}>PDF</option>
              <option value="json" style={optionStyle}>JSON</option>
            </select>
          </div>
          <button className="btn-primary" onClick={generate} style={{ height: '42px' }}>
            Generate Report
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={close}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomExportModal;