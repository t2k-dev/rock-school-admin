import apiClient from "./apiClient";

export const getStudents = async () => {
  try {
    const response = await apiClient.get('/student');
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getStudent = async (id) => {
    try {
      const response = await apiClient.get('/student/' + id);
      return response;
    } 
    catch (error) {
      console.error('Error fetching data:', error);
    }
};

export const postStudent = async (data) =>{
  const res = await apiClient.post('/students', data);
  return res;
}

export const getStudentScreenDetails = async (id) => {
  try {
    const response = await apiClient.get('/student/getStudentScreenDetails/' + id);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const addStudent = async (data) =>{
    const response = await apiClient.post('/student/addStudent', data)
    return response;
}

export const saveStudent = async (id, data) =>{
  const response = await apiClient.put('/student/' + id, data);
  return response;
}


