import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Products() {
  const { authAxios } = useAuth();
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '', image_url: '' });
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const fileRef = useRef();

  const load = () => authAxios.get('/products').then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category: '', price: '', stock: '', image_url: '' });
    setPreview(''); setMsg(''); setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category || '', price: p.price, stock: p.stock, image_url: p.image_url || '' });
    setPreview(p.image_url || ''); setMsg(''); setModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMsg('❌ Image 2MB-ஐ விட சிறியதாக இருக்கணும்');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setForm(f => ({ ...f, image_url: base64 }));
      setPreview(base64);
      setUploading(false);
    };
    reader.onerror = () => {
      setMsg('❌ Image read failed. Try again.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!form.name || !form.price) { setMsg('❌ Name & Price தேவை'); return; }
    const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
    if (editing) await authAxios.put(`/products/${editing.id}`, data);
    else await authAxios.post('/products', data);
    setModal(false); setMsg('✅ Saved!'); load();
    setTimeout(() => setMsg(''), 2000);
  };

  const del = async (id) => {
    if (!window.confirm('Delete?')) return;
    await authAxios.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👗 Products</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>
      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Image</th><th>Dress Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} style={{ width:52, height:52, objectFit:'cover', borderRadius:8, border:'1px solid #eee' }} />
                    : <div style={{ width:52, height:52, background:'#FFF5F5', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>👗</div>
                  }
                </td>
                <td><strong>{p.name}</strong></td>
                <td>{p.category || '-'}</td>
                <td>₹{p.price.toLocaleString()}</td>
                <td>{p.stock}</td>
                <td>
                  <span className={`badge ${p.stock > 5 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                    {p.stock > 5 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p style={{textAlign:'center',padding:'32px',color:'#999'}}>Products இல்லை. Add பண்ணுங்க!</p>}
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth:'540px'}}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? '✏️ Edit Product' : '+ Add Product'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>

            {/* Image Upload Box */}
            <div className="form-group">
              <label>📷 Product Image</label>
              <div onClick={() => fileRef.current.click()} style={{
                border: '2px dashed var(--border)', borderRadius:12, padding:'20px',
                textAlign:'center', cursor:'pointer', background:'#FAFAFA',
                minHeight:130, display:'flex', alignItems:'center', justifyContent:'center',
                flexDirection:'column', gap:8, transition:'border 0.2s'
              }}>
                {preview
                  ? <img src={preview} alt="preview" style={{maxHeight:150, maxWidth:'100%', borderRadius:8, objectFit:'cover'}} />
                  : uploading
                    ? <span style={{color:'var(--maroon)', fontWeight:500}}>⏳ Uploading...</span>
                    : <>
                        <span style={{fontSize:'2.2rem'}}>📁</span>
                        <span style={{color:'#6B7280', fontSize:'0.88rem', fontWeight:500}}>Click பண்ணி Photo select பண்ணுங்க</span>
                        <span style={{color:'#aaa', fontSize:'0.75rem'}}>JPG, PNG, WEBP · Max 5MB</span>
                      </>
                }
              </div>
              <input type="file" ref={fileRef} accept="image/*" style={{display:'none'}} onChange={handleImageUpload} />
              {preview && (
                <button className="btn btn-secondary btn-sm" style={{marginTop:8}}
                  onClick={() => { setPreview(''); setForm(f => ({...f, image_url:''})); }}>
                  🗑️ Remove Image
                </button>
              )}
            </div>

            {/* Name */}
            <div className="form-group">
              <label>Dress Name *</label>
              <input className="form-control" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g. Kanjivaram Saree" />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}>
                <option value="">Select Category...</option>
                <option value="Saree">Saree</option>
                <option value="Churidar">Churidar</option>
                <option value="Kids">Kids</option>
                <option value="Party">Party Wear</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price & Stock */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" className="form-control" value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})} placeholder="1500" />
              </div>
              <div className="form-group">
                <label>Stock Qty</label>
                <input type="number" className="form-control" value={form.stock}
                  onChange={e => setForm({...form, stock: e.target.value})} placeholder="10" />
              </div>
            </div>

            {msg && <div className="alert alert-error">{msg}</div>}
            <button className="btn btn-primary" style={{width:'100%', padding:'12px'}}
              onClick={save} disabled={uploading}>
              {uploading ? '⏳ Uploading...' : '💾 Save Product'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
