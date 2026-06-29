import useAdminAuthStore from "../store/adminAuthStore";

export const apiFetch = (url, options = {}) => {
  const token = useAdminAuthStore.getState().accessToken;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
  });
};