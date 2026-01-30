import { useState } from "react";
import { X, Star, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserChatStore } from "@/store/userChatStore";
import { cn } from "@/lib/utils";

export default function RatingModal({ booking, isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const rateSession = useUserChatStore((state) => state.rateSession);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await rateSession(booking.id, rating, feedback.trim());
      
      // Close modal
      onClose();
      
      // Reset form
      setRating(0);
      setFeedback("");
    } catch (err) {
      setError(err.message || "Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError("");
      setRating(0);
      setFeedback("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Rate Your Session</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tutor Info */}
        <div className="p-6 border-b border-slate-200 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-3">
            {booking.participant_name?.charAt(0).toUpperCase() || "T"}
          </div>
          <h3 className="text-lg font-bold text-slate-900">{booking.participant_name}</h3>
          <p className="text-sm text-slate-500">How was your session?</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Star Rating */}
          <div className="space-y-3">
            <label className="block text-center text-slate-700 font-semibold">
              Rate Your Experience
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  className="transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <Star
                    className={cn(
                      "h-10 w-10 transition-colors",
                      (hoveredRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-slate-600">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-slate-700 font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              Additional Feedback (Optional)
            </label>
            <Textarea
              id="feedback"
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="resize-none focus:border-indigo-300 focus:ring-indigo-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}