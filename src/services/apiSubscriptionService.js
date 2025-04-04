import apiClient from "./apiClient";

export const addSubscription = async (data) =>{
  const result = await apiClient.post('/subscription', data);
  return result;
}

export const addTrialSubscription = async (data) =>{
  const result = await apiClient.post('/subscription/addTrial', data);
  return result;
}