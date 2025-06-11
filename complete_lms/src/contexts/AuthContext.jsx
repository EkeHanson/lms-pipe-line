import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { authAPI } from '../services/auth';
import { QA_ROLES } from '../constants/qaRoles';

// Create context
const AuthContext = createContext();

// Main provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced user data transformation
  const transformUserData = (userData) => {
    return {
      ...userData,
      role: userData.role || 'TRAINER',
      qaStats: {
        lastSampled: userData.lastSampled || null,
        complianceScore: userData.complianceScore || 0,
        completedTrainings: userData.completedTrainings || []
      },
      permissions: QA_ROLES[userData.role]?.permissions || []
    };
  };

  // Fetch user data
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authAPI.getCurrentUser();
      
      if (!response.data) {
        throw new Error('No user data returned');
      }

      setUser(transformUserData(response.data));
      setError(null);
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await authAPI.refreshToken(refreshToken);
          await fetchUser();
        } else {
          setLoading(false);
        }
      } catch (err) {
        localStorage.removeItem('refreshToken');
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchUser]);

  // Login handler
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (!response.data?.access) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh || '');
      await fetchUser();
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  // Permission check
  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions.includes('*') || user.permissions.includes(permission);
  };

  // Get dashboard route based on role
  const getDashboardRoute = () => {
    return QA_ROLES[user?.role]?.dashboard || '/dashboard';
  };

  // Update user profile
  const updateUser = async (updates) => {
    try {
      const response = await authAPI.updateUser({
        ...updates,
        userId: user.id
      });

      setUser(prev => ({
        ...prev,
        ...response.data,
        qaStats: {
          ...prev.qaStats,
          ...response.data.qaStats
        }
      }));
    } catch (err) {
      console.error('Update failed:', err);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    hasPermission,
    getDashboardRoute,
    refetchUser: fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Base auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Add this export at the bottom:
export const useQAAuth = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    isIQALead: auth.hasPermission('sample_work'),
    isEQAAuditor: auth.hasPermission('manage_evidence'),
    canViewReports: auth.hasPermission('view_reports')
  };
};