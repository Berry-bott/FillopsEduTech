import useAuthStore from "../store/authStore";

export const apiFetch = async (url, options = {}) => {
  return useAuthStore.getState().fetchWithAuth(url, options);
};
