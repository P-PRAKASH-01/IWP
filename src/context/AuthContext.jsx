import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('ssg_admin_auth') === 'true';
  });

  const login = (username, password) => {
    // Demo admin credentials
    if (username === 'admin' && password === 'password123') {
      sessionStorage.setItem('ssg_admin_auth', 'true');
      setIsAdminLoggedIn(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid admin username or password!' };
  };

  const logout = () => {
    sessionStorage.removeItem('ssg_admin_auth');
    setIsAdminLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
