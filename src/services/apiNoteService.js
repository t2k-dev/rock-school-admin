import apiClient from "./apiClient";

export const addNote = async (data) =>{
    const res = await apiClient.post('/note', data);
    return res;
  }
