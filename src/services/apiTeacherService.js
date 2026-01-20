import apiClient from "./apiClient";

export const addTeacher = async (data) =>{
  const result = await apiClient.post('/teacher', data);
  return result;
}

export const saveTeacher = async (id, data) =>{
  const result = await apiClient.put('/teacher/'+ id, data);
  return result;
}

export const deactivateTeacher = async (id) =>{
  const result = await apiClient.post(`/teacher/${id}/deactivate`);
  return result;
}

export const activateTeacher = async (id) =>{
  const result = await apiClient.post(`/teacher/${id}/activate`);
  return result;
}

export const getTeacher = async (id) => {
  try {
    const response = await apiClient.get('/teacher/' + id);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getTeachers = async () => {
  try {
    const response = await apiClient.get('/teacher');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getTeacherScreenDetails = async (id) => {
  try {
    const response = await apiClient.get(`/teacher/${id}/screen-details`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getAvailableTeachers = async (disciplineId, age, branchId) =>{
  const response = await apiClient.get(`/teacher/available?disciplineId=${disciplineId}&age=${age}&branchId=${branchId}`);
  return response;
}

export const getRehearsableTeachers = async (branchId) =>{
  const response = await apiClient.get(`/teacher/rehearsable?branchId=${branchId}`);
  return response.data;
}

export const getWorkingPeriods = async (id) =>{
  const response = await apiClient.get(`/teacher/${id}/workingPeriods`);
  return response;
}