import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useSnackbar } from 'notistack';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleAuthSuccess = (userData, token) => {
    const userInfo = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'customer',
      avatar: userData.avatar,
    };
    
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', token);
    setAuthError(null);
    
    return userInfo;
  };

  const handleAuthError = (error) => {
    console.error('Auth error:', error);
    const errorMessage = error?.response?.data?.message || error.message || 'Authentication failed';
    setAuthError(errorMessage);
    enqueueSnackbar(errorMessage, { variant: 'error' });
    throw error;
  };

  const login = useCallback(async (credentials) => {
    try {
      console.log('Logging in with:', credentials);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: credentials.email,
        role: 'customer',
      };
      
      const mockToken = 'mock-jwt-token';
      return handleAuthSuccess(mockUser, mockToken);
    } catch (error) {
      return handleAuthError(error);
    }
  }, [handleAuthError]);

  const register = useCallback(async (userData) => {
    try {
      console.log('Registering user:', userData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: 'new-user-' + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: 'customer',
      };
      
      const mockToken = 'mock-jwt-token';
      return handleAuthSuccess(mockUser, mockToken);
    } catch (error) {
      return handleAuthError(error);
    }
  }, [handleAuthError]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    enqueueSnackbar('You have been logged out', { variant: 'info' });
    return '/login'; 
  }, [enqueueSnackbar]);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  const contextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    authError,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
