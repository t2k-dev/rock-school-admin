import apiClient from "./apiClient";

export const getAttendance = async (id) => {
  try {
    const response = await apiClient.get(`/attendance/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
