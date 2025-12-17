import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/authStore";

export default function AuthProvider({ children }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check auth before rendering any protected page
    checkAuth().finally(() => setReady(true));
  }, []);

  if (!ready)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-20 h-20 animate-spin text-gray-600" />
      </div>
    );

  return children;
}
