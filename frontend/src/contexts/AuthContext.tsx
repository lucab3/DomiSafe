'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  user_type: 'client' | 'employee';
  is_admin?: boolean;
  is_active: boolean;
  phone?: string;
  photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  user_type: 'client' | 'employee';
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        
        toast.success(data.message || 'Inicio de sesión exitoso');

        if (data.user.is_admin) {
          router.push('/admin/dashboard');
        } else if (data.user.user_type === 'client') {
          router.push('/client/dashboard');
        } else if (data.user.user_type === 'employee') {
          router.push('/employee/dashboard');
        }
      } else {
        throw new Error(data.error || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setUser(data.user);
        }
        
        toast.success(data.message || 'Registro exitoso');

        if (userData.user_type === 'employee') {
          router.push('/auth/pending-approval');
        } else {
          router.push('/client/dashboard');
        }
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error: any) => {
            toast.error(error.msg || error.message);
          });
        } else {
          throw new Error(data.error || 'Error al registrarse');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/');
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}