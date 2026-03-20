import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star ${s <= rating ? '' : 'empty'}`}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsAdmin() {
  const { authAxios } = useAuth();
  const [reviews, setReviews] = useState([]);

  const load = () => authAxios.get('/reviews/all').then(r => setReviews(r.data));
  useEffect(() => { load(); }, []);

  const toggle = async (id) => { await authAxios.put(`/reviews/${id}/approve`); load(); };
  const del = async (id) => { if (!window.confirm('Delete?')) return; await authAxios.delete(`/reviews/${id}`); load(); };

  const pending = reviews.filter(r => !r.approved);
  const approved = reviews.filter(r => r.approved);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">⭐ Reviews</h1>
        <span style={{color:'#EF4444', fontWeight:500}}>{pending.length} pending approval</span>
      </div>

      {pending.length > 0 && (
        <>
          <h3 style={{color:'#F59E0B', marginBottom:'12px'}}>⏳ Pending Approval ({pending.length})</h3>
          {pending.map(r => (
            <div key={r.id} className="card" style={{marginBottom:'12px', borderLeft:'4px solid #F59E0B'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px'}}>
                    <div style={{width:36, height:36, borderRadius:'50%', background:'#F59E0B', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600}}>
                      {r.customer_name[0]}
                    </div>
                    <div>
                      <strong>{r.customer_name}</strong>
                      <Stars rating={r.rating} />
                    </div>
                  </div>
                  {r.comment && <p style={{color:'#374151'}}>{r.comment}</p>}
                  <small style={{color:'#9CA3AF'}}>{r.created_at}</small>
                </div>
                <div style={{display:'flex', gap:'8px'}}>
                  <button className="btn btn-success btn-sm" onClick={() => toggle(r.id)}>✅ Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => del(r.id)}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <h3 style={{color:'#10B981', margin:'24px 0 12px'}}>✅ Approved Reviews ({approved.length})</h3>
      {approved.map(r => (
        <div key={r.id} className="card" style={{marginBottom:'12px', borderLeft:'4px solid #10B981'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
            <div>
              <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px'}}>
                <div style={{width:36, height:36, borderRadius:'50%', background:'var(--maroon)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600}}>
                  {r.customer_name[0]}
                </div>
                <div>
                  <strong>{r.customer_name}</strong>
                  <Stars rating={r.rating} />
                </div>
                <small style={{color:'#9CA3AF'}}>{r.created_at}</small>
              </div>
              {r.comment && <p style={{color:'#374151', marginLeft:'48px'}}>{r.comment}</p>}
            </div>
            <div style={{display:'flex', gap:'8px'}}>
              <button className="btn btn-secondary btn-sm" onClick={() => toggle(r.id)}>🚫 Unapprove</button>
              <button className="btn btn-danger btn-sm" onClick={() => del(r.id)}>🗑️</button>
            </div>
          </div>
        </div>
      ))}
      {reviews.length === 0 && <p style={{textAlign:'center', padding:'32px', color:'#999'}}>Reviews இல்லை</p>}
    </div>
  );
}
