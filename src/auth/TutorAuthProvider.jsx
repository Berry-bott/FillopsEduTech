    //   import { useEffect, useState } from "react";
    //   import useTutorAuthStore from "../store/tutorAuthStore";

    //   export default function TutorAuthProvider({ children }) {
    //     const checkTutorAuth = useTutorAuthStore((s) => s.checkTutorAuth);
    //     const [ready, setReady] = useState(false);

    //     useEffect(() => {
    //         checkTutorAuth().finally(() => setReady(true));
    //     }, []);

    //     if (!ready) return

    //     return children;
    //   }




import { useEffect, useState } from "react";
import useTutorAuthStore from "../store/tutorAuthStore";

export default function TutorAuthProvider({ children }) {
  const checkTutorAuth = useTutorAuthStore((s) => s.checkTutorAuth);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    checkTutorAuth().finally(() => setReady(true));
  }, [checkTutorAuth]);

  if (!ready) return null;

  return children;
}