import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import axios from 'axios';

// API base URL - change this to your deployed backend URL when ready
const API_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

interface UpdateProfileData {
  name: string;
  currentPassword?: string;
  newPassword?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Create axios instance
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  useEffect(() => {
    // Check for saved auth data on mount
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      
      // Set auth header for API requests
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Format user data to match our User interface
      const formattedUser: User = {
        id: userData._id,
        email: userData.email,
        name: userData.name
      };
      
      setUser(formattedUser);
      setToken(token);
      
      // Save auth data to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(formattedUser));
      
      // Set auth header for future API requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Invalid credentials");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Format user data to match our User interface
      const formattedUser: User = {
        id: userData._id,
        email: userData.email,
        name: userData.name
      };
      
      setUser(formattedUser);
      setToken(token);
      
      // Save auth data to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(formattedUser));
      
      // Set auth header for future API requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || "Failed to create account";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setLoading(true);
      
      // Set auth header for the request
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await api.put('/auth/profile', data);
      
      const { user: userData } = response.data;
      
      // Update the user state with new data
      if (user) {
        const updatedUser: User = {
          ...user,
          name: userData.name
        };
        
        setUser(updatedUser);
        
        // Update user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Remove auth data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
    
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        token,
        loading, 
        login, 
        signup, 
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
