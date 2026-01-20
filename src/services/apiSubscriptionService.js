import apiClient from "./apiClient";

export const getSubscription = async (id) => {
  try {
    const response = await apiClient.get('/subscription/' + id);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getSubscriptionFormData = async (id) => {
  try {
    const response = await apiClient.get(`/subscription/${id}/form-data`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getSubscriptionScreenData = async (id) => {
  try {
    const response = await apiClient.get(`/subscription/${id}/screen-data`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

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

export const updateSubscription = async (data) =>{
  const result = await apiClient.put('/subscription', data);
  return result;
}

export const updateSubscriptionSchedules = async (id, data) =>{
  const result = await apiClient.put(`/subscription/${id}/schedules`, data);
  return result;
}

export const rescheduleAttendance = async (data) =>{
  const result = await apiClient.post('/subscription/rescheduleAttendance', data);
  return result;
}

export const pay = async (id, data) =>{
  const result = await apiClient.post(`/subscription/${id}/pay`, data);
  return result;
}

export const cancelSubscription = async (id, data) =>{
  const result = await apiClient.put(`/subscription/${id}/cancel`, data);
  return result;
}