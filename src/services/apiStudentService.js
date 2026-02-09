import apiClient from "./apiClient";

const CONTROLLER = "students"

export const addStudent = async (data) =>{
  const response = await apiClient.post(`/${CONTROLLER}`, data)
  return response;
}

export const saveStudent = async (id, data) =>{
  const response = await apiClient.put(`/${CONTROLLER}/` + id, data);
  return response;
}

export const getStudent = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/` + id);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getStudents = async () => {
    const response = await apiClient.get(`/${CONTROLLER}`);
    return response.data;
};

export const getStudentScreenDetails = async (id) => {
    const response = await apiClient.get(`/${CONTROLLER}/${id}/screen-details`);
    return response.data;
};