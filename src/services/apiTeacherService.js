import apiClient from "./apiClient";

export const getTeachers = async () => {
  try {
    const response = await apiClient.get('/teacher');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getTeacher = async (id) => {
    try {
      const response = await apiClient.get('/teacher/' + id);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

export const postTeacher = async (data) =>{
  const res = await apiClient.post('/teacher', data)
  return res
}

export const registerTeacher = async (data) =>{
  const res = await apiClient.post('/account/registerTeacher', data)
  return res
}