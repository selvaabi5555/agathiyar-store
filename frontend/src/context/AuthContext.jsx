import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      axios.get(`${API}/verify`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => setIsAdmin(true))
        .catch(() => { localStorage.removeItem('admin_token'); setIsAdmin(false); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await axios.post(`${API}/login`, { username, password });
    localStorage.setItem('admin_token', res.data.token);
    setIsAdmin(true);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  const getToken = () => localStorage.getItem('admin_token');

  const authAxios = axios.create({ baseURL: API });
  authAxios.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading, authAxios, API }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
