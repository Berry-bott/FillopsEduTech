import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const API_BASE = "https://fillops-server.onrender.com/api";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();

  const [form, setForm] = useState({
    phoneNumber: "",
    dateOfBirth: "",
    state: "",
    lga: "",
    residentialAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/users/complete-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      await fetchUser(); // refresh store
      setMessage("✅ Profile completed successfully!");
      setTimeout(() => navigate("/user/dashboard"), 1500);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Complete Your Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 text-sm">
          Please fill in the remaining details to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+2348012345678"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Lagos"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LGA</label>
            <input
              name="lga"
              value={form.lga}
              onChange={handleChange}
              placeholder="Ikeja"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Residential Address</label>
            <textarea
              name="residentialAddress"
              value={form.residentialAddress}
              onChange={handleChange}
              placeholder="123 Street, Lagos"
              rows="2"
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>

          {message && <p className="text-center text-sm mt-3">{message}</p>}
        </form>
      </div>
    </div>
  );
}
