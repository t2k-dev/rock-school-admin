import apiClient from "./apiClient";

const CONTROLLER = "subscriptions"

export const getSubscription = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/${id}`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getSubscriptionFormData = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/${id}/form-data`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getSubscriptionScreenData = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/${id}/screen-data`);
    return response.data;
  } 
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getNextAvailableSlot = async (id) =>{
  const response = await apiClient.get(`/${CONTROLLER}/${id}/getNextAvailableSlot`);
  return response;
}

export const addSubscription = async (data) =>{
  const result = await apiClient.post(`/${CONTROLLER}`, data);
  return result;
}

export const addTrialSubscription = async (data) =>{
  const result = await apiClient.post(`/${CONTROLLER}/addTrial`, data);
  return result;
}

export const addRehearsalSubscription = async (data) =>{
  const result = await apiClient.post(`/${CONTROLLER}/addRehearsal`, data);
  return result;
}

export const updateSubscription = async (data) =>{
  const result = await apiClient.put(`/${CONTROLLER}`, data);
  return result;
}

export const updateSubscriptionSchedules = async (id, data) =>{
  const result = await apiClient.put(`/${CONTROLLER}/${id}/schedules`, data);
  return result;
}

export const rescheduleAttendance = async (data) =>{
  const result = await apiClient.post(`/${CONTROLLER}/rescheduleAttendance`, data);
  return result;
}

export const pay = async (id, data) =>{
  const result = await apiClient.post(`/${CONTROLLER}/${id}/pay`, data);
  return result;
}

export const cancelSubscription = async (id, data) =>{
  const result = await apiClient.put(`/${CONTROLLER}/${id}/cancel`, data);
  return result;
}