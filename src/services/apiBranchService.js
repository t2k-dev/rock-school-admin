import apiClient from "./apiClient";

export const getBusySlots = async (id) => {
    const response = await apiClient.get(`/branch/${id}/busy-slots`);
    return response.data;
};