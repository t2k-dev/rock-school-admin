import apiClient from "./apiClient";

export const getHomeScreenDetails = async (id) => {
  try {
    const response = await apiClient.get('/home/getHomeScreenDetails/'+ id);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};
