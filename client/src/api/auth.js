
const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Helper
const headers = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// 🔹 Register
export const registerUser = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(formData),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Login (sets refresh cookie)
export const loginUser = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(formData),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Forgot Password
export const forgotPassword = async (email) => {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Reset Password
export const resetPassword = async ({ token, password, confirmPassword }) => {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ token, password, confirmPassword }),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Google Login (sends ID token from Google to backend)
export const googleLogin = async (idToken) => {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ token: idToken }),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Profile
export const getProfile = async (token) => {
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: "GET",
    headers: headers(token),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Refresh access token (uses refresh cookie)
export const refreshAccessToken = async () => {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

// 🔹 Logout
export const logoutUser = async () => {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

// 🔹 Update Profile
export const updateProfile = async (token, profileData) => {
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: "PUT",
    headers: headers(token),
    credentials: "include",
    body: JSON.stringify(profileData),
  });
  return res.json();
};

// 🔹 Upload Avatar
export const uploadAvatar = async (token, formData) => {
  const res = await fetch(`${API_BASE}/users/profile/passport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
    body: formData,
  });
  return res.json();
};

// 🔹 Delete Avatar
export const deleteAvatar = async (token) => {
  const res = await fetch(`${API_BASE}/users/profile/passport`, {
    method: "DELETE",
    headers: headers(token),
    credentials: "include",
  });
  return res.json();
};
