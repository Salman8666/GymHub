'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export type FrontendRole = 'member' | 'trainer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: FrontendRole;
  avatar: string;
  membershipType?: string;
  specialty?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: 'member' | 'trainer') => Promise<boolean>;
  logout: () => void;
}

interface DemoCredential {
  role: 'member' | 'trainer';
  name: string;
  email: string;
  title: string;
  avatar: string;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'member',
    name: 'Alexander Wright',
    email: 'alexander@gymhub.com',
    title: 'Athlete Member',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  },
  {
    role: 'trainer',
    name: 'Marcus Vance',
    email: 'marcus@gymhub.com',
    title: 'IFBB Pro Coach',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=150&q=80',
  },
];

export const DEMO_PASSWORD = 'password123';

function mapBackendUser(backendUser: any): UserProfile {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    role: backendUser.role === 'TRAINER' ? 'trainer' : 'member',
    avatar: backendUser.avatar,
    membershipType: backendUser.membershipType || undefined,
    createdAt: backendUser.createdAt || undefined,
  };
}

function persistSession(user: UserProfile, token: string) {
  localStorage.setItem('gymhub-user', JSON.stringify(user));
  localStorage.setItem('gymhub-auth-token', token);
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Remove legacy plaintext password storage from older sessions
    localStorage.removeItem('gymhub-registered-users');

    const token = localStorage.getItem('gymhub-auth-token');
    if (!token) {
      setUser(null);
      localStorage.removeItem('gymhub-user');
      return;
    }

    apiClient.auth
      .me()
      .then((data) => {
        const mapped = mapBackendUser(data);
        setUser(mapped);
        localStorage.setItem('gymhub-user', JSON.stringify(mapped));
      })
      .catch(() => {
        logout();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await apiClient.auth.login(normalizedEmail, password);
    const mapped = mapBackendUser(res.user);
    persistSession(mapped, res.token);
    setUser(mapped);
    setIsAuthOpen(false);
    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'member' | 'trainer' = 'member'
  ) => {
    const normalizedEmail = email.trim().toLowerCase();
    const backendRole = role === 'trainer' ? 'TRAINER' : 'USER';
    const res = await apiClient.auth.register(name, normalizedEmail, password, backendRole);
    const mapped = mapBackendUser(res.user);
    persistSession(mapped, res.token);
    setUser(mapped);
    setIsAuthOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gymhub-user');
    localStorage.removeItem('gymhub-auth-token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
