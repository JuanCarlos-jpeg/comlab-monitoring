import { motion } from 'framer-motion';

const BarChart = ({ data, title, chartHeight = '200px' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No data available.</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sortedData.map(item => item.value));

  const colors = [
    '#6366f1',
    '#38bdf8',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#8b5cf6',
    '#f97316',
    '#06b6d4',
    '#22c55e',
  ];

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '2.5rem', fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: chartHeight,
        gap: '1.25rem',
        paddingBottom: '1.5rem',
        paddingTop: '1rem'
      }}>
        {sortedData.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              height: '100%',
              justifyContent: 'flex-end',
              position: 'relative'
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: 'white'
              }}
            >
              {item.value}
            </motion.span>

            <motion.div
              style={{
                width: '100%',
                backgroundColor: colors[index % colors.length],
                borderRadius: '6px 6px 2px 2px',
                boxShadow: `0 4px 15px ${colors[index % colors.length]}30`
              }}
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 85}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
            />

            <p style={{
              position: 'absolute',
              bottom: '-1.75rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              width: '100%',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 500
            }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;