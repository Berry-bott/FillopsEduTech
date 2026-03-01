const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// Helper
const headers = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// 🔹 Login Admin (sets refresh cookie)
export const loginAdmin = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/admin/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(formData),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Refresh admin access token (uses same refresh endpoint as user)
export const refreshAdminAccessToken = async () => {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};