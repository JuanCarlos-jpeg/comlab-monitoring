import { motion } from 'framer-motion';
import { Download, FileText, PieChart, BarChart } from 'lucide-react';
import FullPageBackground from '../../components/Layout/FullPageBackground';
import { exportToExcel, exportToJSON, exportToPDF } from "../../services/exportService";
import { useState, useEffect } from "react";
import CustomExportModal from "../../components/Export/CustomExportModal";

const ExportDataPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [timeLogs, setTimeLogs] = useState([]);

  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/time-logs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTimeLogs(data);
      } catch (error) {
        console.error('Error fetching time logs:', error);
        setTimeLogs([]);
      }
    };

    fetchTimeLogs();
  }, []);

  const reports = [
    { title: 'Monthly Usage Report', type: 'pdf', date: 'Feb 2026', icon: FileText },
    { title: 'User Engagement Analytics', type: 'excel', date: 'Jan 2026', icon: BarChart },
    { title: 'System Performance Overview', type: 'json', date: 'Feb 15, 2026', icon: PieChart },
  ];

  const getSystemPerformance = () => {
    if (!timeLogs || timeLogs.length === 0) {
      return [{
        totalStudentsLogged: 0,
        uniquePrograms: 0,
        uniqueDays: 0
      }];
    }
    return [{
      totalStudentsLogged: timeLogs.length,
      uniquePrograms: [...new Set(timeLogs.map(s => s.program))].length,
      uniqueDays: [...new Set(timeLogs.map(s => s.date))].length
    }];
  };

  const handleExport = (type) => {
    if (type === "pdf") {
      exportToPDF(timeLogs);
    }
    if (type === "excel") {
      exportToExcel(timeLogs);
    }
    if (type === "json") {
      exportToJSON(getSystemPerformance());
    }
  };

  return (
    <FullPageBackground>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Export Data</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Generate and download analytics reports.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: '1.5rem'
        }}>
          {reports.map((report, index) => (
            <div key={index} className="glass-card"
              style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(56,189,248,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}>
                <report.icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  {report.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {report.type.toUpperCase()} • {report.date}
                </p>
              </div>
              <button
                onClick={() => handleExport(report.type)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer'
                }}>
                <Download size={18} />
              </button>
            </div>
          ))}
          <div className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(56,189,248,0.1) 100%)'
            }}>
            <p style={{ fontWeight: 600 }}>Need a custom report?</p>
            <button
              className="btn-primary"
              onClick={() => setShowModal(true)}
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              Create Custom Export
            </button>
          </div>
        </div>
        {showModal &&
          <CustomExportModal
            data={timeLogs}
            close={() => setShowModal(false)}
          />
        }
      </motion.div>
    </FullPageBackground>
  );
};

export default ExportDataPage;