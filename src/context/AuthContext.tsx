import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (role: UserRole, approverLevel?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('plap_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('plap_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('plap_user');
    }
  }, [currentUser]);

  const login = (role: UserRole, approverLevel?: string) => {
    let user: User | undefined;
    if (role === 'approver' && approverLevel) {
      user = MOCK_USERS.find(u => u.role === role && u.approverLevel === approverLevel && u.isActive);
    } else {
      user = MOCK_USERS.find(u => u.role === role && u.isActive);
    }
    if (user) setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
