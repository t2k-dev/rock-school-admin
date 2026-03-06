import apiClient from "./apiClient";

export const addBand = async (data) => {
  const result = await apiClient.post('/band', data);
  return result;
}

export const saveBand = async (id, data) => {
  const result = await apiClient.put('/band/' + id, data);
  return result;
}

export const getBand = async (id) => {
  try {
    const response = await apiClient.get('/band/' + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getBands = async () => {
  try {
    const response = await apiClient.get('/band');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getBandScreenDetails = async (id) => {
  try {
    const response = await apiClient.get(`/band/${id}/screen-details`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const deactivateBand = async (id) => {
  const result = await apiClient.post(`/band/${id}/deactivate`);
  return result;
}

export const activateBand = async (id) => {
  const result = await apiClient.post(`/band/${id}/activate`);
  return result;
}

export const addBandStudent = async (bandId, data) => {
  const result = await apiClient.post(`/band/${bandId}/students`, data);
  return result;
}

export const removeBandStudent = async (bandId, bandStudentId) => {
  const result = await apiClient.delete(`/band/${bandId}/students/${bandStudentId}`);
  return result;
}

export const updateBandStudentRole = async (bandId, bandStudentId, roleId) => {
  const result = await apiClient.put(`/band/${bandId}/students/${bandStudentId}/role`, { roleId });
  return result;
}