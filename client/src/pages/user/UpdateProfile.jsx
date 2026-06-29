// src/pages/Profile.jsx
import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useNavigate } from 'react-router-dom';

import { Camera, Trash2, Loader2, AlertCircle, Save, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const {
    user,
    isAuthenticated,
    isCheckingAuth = false,
    uploadAvatar,
    deleteAvatar,
    updateProfile,
    loading,
    success,
    error,
    clearMessages,
  } = useAuthStore();

  const { toast } = useToast();
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    state: '',
    lga: '',
    residentialAddress: '',
  });

  // Sync form with user data when user object changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split('T')[0]
          : '',
        state: user.state || '',
        lga: user.lga || '',
        residentialAddress: user.residentialAddress || '',
      });
    }
  }, [user]);

  // Toast notifications for success / error
  useEffect(() => {
    if (success) {
      toast({ title: 'Success', description: success });
      clearMessages();
    }
  }, [success, toast, clearMessages]);

  useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      clearMessages();
    }
  }, [error, toast, clearMessages]);

  // ── Avatar Upload ────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB allowed.', variant: 'destructive' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.append('passport', file);

    setUploading(true);
    clearMessages();

    try {
      const result = await uploadAvatar(formData);
      if (!result?.success) {
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleDeleteAvatar = async () => {
    const confirmed = window.confirm('Remove profile picture? This cannot be undone.');
    if (!confirmed) return;

    clearMessages();
    const result = await deleteAvatar();
    if (result?.success) {
      setPreviewUrl(null);
    }
  };

  // ── Form Submit ──────────────────────────────────────────────────
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    await updateProfile(formData);
  };

  // ── Avatar Display Logic ─────────────────────────────────────────
  const currentAvatar = previewUrl || user?.passportPhotoUrl || null;
  const optimizedAvatar = currentAvatar
    ? currentAvatar.replace('/upload/', '/upload/c_fill,g_face,h_400,w_400,q_auto,f_auto/')
    : '/default-avatar.png';

  // ── Loading / Auth Guards ────────────────────────────────────────
  if (isCheckingAuth) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <Loader2 className="animate-spin mx-auto mb-6" size={48} />
        <p className="text-lg text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="mx-auto mb-6 text-red-500" size={64} />
        <h2 className="text-2xl font-semibold mb-3">Please sign in</h2>
        <p className="text-gray-600">You need to be logged in to view and edit your profile.</p>
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

        {/* Avatar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50 shadow-inner">
                {currentAvatar ? (
                  <img
                    src={optimizedAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 text-sm">
                    No photo
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                  className="p-3 bg-white rounded-full hover:bg-gray-50 shadow"
                >
                  <Camera size={24} className="text-gray-700" />
                </button>

                {currentAvatar && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={uploading || loading}
                    className="p-3 bg-white rounded-full hover:bg-gray-50 shadow text-red-600"
                  >
                    <Trash2 size={24} />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {user?.firstName || 'User'} {user?.lastName || ''}
              </h2>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              {user?.phoneNumber && (
                <p className="text-gray-500 mt-1">Phone: {user.phoneNumber}</p>
              )}
              {user?.state && user?.lga && (
                <p className="text-gray-500 mt-1">
                  {user.lga}, {user.state}
                </p>
              )}
            </div>
          </div>

          {(uploading || loading) && (
            <div className="mt-6 flex items-center gap-3 text-gray-600">
              <Loader2 className="animate-spin" size={20} />
              <span>Processing...</span>
            </div>
          )}
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-6">Update Personal Information</h3>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your last name"
                  required
                />
              </div>
            </div>

            {/* Contact row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 cursor-not-allowed"
                  placeholder="your.email@example.com"
                  required
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="08012345678"
                />
              </div>
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Rivers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LGA</label>
                <input
                  type="text"
                  value={formData.lga}
                  required
                  onChange={(e) => setFormData((p) => ({ ...p, lga: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Port Harcourt"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Residential Address</label>
              <textarea
                value={formData.residentialAddress}
                required
                onChange={(e) => setFormData((p) => ({ ...p, residentialAddress: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[90px]"
                placeholder="House number, street name, area..."
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading || uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}