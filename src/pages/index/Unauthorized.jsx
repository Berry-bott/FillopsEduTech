import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold mb-3 text-red-600">Access Denied 🚫</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to access this page.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
