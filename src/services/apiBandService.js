import apiClient from "./apiClient";

const CONTROLLER = "band";

export const addBand = async (data) => {
  const result = await apiClient.post(`/${CONTROLLER}`, data);
  return result;
}

export const saveBand = async (id, data) => {
  const result = await apiClient.put(`/${CONTROLLER}/` + id, data);
  return result;
}

export const getBand = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/` + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getBands = async () => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getBandScreenDetails = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/${id}/screen-details`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getBandFormData = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/${id}/form-data`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const deactivateBand = async (id) => {
  const result = await apiClient.put(`/${CONTROLLER}/${id}/deactivate`);
  return result;
}

export const activateBand = async (id) => {
  const result = await apiClient.put(`/${CONTROLLER}/${id}/activate`);
  return result;
}

export const addBandMember = async (bandId, data) => {
  const result = await apiClient.post(`/${CONTROLLER}/${bandId}/add-member`, data);
  return result;
}

export const removeBandStudent = async (bandId, bandStudentId) => {
  const result = await apiClient.delete(`/${CONTROLLER}/${bandId}/students/${bandStudentId}`);
  return result;
}

export const updateBandStudentRole = async (bandId, bandStudentId, roleId) => {
  const result = await apiClient.put(`/${CONTROLLER}/${bandId}/students/${bandStudentId}/role`, { roleId });
  return result;
}

export const generateAttendances = async (bandId) => {
  const result = await apiClient.post(`/${CONTROLLER}/${bandId}/generate-attendances`);
  return result;
}

export const updateBandSchedules = async (bandId, schedules) => {
  const result = await apiClient.put(`/${CONTROLLER}/${bandId}/schedules`, schedules);
  return result;
}