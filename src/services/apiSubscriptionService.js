import apiClient from "./apiClient";

export const addSubscription = async (data) =>{
  const result = await apiClient.post('/subscription', data);
  return result;
}