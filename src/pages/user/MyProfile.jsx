// src/pages/MyProfile.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  ShieldCheck,
  Edit,
  ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';

export default function MyProfile() {
  const {
    user,
    isAuthenticated,
    isCheckingAuth,
    checkAuth,
    loading,
  } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && isAuthenticated) {
      checkAuth();
    }
  }, [user, isAuthenticated, checkAuth]);

  if (isCheckingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md w-full">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            Not Signed In
          </h2>
          <p className="mt-3 text-gray-600 text-base sm:text-lg">
            You need to be logged in to view your profile.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-8 w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition text-lg shadow-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not provided';
    try {
      return format(new Date(dateStr), 'MMMM dd, yyyy');
    } catch {
      return dateStr.split('T')[0] || dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Safe area top padding on mobile */}
      <div className="pt-safe-top px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-gray-600 text-sm sm:text-base">
              Personal information and account details
            </p>
          </div>

          <div className="flex flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/user/dashboard')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm sm:text-base font-medium"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-sm text-sm sm:text-base"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200">
          {/* Profile Header with Photo */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-5 sm:px-8 py-10 sm:py-12 text-white">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6 sm:gap-8">
              <div className="relative shrink-0">
                {user.passportPhotoUrl || user.passport ? (
                  <img
                    src={user.passportPhotoUrl || user.passport}
                    alt="Profile"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => (e.target.src = '/default-avatar.png')}
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                    <User size={48} className="text-white/70" />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left mt-3 sm:mt-0">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {user.firstName} {user.lastName || 'User'}
                </h2>
                <p className="mt-2 text-blue-100 flex items-center justify-center sm:justify-start gap-2 text-base">
                  <Mail size={18} />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2">
                  Personal Information
                </h3>

                <div className="space-y-5">
                  <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(user.dateOfBirth)} />
                  <InfoRow icon={Phone} label="Phone Number" value={user.phoneNumber || 'Not provided'} />
                  <InfoRow
                    icon={ShieldCheck}
                    label="Email Verification"
                    value={user.emailVerified ? 'Verified' : 'Not Verified'}
                    valueClassName={user.emailVerified ? 'text-green-600' : 'text-amber-600'}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-2">
                  Address
                </h3>

                <div className="space-y-5">
                  <InfoRow
                    icon={MapPin}
                    label="State & LGA"
                    value={
                      user.state && user.lga
                        ? `${user.lga}, ${user.state}`
                        : 'Not provided'
                    }
                  />
                  <InfoRow
                    icon={Home}
                    label="Residential Address"
                    value={user.residentialAddress || 'Not provided'}
                  />
                </div>
              </div>
            </div>

            {/* Account Meta */}
            <div className="mt-10 pt-6 border-t text-sm text-gray-500 space-y-1.5">
              <p>
                Account created:{' '}
                {user.createdAt ? format(new Date(user.createdAt), 'PPP') : 'Unknown'}
              </p>
              <p>
                Last updated:{' '}
                {user.updatedAt ? format(new Date(user.updatedAt), 'PPP p') : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable row component (cleaner & easier to maintain)
function InfoRow({ icon: Icon, label, value, valueClassName = 'font-medium' }) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="h-6 w-6 text-gray-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-base ${valueClassName} break-words`}>{value}</p>
      </div>
    </div>
  );
}