// import useTutorAuthStore from "../store/tutorAuthStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// // Helper for Authorization headers
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

// // 🔹 Get Profile (always fetch full data from backend)
// export const getProfile = async () => {
//   try {
//     const res = await useTutorAuthStore.getState().fetchWithAuth(
//       `${API_BASE}/tutor/profile`
//     );
//     console.log("📌 getProfile result:", res);
//     return res;
//   } catch (err) {
//     console.error("❌ getProfile error:", err);
//     return { success: false, message: err.message };
//   }
// };

// // 🔹 Update Profile
// export const updateProfile = async (profileData) => {
//   return await useTutorAuthStore.getState().fetchWithAuth(
//     `${API_BASE}/tutor/profile`,
//     {
//       method: "PUT",
//       body: JSON.stringify(profileData),
//     }
//   );
// };

// // 🔹 Change Password
// export const changePassword = async (passwordData) => {
//   return await useTutorAuthStore.getState().fetchWithAuth(
//     `${API_BASE}/tutor/change-password`,
//     {
//       method: "PUT",
//       body: JSON.stringify(passwordData),
//     }
//   );
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




import useTutorAuthStore from "../store/tutorAuthStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// 🔹 Login (sets refresh cookie)
export const tutorLogin = async (formData) => {
  const res = await fetch(`${API_BASE}/auth/tutor/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });
  return res.json();
};

// 🔹 Get Profile (always fetch full data from backend)
export const getProfile = async () => {
  try {
    const token = useTutorAuthStore.getState().accessToken;
    
    if (!token) {
      console.warn("⚠️ No access token available for getProfile");
      return { success: false, message: "No access token" };
    }

    const res = await useTutorAuthStore.getState().fetchWithAuth(
      `${API_BASE}/tutor/profile`
    );
    
    console.log("📌 getProfile result:", res);
    return res;
  } catch (err) {
    console.error("❌ getProfile error:", err);
    return { success: false, message: err.message };
  }
};

// 🔹 Update Profile
export const updateProfile = async (profileData) => {
  try {
    return await useTutorAuthStore.getState().fetchWithAuth(
      `${API_BASE}/tutor/profile`,
      {
        method: "PUT",
        body: JSON.stringify(profileData),
      }
    );
  } catch (err) {
    console.error("❌ updateProfile error:", err);
    return { success: false, message: err.message };
  }
};

// 🔹 Change Password
export const changePassword = async (passwordData) => {
  try {
    return await useTutorAuthStore.getState().fetchWithAuth(
      `${API_BASE}/tutor/change-password`,
      {
        method: "PUT",
        body: JSON.stringify(passwordData),
      }
    );
  } catch (err) {
    console.error("❌ changePassword error:", err);
    return { success: false, message: err.message };
  }
};

// 🔹 Refresh access token (uses refresh cookie)
export const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    const data = await res.json();
    console.log("🔄 Refresh token response:", data);
    
    return data;
  } catch (err) {
    console.error("❌ refreshAccessToken error:", err);
    return { success: false, message: err.message };
  }
};

// 🔹 Logout
export const tutorLogout = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return res.json();
  } catch (err) {
    console.error("❌ logout error:", err);
    return { success: false, message: err.message };
  }
};