import apiClient from "./apiClient";

export const getNextAvailableSlot = async (id) =>{
  const response = await apiClient.get(`/subscription/${id}/getNextAvailableSlot`);
  return response;
}

export const addSubscription = async (data) =>{
  const result = await apiClient.post('/subscription', data);
  return result;
}

export const addTrialSubscription = async (data) =>{
  const result = await apiClient.post('/subscription/addTrial', data);
  return result;
}

export const addTrialSubscription2 = async (data) =>{
  const result = await apiClient.post('/subscription/addTrial2', data);
  return result;
}

export const rescheduleAttendance = async (data) =>{
  const result = await apiClient.post('/subscription/rescheduleAttendance', data);
  return result;
}

