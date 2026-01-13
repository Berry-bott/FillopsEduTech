// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// // Helper
// const headers = (token) => ({
//   "Content-Type": "application/json",
//   ...(token ? { Authorization: `Bearer ${token}` } : {}),
// });


// // 🔹 Login (sets refresh cookie)
// export const tutorLogin = async (formData) => {
//   const res = await fetch(`${API_BASE}/auth/tutor/login`, {
//     method: "POST",
//     headers: headers(),
//     body: JSON.stringify(formData),
//     credentials: "include",
//   });
//   return res.json();
// };

// // 🔹 Profile
// export const getProfile = async (token) => {
//   const res = await fetch(`${API_BASE}/tutor/profile`, {
//     method: "GET",
//     headers: headers(token),
//     credentials: "include",
//   });
//   return res.json();
// };

// // 🔹 Refresh access token (uses refresh cookie)
// export const refreshAccessToken = async () => {
//   const res = await fetch(`${API_BASE}/auth/refresh`, {
//     method: "POST",
//     credentials: "include",
//   });
//   return res.json();
// };

// // 🔹 Logout
// export const tutorLogout = async () => {
//   const res = await fetch(`${API_BASE}/auth/logout`, {
//     method: "POST",
//     credentials: "include",
//   });
//   return res.json();
// };





const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// Helper
const headers = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// 🔹 Login (sets refresh cookie)
export const tutorLogin = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/tutor/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(formData),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Get Profile
export const getProfile = async (token) => {
  const res = await fetch(`${API_BASE}/tutor/profile`, {
    method: "GET",
    headers: headers(token),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Update Profile
export const updateProfile = async (token, profileData) => {
  const res = await fetch(`${API_BASE}/tutor/profile`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(profileData),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Change Password
export const changePassword = async (token, passwordData) => {
  const res = await fetch(`${API_BASE}/tutor/change-password`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(passwordData),
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
export const tutorLogout = async () => {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};