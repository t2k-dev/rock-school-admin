import apiClient from "./apiClient";

export const getStudent = async (id) => {
    try {
      const response = await apiClient.get('/students/' + id);
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

export const postStudent = async (data) =>{
  const res = await apiClient.post('/students', data);
  return res;
}

export const registerStudent = async (data) =>{
    const res = await apiClient.post('/account/registerStudent', data)
    return res;
}

