import { useAuth } from '../../context/AuthContext';

export default function ReportsPage() {
  const { authAxios } = useAuth();

  const downloadExcel = () => {
    const token = localStorage.getItem('admin_token');
    window.open(`http://localhost:5000/api/reports/excel`, '_blank');
    // Use authAxios for proper auth
    authAxios.get('/reports/excel', { responseType: 'blob' }).then(res => {
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = 'Sales-Report.xlsx'; a.click();
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📈 Reports</h1>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px'}}>
        <div className="card" style={{textAlign:'center', borderTop:'4px solid #10B981'}}>
          <div style={{fontSize:'3rem', marginBottom:'16px'}}>📊</div>
          <h3 style={{marginBottom:'8px', color:'#10B981'}}>Excel Report</h3>
          <p style={{color:'#6B7280', marginBottom:'20px', fontSize:'0.9rem'}}>
            எல்லா Sales data-வும் Excel-ல் export ஆகும். Customer, Bill, Amount, Payment எல்லாம் இருக்கும்.
          </p>
          <button className="btn btn-success" style={{width:'100%'}} onClick={downloadExcel}>
            📥 Download Excel (.xlsx)
          </button>
        </div>

        <div className="card" style={{textAlign:'center', borderTop:'4px solid var(--maroon)', opacity:0.7}}>
          <div style={{fontSize:'3rem', marginBottom:'16px'}}>📄</div>
          <h3 style={{marginBottom:'8px', color:'var(--maroon)'}}>Individual Bill PDF</h3>
          <p style={{color:'#6B7280', marginBottom:'20px', fontSize:'0.9rem'}}>
            Billing → History page-ல் போய் எந்த bill-வேணும்னாலும் PDF download பண்ணலாம்.
          </p>
          <a href="/admin/billing" className="btn btn-secondary" style={{width:'100%', display:'block', textDecoration:'none', textAlign:'center'}}>
            🧾 Billing Page-க்கு போ
          </a>
        </div>
      </div>
    </div>
  );
}
