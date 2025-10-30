const API_BASE = "https://fillops-server.onrender.com/api/auth";

// ✅ Register user
export const register = async (data) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    // credentials: "include",
  });
  console.log("Register data sent:", data);

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

// ✅ Login user
export const login = async (credentials) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

// ✅ Logout user
export const logout = async () => {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");
  return res.json();
};

// ✅ Get current logged-in user
export const getCurrentUser = async () => {
  const res = await fetch(`${API_BASE}/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
};
