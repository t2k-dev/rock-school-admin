import apiClient from "./apiClient";

export const createTariff = async (tariffData) => {
  try {
    const response = await apiClient.post('/tariff', tariffData);
    return response.data;
  } catch (error) {
    console.error('Error creating tariff:', error);
    throw error;
  }
};

export const getTariff = async (id) => {
  try {
    const response = await apiClient.get(`/tariff/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tariff:', error);
    throw error;
  }
};

export const getTariffs = async () => {
  try {
    const response = await apiClient.get('/tariff');
    return response.data;
  } catch (error) {
    console.error('Error fetching tariffs:', error);
    throw error;
  }
};

export const updateTariff = async (id, tariffData) => {
  try {
    const response = await apiClient.put(`/tariff/${id}`, tariffData);
    return response.data;
  } catch (error) {
    console.error('Error updating tariff:', error);
    throw error;
  }
};

export const deleteTariff = async (id) => {
  try {
    const response = await apiClient.delete(`/tariff/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tariff:', error);
    throw error;
  }
};