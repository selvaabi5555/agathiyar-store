import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const navItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard', end: true },
  { path: '/admin/products', icon: '👗', label: 'Products' },
  { path: '/admin/billing', icon: '🧾', label: 'Billing' },
  { path: '/admin/staff', icon: '👨‍💼', label: 'Staff' },
  { path: '/admin/reviews', icon: '⭐', label: 'Reviews' },
  { path: '/admin/reports', icon: '📈', label: 'Reports' },
  { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span>👗</span>
          <div>
            <h2>Agathiyar - Store</h2>
            <p>Admin Panel</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.end}
              className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a href="/" className="shop-link">🏪 Shop Page</a>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
