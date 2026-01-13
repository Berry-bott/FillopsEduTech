import useTutorAuthStore from "../store/tutorAuthStore";

export const apiFetch = (url, options = {}) => {
  const token = useTutorAuthStore.getState().accessToken;

  return fetch(url, {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
  });
};
