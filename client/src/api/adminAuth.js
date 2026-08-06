const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

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

// 🔹 Refresh admin access token (uses refresh cookie for admin role)
export const refreshAdminAccessToken = async () => {
  const res = await fetch(`${API_BASE}/auth/refresh?role=admin`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};
