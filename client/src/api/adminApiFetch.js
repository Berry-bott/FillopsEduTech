import useAdminAuthStore from "../store/adminAuthStore";

export const apiFetch = async (url, options = {}) => {
  return useAdminAuthStore.getState().fetchWithAuth(url, options);
};
