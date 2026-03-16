import apiClient from "./apiClient";

const CONTROLLER = "branch";

export const getBusySlots = async (id) => {
    const response = await apiClient.get(`/${CONTROLLER}/${id}/busy-slots`);
    return response.data;
};

export const getActiveBands = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/${id}/active-bands`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};