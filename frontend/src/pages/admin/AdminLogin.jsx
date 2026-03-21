import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch {
      setError('தவறான username அல்லது password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span>👗</span>
          <h1>அகத்தியர் Store</h1>
          <p>Admin Login</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input className="form-control" placeholder="admin" value={form.username}
              onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', padding:'12px'}} disabled={loading}>
            {loading ? '...' : '🔐 Login'}
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:'16px', fontSize:'0.8rem', color:'#999'}}>
          <a href="/" style={{color:'var(--maroon)'}}>← Shop Page-க்கு செல்</a>
        </p>
      </div>
    </div>
  );
}
