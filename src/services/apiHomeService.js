import apiClient from "./apiClient";

export const getHomeScreenDetails = async () => {
  try {
    const response = await apiClient.get('/home/getHomeScreenDetails');
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};
