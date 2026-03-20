import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Billing() {
  const { authAxios, API } = useAuth();
  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bills, setBills] = useState([]);
  const [tab, setTab] = useState('new');

  // New bill form
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [items, setItems] = useState([{ product_id: '', name: '', price: 0, qty: 1 }]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState('cash');
  const [staffId, setStaffId] = useState('');
  const [msg, setMsg] = useState('');
  const [waLink, setWaLink] = useState('');
  const [lastBillId, setLastBillId] = useState(null);

  useEffect(() => {
    authAxios.get('/products').then(r => setProducts(r.data));
    authAxios.get('/staff').then(r => setStaff(r.data));
    authAxios.get('/bills').then(r => setBills(r.data));
  }, []);

  const addItem = () => setItems([...items, { product_id: '', name: '', price: 0, qty: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const updateItem = (i, field, value) => {
    const updated = [...items];
    if (field === 'product_id') {
      const p = products.find(p => p.id === parseInt(value));
      updated[i] = { ...updated[i], product_id: value, name: p?.name || '', price: p?.price || 0 };
    } else {
      updated[i] = { ...updated[i], [field]: value };
    }
    setItems(updated);
  };

  const subtotal = items.reduce((s, i) => s + (i.price * i.qty), 0);
  const total = subtotal - discount;

  const createBill = async () => {
    if (!customer.name) { setMsg('❌ Customer பேரு சொல்லுங்க'); return; }
    if (items.some(i => !i.product_id)) { setMsg('❌ Product select பண்ணுங்க'); return; }
    try {
      const res = await authAxios.post('/bills', {
        customer_name: customer.name, customer_phone: customer.phone,
        items: items.map(i => ({ product_id: parseInt(i.product_id), name: i.name, price: i.price, qty: parseInt(i.qty) })),
        discount: parseFloat(discount) || 0, payment_method: payment,
        staff_id: staffId ? parseInt(staffId) : null
      });
      setMsg(`✅ Bill ${res.data.bill_number} ready!`);
      setLastBillId(res.data.bill_id);
      setWaLink(res.data.whatsapp_link);
      authAxios.get('/bills').then(r => setBills(r.data));
      // Reset
      setCustomer({ name: '', phone: '' });
      setItems([{ product_id: '', name: '', price: 0, qty: 1 }]);
      setDiscount(0); setPayment('cash'); setStaffId('');
    } catch { setMsg('❌ Error occurred'); }
  };

  const deleteBill = async (id, billNo) => {
    if (!window.confirm(`Bill ${billNo} delete பண்ணணுமா?`)) return;
    await authAxios.delete(`/bills/${id}`);
    authAxios.get('/bills').then(r => setBills(r.data));
  };

  const downloadPDF = (billId) => {
    const token = localStorage.getItem('admin_token');
    window.open(`${API}/bills/${billId}/pdf?token=${token}`, '_blank');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🧾 Billing</h1>
        <div>
          <button className={`btn ${tab === 'new' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('new')}>+ New Bill</button>
          {' '}
          <button className={`btn ${tab === 'history' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('history')}>📋 History</button>
        </div>
      </div>

      {tab === 'new' && (
        <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px', alignItems:'start'}}>
          <div>
            {msg && (
              <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
                {msg}
                {waLink && (
                  <div style={{marginTop:'10px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
                    <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">
                      📱 WhatsApp-ல் Send பண்ணு
                    </a>
                    {lastBillId && (
                      <button className="btn btn-secondary btn-sm" onClick={() => downloadPDF(lastBillId)}>
                        📄 PDF Download
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Customer */}
            <div className="card" style={{marginBottom:'16px'}}>
              <h3 style={{marginBottom:'16px', color:'var(--maroon)'}}>👤 Customer Details</h3>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                <div className="form-group" style={{marginBottom:0}}>
                  <label>Customer Name *</label>
                  <input className="form-control" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} placeholder="Name" />
                </div>
                <div className="form-group" style={{marginBottom:0}}>
                  <label>Phone</label>
                  <input className="form-control" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} placeholder="Phone number" />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="card" style={{marginBottom:'16px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
                <h3 style={{color:'var(--maroon)'}}>👗 Items</h3>
                <button className="btn btn-secondary btn-sm" onClick={addItem}>+ Add Item</button>
              </div>
              {items.map((item, i) => (
                <div key={i} style={{display:'grid', gridTemplateColumns:'2fr 1fr 80px 40px', gap:'10px', marginBottom:'12px', alignItems:'end'}}>
                  <div className="form-group" style={{marginBottom:0}}>
                    {i === 0 && <label>Product</label>}
                    <select className="form-control" value={item.product_id} onChange={e => updateItem(i, 'product_id', e.target.value)}>
                      <option value="">Select Dress...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    {i === 0 && <label>Price (₹)</label>}
                    <input type="number" className="form-control" value={item.price} onChange={e => updateItem(i, 'price', parseFloat(e.target.value))} />
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    {i === 0 && <label>Qty</label>}
                    <input type="number" className="form-control" min="1" value={item.qty} onChange={e => updateItem(i, 'qty', parseInt(e.target.value))} />
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeItem(i)} style={{height:'42px'}}>🗑️</button>
                </div>
              ))}
            </div>

            {/* Payment */}
            <div className="card">
              <h3 style={{marginBottom:'16px', color:'var(--maroon)'}}>💳 Payment</h3>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'16px'}}>
                {[['cash','💵 Cash'],['gpay','📱 G-Pay'],['credit','💳 Credit']].map(([v, l]) => (
                  <button key={v} className={`btn ${payment === v ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPayment(v)}>{l}</button>
                ))}
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                <div className="form-group" style={{marginBottom:0}}>
                  <label>Discount (₹)</label>
                  <input type="number" className="form-control" value={discount} onChange={e => setDiscount(e.target.value)} />
                </div>
                <div className="form-group" style={{marginBottom:0}}>
                  <label>Staff</label>
                  <select className="form-control" value={staffId} onChange={e => setStaffId(e.target.value)}>
                    <option value="">Select Staff...</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{position:'sticky', top:'24px'}}>
            <h3 style={{color:'var(--maroon)', marginBottom:'16px', fontFamily:'Playfair Display'}}>🧾 Bill Summary</h3>
            {items.filter(i => i.product_id).map((item, i) => (
              <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f0f0f0', fontSize:'0.9rem'}}>
                <span>{item.name} x{item.qty}</span>
                <span>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{marginTop:'16px', borderTop:'2px solid var(--maroon)', paddingTop:'12px'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px', fontSize:'0.9rem'}}>
                <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px', color:'#10B981', fontSize:'0.9rem'}}>
                  <span>Discount</span><span>-₹{discount}</span>
                </div>
              )}
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:700, color:'var(--maroon)', marginTop:'8px'}}>
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
              <div style={{marginTop:'8px', fontSize:'0.85rem', color:'#6B7280'}}>
                💳 {payment === 'cash' ? '💵 Cash' : payment === 'gpay' ? '📱 G-Pay' : '💳 Credit'}
              </div>
            </div>
            <button className="btn btn-primary" style={{width:'100%', marginTop:'20px', padding:'14px', fontSize:'1rem'}}
              onClick={createBill}>
              🧾 Bill Create பண்ணு
            </button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <table className="data-table">
            <thead><tr><th>Bill No</th><th>Customer</th><th>Phone</th><th>Total</th><th>Payment</th><th>Date</th><th>PDF</th></tr></thead>
            <tbody>
              {bills.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.bill_number}</strong></td>
                  <td>{b.customer_name}</td>
                  <td>{b.customer_phone || '-'}</td>
                  <td><strong>₹{b.total.toLocaleString()}</strong></td>
                  <td>
                    <span className={`badge ${b.payment_method === 'cash' ? 'badge-success' : b.payment_method === 'gpay' ? 'badge-info' : 'badge-warning'}`}>
                      {b.payment_method === 'cash' ? '💵 Cash' : b.payment_method === 'gpay' ? '📱 G-Pay' : '💳 Credit'}
                    </span>
                  </td>
                  <td style={{fontSize:'0.85rem'}}>{b.created_at}</td>
                  <td style={{display:'flex', gap:'6px'}}>
                    <button className="btn btn-secondary btn-sm" onClick={() => downloadPDF(b.id)}>📄 PDF</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteBill(b.id, b.bill_number)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bills.length === 0 && <p style={{textAlign:'center', padding:'32px', color:'#999'}}>Bills இல்லை</p>}
        </div>
      )}
    </div>
  );
}
