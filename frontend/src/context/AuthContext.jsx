import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext(null);

// Convenience hook so components can do: const { admin, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); 

  // On app load, if a token exists, verify it and fetch admin profile
  const loadAdmin = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
    setLoading(false);
    return;
    }

    try {
    const { data } = await axiosInstance.get('/auth/me');
    setAdmin(data.data);
    } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
    } finally {
    setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    const { token, ...adminData } = data.data;

    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin(adminData);

    return adminData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};