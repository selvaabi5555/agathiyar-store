import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function StaffPage() {
  const { authAxios } = useAuth();
  const [staff, setStaff] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', role: '' });
  const [msg, setMsg] = useState('');

  const load = () => authAxios.get('/staff').then(r => setStaff(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name) { setMsg('❌ பேரு சொல்லுங்க'); return; }
    await authAxios.post('/staff', form);
    setModal(false); setMsg('✅ Staff added!'); load();
    setForm({ name:'', phone:'', role:'' });
    setTimeout(() => setMsg(''), 2000);
  };

  const del = async (id) => {
    if (!window.confirm('Delete?')) return;
    await authAxios.delete(`/staff/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👨‍💼 Staff</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Add Staff</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="card">
        <table className="data-table">
          <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Role</th><th>Joined</th><th>Delete</th></tr></thead>
          <tbody>
            {staff.map((s, i) => (
              <tr key={s.id}>
                <td>{i+1}</td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div style={{width:36, height:36, borderRadius:'50%', background:'var(--maroon)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600}}>
                      {s.name[0]}
                    </div>
                    <strong>{s.name}</strong>
                  </div>
                </td>
                <td>{s.phone || '-'}</td>
                <td>{s.role ? <span className="badge badge-info">{s.role}</span> : '-'}</td>
                <td style={{fontSize:'0.85rem', color:'#6B7280'}}>{s.joined_at}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => del(s.id)}>🗑️ Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && <p style={{textAlign:'center', padding:'32px', color:'#999'}}>Staff இல்லை. Add பண்ணுங்க!</p>}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">👨‍💼 Add Staff</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            {['name','phone','role'].map(f => (
              <div className="form-group" key={f}>
                <label>{{ name:'Name *', phone:'Phone', role:'Role' }[f]}</label>
                <input className="form-control" value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})}
                  placeholder={{ name:'Staff பேரு', phone:'Phone number', role:'e.g. Cashier, Sales' }[f]} />
              </div>
            ))}
            {msg && <div className="alert alert-error">{msg}</div>}
            <button className="btn btn-primary" style={{width:'100%'}} onClick={save}>💾 Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
