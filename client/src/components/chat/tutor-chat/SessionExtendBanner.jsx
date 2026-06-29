import { useState } from "react";
import { useTutorChatStore } from "@/store/tutorChatStore";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function SessionExtendBanner() {
  const selectedBooking = useTutorChatStore((s) => s.selectedBooking);
  const extendSession   = useTutorChatStore((s) => s.extendSession);
  const [loading, setLoading] = useState(false);

  if (!selectedBooking?.extendOffer) return null;

  const duration = selectedBooking.extendDuration || 30;

  const handleExtend = async () => {
    setLoading(true);
    try {
      await extendSession(selectedBooking.id, duration);
    } catch (err) {
      console.error("Failed to extend session:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    useTutorChatStore.setState((s) => ({
      selectedBooking: s.selectedBooking
        ? { ...s.selectedBooking, extendOffer: false }
        : null,
    }));
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mx-4 my-2 flex-shrink-0">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
        <Clock className="h-4 w-4 shrink-0" />
        <p className="text-sm font-medium">
          Extend this session by {duration} minutes?
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDecline}
          disabled={loading}
          className="text-xs"
        >
          Decline
        </Button>
        <Button
          size="sm"
          onClick={handleExtend}
          disabled={loading}
          className="text-xs bg-amber-500 hover:bg-amber-600 text-white border-0"
        >
          {loading ? "Extending..." : `Extend +${duration}m`}
        </Button>
      </div>
    </div>
  );
}