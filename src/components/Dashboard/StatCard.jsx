import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      className="glass-card"
      style={{ padding: '1.5rem' }}
      whileHover={{ scale: 1.03 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}>
          {icon}
        </div>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{title}</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;