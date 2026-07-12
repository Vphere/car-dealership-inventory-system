import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axiosInstance';
import { tokenStore } from '../utils/tokenStore';
import { AuthContext } from './authContextInstance';

function userFromToken(token) {
  const decoded = jwtDecode(token);
  return { email: decoded.sub, role: decoded.role, name: decoded.name || null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (token) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(userFromToken(token));
      } catch {
        // Malformed/expired token left over from a previous session.
        tokenStore.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    tokenStore.set(data.token);
    setUser({ email: data.email, role: data.role, name: data.name || null });
  };

  const register = async (name, email, password) => {
    const { data } = await axiosInstance.post('/auth/register', { name, email, password });
    tokenStore.set(data.token);
    setUser({ email: data.email, role: data.role, name: data.name || null });
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
