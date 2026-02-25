// src/pages/Settings.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Trash2,
  Loader2,
  LogOut,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

export default function Settings() {
  const {
    user,
    isAuthenticated,
    loading,
    uploadAvatar,
    deleteAvatar,
    updateProfile,
    logout,
    clearMessages,
    success,
    error,
  } = useAuthStore();

  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    state: '',
    lga: '',
    residentialAddress: '',
  });

  // Sync form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
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

  // Toast feedback
  useEffect(() => {
    if (success) {
      toast({ title: 'Success', description: success });
      clearMessages();
    }
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      clearMessages();
    }
  }, [success, error, toast, clearMessages]);

  // ── Avatar handlers ───────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please select an image', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum 5MB allowed', variant: 'destructive' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const fd = new FormData();
    fd.append('passport', file);

    setUploadingAvatar(true);
    try {
      await uploadAvatar(fd);
      setPreviewUrl(null);
    } catch (err) {
      setPreviewUrl(null);
      toast({ title: 'Upload failed', description: 'Please try again', variant: 'destructive' });
    } finally {
      setUploadingAvatar(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Remove profile picture?')) return;
    try {
      await deleteAvatar();
      toast({ title: 'Success', description: 'Profile picture removed' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to remove picture', variant: 'destructive' });
    }
  };

  // ── Profile update ────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phoneNumber.trim()) {
      toast({
        title: 'Missing fields',
        description: 'First name, last name and phone number are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateProfile(formData);
    } catch (err) {
      // toast handled via store
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="mt-6 text-2xl font-bold">Please sign in</h2>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const currentAvatar = previewUrl || user?.passportPhotoUrl || user?.passport || null;

  return (
    <>
      <Toaster />

      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

              {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/user/dashboard')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User size={22} /> Profile
              </h2>

              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 shadow-inner">
                    {currentAvatar ? (
                      <img
                        src={currentAvatar.replace('/upload/', '/upload/c_fill,g_face,h_400,w_400,q_auto,f_auto/')}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = '/default-avatar.png')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No photo
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 right-0 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar || loading}
                      className="p-2.5 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
                    >
                      <Camera size={18} />
                    </button>

                    {currentAvatar && (
                      <button
                        onClick={handleDeleteAvatar}
                        disabled={uploadingAvatar || loading}
                        className="p-2.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-gray-600 mt-1">{user?.email}</p>
                  {user?.emailVerified && (
                    <span className="inline-flex items-center gap-1 mt-1 text-sm text-green-600">
                      <ShieldCheck size={16} /> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(p => ({ ...p, phoneNumber: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="080xxxxxxxx"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(p => ({ ...p, dateOfBirth: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData(p => ({ ...p, state: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Rivers"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      LGA
                    </label>
                    <input
                      type="text"
                      value={formData.lga}
                      onChange={(e) => setFormData(p => ({ ...p, lga: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Port Harcourt"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Residential Address
                  </label>
                  <textarea
                    value={formData.residentialAddress}
                    onChange={(e) => setFormData(p => ({ ...p, residentialAddress: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[90px]"
                    placeholder="Street, area, city..."
                    rows={3}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || uploadingAvatar}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Saving...
                      </>
                    ) : (
                      'Save Profile Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShieldAlert size={22} /> Account
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/change-password')}
                  className="w-full flex items-center justify-between px-5 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Lock size={20} className="text-gray-600" />
                    <span className="font-medium">Change Password</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                {/* Updated Logout Button with shadcn/ui */}
                <Button
                  variant="outline"
                  className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={20} />
                    <span>Log Out</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </Button>

                <button
                  disabled
                  className="w-full flex items-center justify-between px-5 py-4 border border-red-200 rounded-xl bg-red-50/30 text-red-600/70 cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={20} />
                    <span className="font-medium">Delete Account</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out of your account?</DialogTitle>
            <DialogDescription>
              You will be signed out from this device. You'll need to sign in again to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setShowLogoutModal(false);
                await logout();
                navigate('/login');
              }}
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
