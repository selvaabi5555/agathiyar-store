import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ShopHome from './pages/shop/ShopHome';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Billing from './pages/admin/Billing';
import StaffPage from './pages/admin/StaffPage';
import ReviewsAdmin from './pages/admin/ReviewsAdmin';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import './App.css';

function PrivateRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ShopHome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="billing" element={<Billing />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
