import apiClient from "./apiClient";

export const getAttendance = async (id) => {
  try {
    const response = await apiClient.get(`/attendance/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const updateStatus = async (id, status) => {
  try {
    const response = await apiClient.post(`/attendance/${id}/updateStatus/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const acceptTrial = async (id, data) => {
  try {
    const response = await apiClient.post(`/attendance/${id}/acceptTrial`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export const declineTrial = async (id, data) => {
  try {
    const response = await apiClient.post(`/attendance/${id}/declineTrial`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const attend = async (id, data) => {
  try {
    const response = await apiClient.post(`/attendance/${id}/attend`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const missed = async (id, data) => {
  try {
    const response = await apiClient.post(`/attendance/${id}/missed`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

