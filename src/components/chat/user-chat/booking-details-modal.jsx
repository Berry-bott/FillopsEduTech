import { X, Calendar, Clock, User, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function BookingDetailsModal({ booking, isOpen, onClose, onReschedule, onCancel }) {
  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Session Details</h2>
                <Badge className={cn("border", getStatusColor(booking.status))}>
                  {booking.status}
                </Badge>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Tutor Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {booking.participant_name?.charAt(0).toUpperCase() || "T"}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900">
                  {booking.participant_name || "Unknown Tutor"}
                </h3>
                <p className="text-sm text-slate-600">Professional Tutor</p>
                {booking.completedSessions !== undefined && (
                  <p className="text-xs text-slate-500 mt-1">
                    {booking.completedSessions} sessions completed
                  </p>
                )}
              </div>
              {booking.rating && (
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-700">
                    {booking.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Schedule Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Scheduled</p>
                  <p className="text-slate-900">{formatDate(booking.scheduledAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Duration</p>
                  <p className="text-slate-900">{booking.duration || 60} minutes</p>
                </div>
              </div>

              {booking.purpose && (
                <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Purpose</p>
                    <p className="text-slate-900">{booking.purpose}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Subjects */}
            {booking.subjects && booking.subjects.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Tutor's Subjects ({booking.subjects.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {booking.subjects.map((subject) => (
                    <Badge key={subject.id} variant="outline" className="text-sm">
                      {subject.subjectName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {booking.bio && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">About Tutor</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{booking.bio}</p>
              </div>
            )}

            {/* Rating & Feedback */}
            {booking.feedback && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 fill-blue-600 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Your Feedback</h4>
                </div>
                {booking.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= booking.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-slate-300"
                        )}
                      />
                    ))}
                  </div>
                )}
                <p className="text-blue-800 text-sm">{booking.feedback}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              {(booking.status === "pending" || booking.status === "confirmed") && (
                <>
                  <Button
                    onClick={() => {
                      onReschedule(booking);
                      onClose();
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Reschedule
                  </Button>
                  <Button
                    onClick={() => {
                      onCancel(booking.id);
                      onClose();
                    }}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Cancel Session
                  </Button>
                </>
              )}
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}