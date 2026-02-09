import apiClient from "./apiClient";

const CONTROLLER = "teachers"

export const getTeacher = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/` + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getTeachers = async () => {
    const response = await apiClient.get(`/${CONTROLLER}`);
    return response.data;
};

export const getTeacherScreenDetails = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/${id}/screen-details`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getAvailableTeachers = async (disciplineId, age, branchId) =>{
  const response = await apiClient.get(`/${CONTROLLER}/available?disciplineId=${disciplineId}&age=${age}&branchId=${branchId}`);
  return response;
}

export const getRehearsableTeachers = async (branchId) =>{
  const response = await apiClient.get(`/${CONTROLLER}/rehearsable?branchId=${branchId}`);
  return response.data;
}

export const getWorkingPeriods = async (id) =>{
  const response = await apiClient.get(`/${CONTROLLER}/${id}/workingPeriods`);
  return response;
}

export const addTeacher = async (data) =>{
  const result = await apiClient.post(`/${CONTROLLER}`, data);
  return result;
}

export const saveTeacher = async (id, data) =>{
  const result = await apiClient.put(`/${CONTROLLER}/`+ id, data);
  return result;
}

export const deactivateTeacher = async (id) =>{
  const result = await apiClient.post(`/${CONTROLLER}/${id}/deactivate`);
  return result;
}

export const activateTeacher = async (id) =>{
  const result = await apiClient.post(`/${CONTROLLER}/${id}/activate`);
  return result;
}

export const saveWorkingPeriods = async (id, workingPeriods) =>{
  const result = await apiClient.put(`/${CONTROLLER}/${id}/workingPeriods`, { workingPeriods });
  return result;
}
