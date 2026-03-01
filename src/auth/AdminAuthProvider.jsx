import { useEffect, useRef, useState } from "react";
import useAdminAuthStore from "@/store/adminAuthStore";
import { Loader2 } from "lucide-react";

export default function AdminAuthProvider({ children }) {
  const checkAuth = useAdminAuthStore((state) => state.checkAuth);
  const accessToken = useAdminAuthStore((state) => state.accessToken);

  const [ready, setReady] = useState(false);
  const hasRun = useRef(false); // ← key: prevent multiple executions

  useEffect(() => {
    // Skip if already ran once (even if token changes later)
    if (hasRun.current) return;

    const initializeAuth = async () => {
      console.log("[AdminAuthProvider] Starting auth check...");

      // No token → fast path, no network call
      if (!accessToken) {
        console.log("[AdminAuthProvider] No access token → skipping refresh, ready immediately");
        setReady(true);
        hasRun.current = true;
        return;
      }

      try {
        console.log("[AdminAuthProvider] Calling checkAuth()...");
        await checkAuth(); // we let the store handle success/failure
      } catch (err) {
        console.error("[AdminAuthProvider] checkAuth failed:", err);
        // We still proceed — protected routes will handle redirection
      } finally {
        if (!hasRun.current) {
          setReady(true);
          hasRun.current = true;
        }
      }
    };

    initializeAuth();

    // Cleanup not really needed here anymore
    return () => {
      // optional: if you want to allow re-run on unmount + remount (rare)
    };
  }, []); // ← empty deps → runs **once** when provider mounts

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
        <p className="text-lg font-medium text-muted-foreground">
          Verifying admin session...
        </p>
        <p className="text-sm text-muted-foreground mt-2">Please wait a moment</p>
      </div>
    );
  }

  return <>{children}</>;
}