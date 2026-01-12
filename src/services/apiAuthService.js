import apiClient from './apiClient';

export const login = async (loginData) => {
  try {
    const response = await apiClient.post('/Auth/login', {
      login: loginData.login,
      password: loginData.password
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/Auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};