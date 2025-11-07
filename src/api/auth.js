const API_BASE = "https://fillops-server.onrender.com/api";

// Helper for common request setup
const headers = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// 🟢 Register
export const registerUser = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(formData),
    credentials: "include",
  });
  return res.json();
};

// 🟢 Login
export const loginUser = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(formData),
    credentials: "include",
  });
  return res.json();
};

// 🟢 Get user profile
export const getProfile = async (token) => {
  const res = await fetch(`${API_BASE}/users/dashboard`, {
    headers: headers(token),
    credentials: "include",
  });
  return res;
};

// 🟢 Refresh access token
export const refreshAccessToken = async () => {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

// 🟢 Logout
export const logoutUser = async () => {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};
