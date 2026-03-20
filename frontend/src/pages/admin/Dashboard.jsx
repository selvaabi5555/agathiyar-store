import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { authAxios } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    authAxios.get('/dashboard').then(r => setStats(r.data));
  }, []);

  const cards = [
    { label: "Today's Revenue", value: `₹${stats.today_revenue || 0}`, icon: '💰', color: '#10B981' },
    { label: "Today's Bills", value: stats.today_bills || 0, icon: '🧾', color: '#3B82F6' },
    { label: 'Total Revenue', value: `₹${(stats.total_revenue || 0).toLocaleString()}`, icon: '📈', color: '#8B1A1A' },
    { label: 'Total Bills', value: stats.total_bills || 0, icon: '📋', color: '#8B5CF6' },
    { label: 'Products', value: stats.total_products || 0, icon: '👗', color: '#F59E0B' },
    { label: 'Staff', value: stats.total_staff || 0, icon: '👨‍💼', color: '#06B6D4' },
    { label: 'Low Stock', value: stats.low_stock || 0, icon: '⚠️', color: '#EF4444' },
    { label: 'Pending Reviews', value: stats.pending_reviews || 0, icon: '⭐', color: '#D97706' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 Dashboard</h1>
        <span style={{color:'#6B7280', fontSize:'0.9rem'}}>
          {new Date().toLocaleDateString('ta-IN', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}
        </span>
      </div>
      <div className="stats-grid">
        {cards.map((c, i) => (
          <div key={i} className="stat-card" style={{borderLeftColor: c.color}}>
            <div style={{fontSize:'1.5rem', marginBottom:'4px'}}>{c.icon}</div>
            <div className="stat-value" style={{color: c.color}}>{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{fontFamily:'Playfair Display', color:'var(--maroon)', marginBottom:'16px'}}>
          👋 Welcome to Agathiyar - Store Admin
        </h3>
        <p style={{color:'#6B7280', lineHeight:1.8}}>
          இங்கே நீங்கள் Billing, Products, Staff, Reviews எல்லாமே manage பண்ணலாம்.<br />
          🧾 Billing → Customer bill create பண்ணி WhatsApp-ல் PDF send பண்ணலாம்<br />
          👗 Products → Dress add/edit/delete பண்ணலாம்<br />
          📊 Reports → Excel & PDF export பண்ணலாம்
        </p>
      </div>
    </div>
  );
}
