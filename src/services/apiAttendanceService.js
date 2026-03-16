import apiClient from "./apiClient";

const CONTROLLER = "attendance"

export const getAttendance = async (id) => {
  try {
    const response = await apiClient.get(`/${CONTROLLER}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const rescheduleAttendance = async (id, data) =>{
  const result = await apiClient.post(`/${CONTROLLER}/${id}/reschedule`, data);
  return result;
}

export const updateAttendeeStatus = async (id, data) => {
  try {
    const response = await apiClient.put(`/${CONTROLLER}/${id}/submitAttendee`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const acceptTrial = async (id, data) => {
    const response = await apiClient.post(`/${CONTROLLER}/${id}/acceptTrial`, data);
    return response.data;
}

export const declineTrial = async (id, data) => {
  try {
    const response = await apiClient.post(`/${CONTROLLER}/${id}/declineTrial`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const missedTrial = async (id, data) => {
  try {
    const response = await apiClient.post(`/${CONTROLLER}/${id}/missedTrial`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};