import apiClient from './apiClient';

export const login = async (loginData) => {
  try {
    const response = await apiClient.post('/Account/login', {
      login: loginData.login,
      password: loginData.password
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (userName) => {
  try {
    const response = await apiClient.post('/Account/logout', JSON.stringify(userName));
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};