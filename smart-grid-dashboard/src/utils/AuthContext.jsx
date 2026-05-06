import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('smartgrid_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, role) => {
    const userData = { username, role, avatar: username.charAt(0).toUpperCase() };
    setUser(userData);
    sessionStorage.setItem('smartgrid_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('smartgrid_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
