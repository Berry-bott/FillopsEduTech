
// // src/pages/Profile.jsx
// import { useState, useRef, useEffect } from 'react';
// import useAuthStore from '../../store/authStore'; // adjust path if needed
// import {
//   Camera,
//   Trash2,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
// } from 'lucide-react';

// export default function Profile() {
//   const {
//     user,
//     isAuthenticated,
//     isCheckingAuth = false,   // ← fallback if you haven't added it to store yet
//     uploadAvatar,
//     deleteAvatar,
//     loading,
//     success,
//     error,
//     clearMessages,
//   } = useAuthStore();

//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   // Debug: log important state on every render / important changes
//   useEffect(() => {
//     console.log('[Profile] Render / Mount ────────────────────────────────');
//     console.log('  isCheckingAuth:', isCheckingAuth);
//     console.log('  isAuthenticated:', isAuthenticated);
//     console.log('  user object:', user);
//     console.log('  user?.passportPhotoUrl:', user?.passportPhotoUrl);
//     console.log('  user?.passport (old field?):', user?.passport);
//     console.log('  previewUrl (local):', previewUrl);
//     console.log('  final currentAvatar:', previewUrl || user?.passportPhotoUrl || user?.passport);
//   }, [isCheckingAuth, isAuthenticated, user, previewUrl]);

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       useAuthStore.setState({ error: 'Please select an image file' });
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       useAuthStore.setState({ error: 'Image must be smaller than 5MB' });
//       return;
//     }

//     const objectUrl = URL.createObjectURL(file);
//     setPreviewUrl(objectUrl);

//     const formData = new FormData();
//     formData.append('passport', file);

//     setUploading(true);
//     clearMessages();

//     try {
//       const result = await uploadAvatar(formData);
//       if (!result?.success) {
//         setPreviewUrl(null);
//       }
//       // success → user.passportPhotoUrl should already be updated in store
//     } catch (err) {
//       console.error('Upload error:', err);
//       setPreviewUrl(null);
//     } finally {
//       setUploading(false);
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     }
//   };

//   const handleDeleteAvatar = async () => {
//     if (!window.confirm('Remove your profile picture?')) return;

//     clearMessages();
//     const result = await deleteAvatar();
//     if (result?.success) {
//       setPreviewUrl(null);
//     }
//   };

//   // Use the backend field name + fallback
//   const currentAvatar = previewUrl || user?.passportPhotoUrl || user?.passport;

//   // Cloudinary optimization (face crop, good quality, auto format)
//   const optimizedAvatar = currentAvatar
//     ? currentAvatar.replace(
//         '/upload/',
//         '/upload/c_fill,g_face,h_400,w_400,q_auto,f_auto/'
//       )
//     : '/default-avatar.png'; // ← place a default image in public/default-avatar.png

//   // ──────────────────────────────────────────────────────────────
//   //  Loading / Auth states
//   // ──────────────────────────────────────────────────────────────

//   if (isCheckingAuth) {
//     return (
//       <div className="max-w-2xl mx-auto py-20 px-4 text-center">
//         <Loader2 className="animate-spin mx-auto mb-6" size={48} />
//         <p className="text-lg text-gray-600">Loading profile...</p>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="max-w-2xl mx-auto py-20 px-4 text-center">
//         <AlertCircle className="mx-auto mb-6 text-red-500" size={64} />
//         <h2 className="text-2xl font-semibold mb-3">Not authenticated</h2>
//         <p className="text-gray-600">Please log in to view your profile.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

//       <div className="bg-white shadow rounded-xl p-6 md:p-8 mb-8">
//         <div className="flex flex-col sm:flex-row items-center gap-8">
//           {/* Avatar */}
//           <div className="relative group">
//             <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50 shadow-inner">
//               {currentAvatar ? (
//                 <img
//                   src={optimizedAvatar}
//                   alt="Profile passport"
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     console.warn('Failed to load avatar:', optimizedAvatar);
//                     e.currentTarget.src = '/default-avatar.png';
//                     e.currentTarget.onerror = null;
//                   }}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
//                   No photo
//                 </div>
//               )}
//             </div>

//             {/* Hover overlay */}
//             <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={uploading || loading}
//                 className="p-3 bg-white rounded-full hover:bg-gray-100 shadow-sm"
//                 title="Upload new photo"
//               >
//                 <Camera size={24} />
//               </button>

//               {currentAvatar && (
//                 <button
//                   type="button"
//                   onClick={handleDeleteAvatar}
//                   disabled={uploading || loading}
//                   className="p-3 bg-white rounded-full hover:bg-gray-100 shadow-sm text-red-600"
//                   title="Remove photo"
//                 >
//                   <Trash2 size={24} />
//                 </button>
//               )}
//             </div>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </div>

//           {/* User info */}
//           <div className="text-center sm:text-left">
//             <h2 className="text-2xl font-bold">
//               {user?.firstName} {user?.lastName || 'User'}
//             </h2>
//             <p className="text-gray-600 mt-1">{user?.email}</p>
//             {user?.phoneNumber && (
//               <p className="text-gray-500 mt-1">Phone: {user.phoneNumber}</p>
//             )}
//           </div>
//         </div>

//         {/* Status messages */}
//         <div className="mt-8 space-y-3">
//           {success && (
//             <div className="flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
//               <CheckCircle size={20} />
//               <span>{success}</span>
//             </div>
//           )}

//           {error && (
//             <div className="flex items-center gap-3 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
//               <AlertCircle size={20} />
//               <span>{error}</span>
//             </div>
//           )}

//           {(uploading || loading) && (
//             <div className="flex items-center gap-3 text-gray-700">
//               <Loader2 className="animate-spin" size={20} />
//               <span>Processing...</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Account info section */}
//       <div className="bg-white shadow rounded-xl p-6 md:p-8">
//         <h3 className="text-xl font-semibold mb-6">Account Information</h3>
//         <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div>
//             <dt className="text-sm font-medium text-gray-500">Email</dt>
//             <dd className="mt-1 text-gray-900">{user?.email || '—'}</dd>
//           </div>
//           <div>
//             <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
//             <dd className="mt-1 text-gray-900">{user?.phoneNumber || '—'}</dd>
//           </div>
//           {/* Add more fields when available */}
//         </dl>
//       </div>
//     </div>
//   );
// }










// src/pages/Profile.jsx
import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useNavigate } from "react-router-dom";

import { Camera, Trash2, Loader2, AlertCircle, Save, ArrowLeft  } from 'lucide-react';

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
  });

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  // Bubble store success / error into toasts
  useEffect(() => {
    if (success) {
      toast({ title: 'Success', description: success });
      clearMessages();
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      clearMessages();
    }
  }, [error]);

  useEffect(() => {
  console.log("5. User in Profile changed:", user?.passportPhotoUrl);
}, [user?.passportPhotoUrl]);

  // ── Avatar handlers ──────────────────────────────────────────

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' });
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast({ title: 'File too large', description: 'Image must be smaller than 5MB.', variant: 'destructive' });
//       return;
//     }

//     const objectUrl = URL.createObjectURL(file);
//     setPreviewUrl(objectUrl);

//     const fd = new FormData();
//     fd.append('passport', file);

//     setUploading(true);
//     clearMessages();

//     try {
//       const result = await uploadAvatar(fd);
//       if (!result?.success) setPreviewUrl(null);
//     } catch (err) {
//       console.error('Upload error:', err);
//       toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' });
//       setPreviewUrl(null);
//     } finally {
//       setUploading(false);
//       if (objectUrl) URL.revokeObjectURL(objectUrl);
//     }
//   };
const handleFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast({ title: 'File too large', description: 'Image must be smaller than 5MB.', variant: 'destructive' });
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  setPreviewUrl(objectUrl); // show preview while uploading

  const fd = new FormData();
  fd.append('passport', file);

  setUploading(true);
  clearMessages();

  try {
    const result = await uploadAvatar(fd);
    if (result?.success) {
      setPreviewUrl(null); // ✅ clear preview — store now has the real URL
    } else {
      setPreviewUrl(null); // clear broken preview on failure too
    }
  } catch (err) {
    console.error('Upload error:', err);
    toast({ title: 'Upload failed', description: 'Please try again.', variant: 'destructive' });
    setPreviewUrl(null);
  } finally {
    setUploading(false);
    URL.revokeObjectURL(objectUrl); // safe to revoke now since previewUrl is cleared
  }
};

  const handleDeleteAvatar = () => {
    toast({
      title: 'Remove profile picture?',
      description: 'This action cannot be undone.',
      variant: 'destructive',
      action: (
        <button
          onClick={async () => {
            clearMessages();
            const result = await deleteAvatar();
            if (result?.success) setPreviewUrl(null);
          }}
          className="rounded bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
        >
          Remove
        </button>
      ),
    });
  };

  // ── Profile update ───────────────────────────────────────────

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    await updateProfile(formData);
    // toast fires automatically via the success/error useEffects above
  };

  // ── Avatar resolution ────────────────────────────────────────

  const currentAvatar = previewUrl || user?.passportPhotoUrl || user?.passport;

  const optimizedAvatar = currentAvatar
    ? currentAvatar.replace('/upload/', '/upload/c_fill,g_face,h_400,w_400,q_auto,f_auto/')
    : '/default-avatar.png';

  // ── Guards ───────────────────────────────────────────────────

  if (isCheckingAuth) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <Loader2 className="animate-spin mx-auto mb-6" size={48} />
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="mx-auto mb-6 text-red-500" size={64} />
        <h2 className="text-2xl font-semibold mb-3">Not authenticated</h2>
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className='flex justify-between items-center mb-8'>

        <h1 className="text-3xl font-bold ">Your Profile</h1>

          <button
            onClick={() => navigate('/user/dashboard')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 hover:border-blue-300"
            >
            <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-gray-700">Back to Dashboard</span>
            </button>
        </div>

        {/* ── Avatar card ── */}
        <div className="bg-white shadow rounded-xl p-6 md:p-8 mb-8">
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
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    No photo
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                  className="p-3 bg-white rounded-full hover:bg-gray-100 shadow-sm"
                  title="Upload new photo"
                >
                  <Camera size={24} />
                </button>

                {currentAvatar && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={uploading || loading}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 shadow-sm text-red-600"
                    title="Remove photo"
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
                {user?.firstName} {user?.lastName || 'User'}
              </h2>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              {user?.phoneNumber && (
                <p className="text-gray-500 mt-1">Phone: {user.phoneNumber}</p>
              )}
            </div>
          </div>

          {(uploading || loading) && (
            <div className="mt-6 flex items-center gap-3 text-gray-700">
              <Loader2 className="animate-spin" size={20} />
              <span>Processing...</span>
            </div>
          )}
        </div>

        {/* ── Edit profile form ── */}
        <div className="bg-white shadow rounded-xl p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}