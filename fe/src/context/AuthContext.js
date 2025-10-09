import { createContext, useContext, useEffect, useState } from 'react';
import { decodeJwt } from '../utils/jwt';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [profile, setProfile] = useState(() => decodeJwt(localStorage.getItem('token')));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setProfile(decodeJwt(token));
    } else {
      localStorage.removeItem('token');
      setProfile(null);
    }
  }, [token]);

  return (
    <AuthCtx.Provider value={{ token, setToken, profile }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
