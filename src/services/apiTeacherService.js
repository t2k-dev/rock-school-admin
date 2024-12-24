import apiClient from "./apiClient";

// Teachers
export const getTeachers = async () => {
  try {
    const response = await apiClient.get('/teachers');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


export const getTeacher = async (id) => {
    try {
      const response = await apiClient.get('/teachers/' + id);
      console.log(response.data);
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