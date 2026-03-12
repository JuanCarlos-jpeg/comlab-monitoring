import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const PieChart = ({ data, title, size = 150 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No data available.</p>
      </div>
    );
  }

  const total = data.reduce((acc, item) => acc + item.value, 0);
  let startAngle = -90;

  const radius = size / 2.5;
  const cx = size / 2;
  const cy = size / 2;

  const getArcPath = (startAngle, endAngle) => {
    const start = {
      x: cx + radius * Math.cos(Math.PI * startAngle / 180),
      y: cy + radius * Math.sin(Math.PI * startAngle / 180)
    };
    const end = {
      x: cx + radius * Math.cos(Math.PI * endAngle / 180),
      y: cy + radius * Math.sin(Math.PI * endAngle / 180)
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${cx},${cy} L ${start.x},${start.y} A ${radius},${radius} 0 ${largeArcFlag} 1 ${end.x},${end.y} Z`;
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const endAngle = startAngle + angle;
            const path = getArcPath(startAngle, endAngle);
            const color = COLORS[index % COLORS.length];
            startAngle = endAngle;
            return (
              <motion.path
                key={index}
                d={path}
                fill={color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.label}: </span>
              <span style={{ fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;