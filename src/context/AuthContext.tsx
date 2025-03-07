import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'COMPANY';
  profile?: {
    fullName: string;
    bio?: string;
    avatar?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading?: boolean; // Add this line to make the property optional
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to extract user from various response formats
  const extractUserFromResponse = (response: any) => {
    if (!response || !response.success) return null;
    
    // Try different paths to find user data
    return response.data?.user || response.user || response.data;
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Always log to help with debugging
      console.log('Checking authentication status');
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        setUser(null);
        setLoading(false);
        return false;
      }
      
      console.log('Token found, fetching user profile');
      
      try {
        const response = await authApi.me();
        
        if (response.success) {
          console.log('User profile fetched successfully');
          
          // Use the helper to extract user data
          const userData = extractUserFromResponse(response);
          
          if (userData) {
            console.log('User authenticated:', userData.email);
            setUser(userData);
            setLoading(false);
            return true;
          }
        }
      } catch (meError) {
        console.error('Error fetching user profile:', meError);
        // Continue to token refresh
      }
      
      // If we get here, try to refresh the token
      console.log('Attempting token refresh');
      try {
        const refreshResponse = await authApi.refresh();
        
        if (refreshResponse.success) {
          console.log('Token refreshed successfully');
          
          // Use the helper to extract user data
          const refreshedUserData = extractUserFromResponse(refreshResponse);
          
          if (refreshedUserData) {
            console.log('User re-authenticated after token refresh');
            setUser(refreshedUserData);
            setLoading(false);
            return true;
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Token refresh failed, clear token
        localStorage.removeItem('token');
      }
      
      // If we reach here, authentication failed
      console.log('Authentication failed');
      setUser(null);
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure we don't have an infinite loop if auth check fails
    let isMounted = true;
    
    const doAuthCheck = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Error in authentication check:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    doAuthCheck();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        // Use helper to extract user data from response
        const userData = extractUserFromResponse(response);
        
        if (userData) {
          setUser(userData);
          toast.success('Login successful');
          
          // Redirect based on user role
          switch (userData.role) {
            case 'ADMIN':
              navigate('/admin');
              break;
            case 'COMPANY':
              navigate('/company/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        } else {
          console.error('User data not found in login response:', response);
          throw new Error('Invalid user data received from server');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; role?: string }) => {
    try {
      setLoading(true);
      const response = await authApi.register(data);
      
      if (response.success) {
        // Use helper to extract user data
        const userData = extractUserFromResponse(response);
        
        if (userData) {
          setUser(userData);
          toast.success('Registration successful');
          
          // Redirect based on user role
          switch (userData.role) {
            case 'ADMIN':
              navigate('/admin');
              break;
            case 'COMPANY':
              navigate('/company/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        } else {
          throw new Error('Invalid user data received from server');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await authApi.logout();
      setUser(null);
      
      if (response.success) {
        toast.success('Logged out successfully');
      }
      
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Error logging out');
      // Still clear user data even if the server request fails
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isLoading: loading, // Add this line
      login, 
      register, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
