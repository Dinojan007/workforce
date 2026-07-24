import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('workforce_token');
    const savedUser = localStorage.getItem('workforce_user');
    const savedPermissions = localStorage.getItem('workforce_permissions');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      if (savedPermissions) setPermissions(JSON.parse(savedPermissions));
    }
    setLoading(false);
  }, []);

  const login = (token, userDetails, permissionDetails) => {
    localStorage.setItem('workforce_token', token);
    localStorage.setItem('workforce_user', JSON.stringify(userDetails));
    localStorage.setItem('workforce_permissions', JSON.stringify(permissionDetails));
    setUser(userDetails);
    setPermissions(permissionDetails);
  };

  const logout = () => {
    localStorage.removeItem('workforce_token');
    localStorage.removeItem('workforce_user');
    localStorage.removeItem('workforce_permissions');
    setUser(null);
    setPermissions(null);
  };

  const isJobSeeker = () => permissions?.is_job_seeker === true;
  const isClient = () => permissions?.is_client === true;
  const isContractor = () => permissions?.is_contractor === true;

  return (
    <AuthContext.Provider value={{ user, permissions, loading, login, logout, isJobSeeker, isClient, isContractor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
