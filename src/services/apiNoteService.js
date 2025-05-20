import apiClient from "./apiClient";

export const addNote = async (data) => {
  const result = await apiClient.post("/note", data);
  return result;
};

export const saveNote = async (id, data) => {
  const result = await apiClient.put(`/note/${id}/edit`, data);
  return result;
};

export const markComplete = async (id) => {
  const result = await apiClient.put(`/note/markComplete/${id}`);
  return result;
};
