// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  authToken: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  CustomersignUp: (name:string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  VendorsignUp:(name:string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  authToken: null,
  signIn: async () => ({ success: false }),
  CustomersignUp: async () => ({ success: false }),
  VendorsignUp: async () => ({ success: false }),
  signOut: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Replace with your backend sign-in endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign in');
      }

      const data = await response.json();
      const token = data.accessToken; // Adjust based on your backend response
      setAuthToken(token);
      localStorage.setItem('authToken', token);
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, message: error.message };
    }
  };

  const CustomersignUp = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('https://your-backend.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }), // Added name here
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }
  
      const data = await response.json();
      const token = data.accessToken;
      setAuthToken(token);
      localStorage.setItem('authToken', token);
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, message: error.message };
    }
  };
  
  const VendorsignUp = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('https://your-backend.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }), // Added name here
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }
  
      const data = await response.json();
      const token = data.accessToken;
      setAuthToken(token);
      localStorage.setItem('authToken', token);
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, message: error.message };
    }
  };
  

  const signOut = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ authToken, signIn, CustomersignUp, VendorsignUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
