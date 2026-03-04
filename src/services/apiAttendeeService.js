import apiClient from "./apiClient";

export const updateAttendeeStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`/attendee/${id}/status/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};