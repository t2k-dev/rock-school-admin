import apiClient from './apiClient';

export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post('/account/changePassword', {
      email: passwordData.email,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/account/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/account/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};