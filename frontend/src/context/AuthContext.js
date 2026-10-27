
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        setCurrentUserState(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const setCurrentUser = (user) => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    setCurrentUserState(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
