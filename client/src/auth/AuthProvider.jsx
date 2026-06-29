      import { useEffect, useState } from "react";
      import useAuthStore from "../store/authStore";

      export default function AuthProvider({ children }) {
        const checkAuth = useAuthStore((s) => s.checkAuth);
        const [ready, setReady] = useState(false);

        useEffect(() => {
          checkAuth().finally(() => setReady(true));
        }, []);

        if (!ready) return

        return children;
      }
