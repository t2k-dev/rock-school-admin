import apiClient from "./apiClient";

export const addStudent = async (data) =>{
  const response = await apiClient.post('/student', data)
  return response;
}

export const saveStudent = async (id, data) =>{
  const response = await apiClient.put('/student/' + id, data);
  return response;
}

export const getStudent = async (id) => {
  try {
    const response = await apiClient.get('/student/' + id);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getStudents = async () => {
  try {
    const response = await apiClient.get('/student');
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getStudentScreenDetails = async (id) => {
  try {
    const response = await apiClient.get(`/student/${id}/screen-details`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};