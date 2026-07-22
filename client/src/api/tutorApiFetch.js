import useTutorAuthStore from "../store/tutorAuthStore";

export const apiFetch = async (url, options = {}) => {
  return useTutorAuthStore.getState().fetchWithAuth(url, options);
};
