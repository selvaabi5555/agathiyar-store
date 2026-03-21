import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { authAxios } = useAuth();
  const [form, setForm] = useState({ shop_name: '', shop_address: '', shop_phone: '', whatsapp_number: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    authAxios.get('/settings').then(r => setForm(r.data));
  }, []);

  const save = async () => {
    await authAxios.put('/settings', form);
    setMsg('✅ Settings saved!');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}
      <div className="card" style={{maxWidth:'600px'}}>
        <h3 style={{color:'var(--maroon)', marginBottom:'20px', fontFamily:'Playfair Display'}}>🏪 Shop Details</h3>
        {[
          ['shop_name', 'Shop Name', 'text', 'அகத்தியர் Store'],
          ['shop_address', 'Address', 'text', 'C.Ayyampalayam, Manachnallur...'],
          ['shop_phone', 'Phone', 'text', '074483 67291'],
        ].map(([f, l, t, ph]) => (
          <div className="form-group" key={f}>
            <label>{l}</label>
            <input type={t} className="form-control" value={form[f] || ''} placeholder={ph}
              onChange={e => setForm({...form, [f]: e.target.value})} />
          </div>
        ))}

        <hr style={{margin:'24px 0', border:'none', borderTop:'2px solid #f0f0f0'}} />

        <h3 style={{color:'#25D366', marginBottom:'16px'}}>📱 WhatsApp Settings</h3>
        <div className="form-group">
          <label>WhatsApp Number (Bill PDF இந்த number-க்கு send ஆகும்)</label>
          <input className="form-control" value={form.whatsapp_number || ''} placeholder="+91 98765 43210"
            onChange={e => setForm({...form, whatsapp_number: e.target.value})} />
          <small style={{color:'#6B7280', marginTop:'4px', display:'block'}}>
            💡 Bill create பண்ணும்போது, இந்த number-க்கு WhatsApp link automatically generate ஆகும். அந்த link click பண்ணி customer-க்கு forward பண்ணலாம்.
          </small>
        </div>

        <button className="btn btn-primary" style={{width:'100%', padding:'12px', marginTop:'8px'}} onClick={save}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}
