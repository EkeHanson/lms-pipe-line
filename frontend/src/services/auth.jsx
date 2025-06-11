// src/services/auth.js
import { authAPI } from '../config';
import axios from 'axios';

export const login = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });

    console.log("response")
    console.log(response)
    console.log("response")
    
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Get and store user profile
      const profileResponse = await getProfile();
      localStorage.setItem('user', JSON.stringify(profileResponse.data));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  authAPI.logout().then(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  });
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
      refresh: localStorage.getItem('refreshToken')
    });
    
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  return authAPI.getCurrentUser();
};

// Optional: You can still provide a default export that contains all methods
const authService = {
  login,
  logout,
  getCurrentUser,
  refreshToken,
  register,
  getProfile
};

export { authAPI };
export default authService;

