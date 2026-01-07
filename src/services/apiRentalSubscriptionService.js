import apiClient from "./apiClient";

export const addRentalSubscription = async (data) =>{
  const result = await apiClient.post('/rentalSubscription', data);
  return result;
}
