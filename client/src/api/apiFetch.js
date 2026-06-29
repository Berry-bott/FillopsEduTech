import useAuthStore from "../store/authStore";

export const apiFetch = (url, options = {}) => {
  const token = useAuthStore.getState().accessToken;

  return fetch(url, {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
  });
};
