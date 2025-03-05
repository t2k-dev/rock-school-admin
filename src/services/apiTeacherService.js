import apiClient from "./apiClient";

export const addTeacher = async (data) =>{
  const result = await apiClient.post('/teacher', data);
  return result;
}

export const saveTeacher = async (id, data) =>{
  const result = await apiClient.put('/teacher/'+ id, data);
  return result;
}

export const getTeacher = async (id) => {
  try {
    const response = await apiClient.get('/teacher/' + id);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getTeachers = async () => {
  try {
    const response = await apiClient.get('/teacher');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getTeacherScreenDetails = async (id) => {
  try {
    const response = await apiClient.get('/teacher/getTeacherScreenDetails/' + id);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getAvailablePeriods = async (disciplineId, studentId, branchId) =>{
  const response = await apiClient.get('/teacher/getAvailablePeriods?disciplineId='+disciplineId+"&studentId="+studentId+"&branchId="+branchId);
  return response;
}