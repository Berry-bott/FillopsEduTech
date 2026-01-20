import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Mail, User, Loader2, Upload, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../../store/authStore"; 
import { useToast } from "@/components/ui/use-toast";
import Logo from "../../assets/images/fillopsLogo.png";

// ----------------------------------------
// VALIDATION SCHEMAS FOR EACH STEP
// ----------------------------------------
const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
});

const step2Schema = z.object({
  schoolAttended: z.string().min(1, "School attended is required"),
  degree: z.string().min(1, "Degree is required"),
  areaOfSpecialization: z.string().min(1, "Area of specialization is required"),
  otherCertifications: z.string().optional(),
  professionalCertificate: z.string().optional(),
  membershipOfProfessionalBodies: z.string().optional(),
  socialLinks: z
  .string()
  .url("Must be a valid URL")
  .optional()

});

const step3Schema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
});


// ----------------------------------------
// PROGRESS INDICATOR
// ----------------------------------------
const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const steps = ["Personal Info", "Education", "More Details"];
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 hidden sm:block">
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 rounded transition-all ${
                  index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------
// MAIN REGISTER COMPONENT
// ----------------------------------------
const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [passportFile, setPassportFile] = useState(null);
  const [passportPreview, setPassportPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState("");


  const { register: registerUser, loading, error, success, clearMessages } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    state: "",
    schoolAttended: "",
    degree: "",
    areaOfSpecialization: "",
    otherCertifications: "",
    department: "",
    professionalCertificate: "",
    membershipOfProfessionalBodies: "",
    socialLinks: "",
    cvUploads: "",
  });

  // Get current schema based on step
  const getCurrentSchema = () => {
    switch (currentStep) {
      case 0:
        return step1Schema;
      case 1:
        return step2Schema;
      case 2:
        return step3Schema;
      default:
        return step1Schema;
    }
  };

  const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: formData,
    mode: "onChange",
  });

  // Handle passport file upload
  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Passport image must be less than 5MB",
        });
        return;
      }
      
      setPassportFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file only",
      });
      return;
    }
    if (file.size > 10000000) { // 10MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "PDF must be less than 10MB",
      });
      return;
    }
    setPdfFile(file);
    setPdfName(file.name);
  }
  };
  const removePdf = () => {
  setPdfFile(null);
  setPdfName("");
};


  const removePassport = () => {
    setPassportFile(null);
    setPassportPreview(null);
  };

  // Handle URL param messages
  useEffect(() => {
    const verified = searchParams.get("verified");
    const errorParam = searchParams.get("error");
    const reason = searchParams.get("reason");

    if (verified === "true") {
      clearMessages?.();
      toast({
        title: "Email Verified 🎉",
        description: "You can now log in to your account.",
      });
      navigate(location.pathname, { replace: true });
    }

    if (errorParam) {
      clearMessages?.();
      let title = "Error";
      let description = "Your verification link is invalid or has expired.";

      if (errorParam === "verification_failed") {
        title = "Verification Failed";
        if (reason === "invalid-or-expired") {
          description = "Your verification link is invalid or has expired. Please request a new verification email.";
        } else if (reason) {
          description = reason.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        }
      } else if (reason) {
        description = reason.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      }

      toast({
        variant: "destructive",
        title: `${title} ❌`,
        description,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [searchParams, clearMessages, toast, navigate, location]);

  // Handle next step
  const handleNext = async (data) => {
    setFormData({ ...formData, ...data });
    
    if (currentStep === 2) {
      // Final step - Location & Passport
      if (!passportFile) {
        toast({
          variant: "destructive",
          title: "Passport Required",
          description: "Please upload your passport photograph",
        });
        return;
      }
      // Submit the form
      await onFinalSubmit(data);
    } else if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final submit
  const onFinalSubmit = async (data) => {
    clearMessages?.();
    const finalData = { ...formData, ...data };
    const { confirmPassword, ...payload } = finalData;

    // In real implementation, you would upload the passport file here
    // For now, we'll just include it in the payload
    const formDataToSend = new FormData();
    Object.keys(payload).forEach(key => {
      formDataToSend.append(key, payload[key]);
    });
    if (passportFile) {
      formDataToSend.append('passport', passportFile);
    }
    if (pdfFile) {
      formDataToSend.append('pdf', pdfFile);
    }


    try {
      const result = await registerUser(payload); 

      if (result?.success) {
        setRegisteredEmail(payload.email);
        setShowVerifyNotice(true);
        toast({
          title: "Registration Successful",
          description: "Check your email to verify your account 🔐",
        });
      } else if (error) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error || "Please check your details and try again.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  // Show email verification notice
  if (showVerifyNotice) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
        <EmailVerificationNotice email={registeredEmail} />
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-2xl bg-white dark:bg-background border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl p-6 overflow-hidden"
      >
      <div className="absolute -top-11 -right-9 w-32 h-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 via-blue-200 to-transparent blur-2xl opacity-100 rounded-full"></div>
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute bg-white rounded-full opacity-80"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 80}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                filter: "blur(1px)",
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          <div
            className="relative w-32 h-32"
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&h=1080&fit=crop"
              alt="Decorative"
              className="w-full h-full object-cover shadow-lg border border-white"
            />
          </div>
        </motion.div>
      </div>

        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img
            src={Logo}
            alt="App Logo"
            className="h-14 w-14 rounded-full shadow-md border border-gray-300 dark:border-gray-600 object-cover"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Join us and access your dashboard instantly
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} totalSteps={3} />

        {/* Error & Success Messages */}
        {success && (
          <p className="text-green-600 text-sm mb-3 text-center">{success}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Multi-Step Form */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit(handleNext)} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">
                  Personal Information
                </h3>

                {/* First Name */}
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <input
                    {...register("firstName")}
                    type="text"
                    placeholder="First Name"
                    defaultValue={formData.firstName}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <input
                    {...register("lastName")}
                    type="text"
                    placeholder="Last Name"
                    defaultValue={formData.lastName}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email Address"
                    defaultValue={formData.email}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    placeholder="Phone Number"
                    defaultValue={formData.phoneNumber}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="relative">
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    defaultValue={formData.dateOfBirth}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="relative">
                  <select
                    {...register("gender")}
                    defaultValue={formData.gender}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-background focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit(handleNext)} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">
                  Location
                </h3>
                {/* School Attended */}
                <div className="relative">
                  <input
                    {...register("schoolAttended")}
                    type="text"
                    placeholder="School Attended"
                    defaultValue={formData.schoolAttended}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.schoolAttended && (
                    <p className="text-red-500 text-xs mt-1">{errors.schoolAttended.message}</p>
                  )}
                </div>

                {/* Department */}
                <div className="relative">
                  <input
                    {...register("department")}
                    type="text"
                    placeholder="department"
                    defaultValue={formData.department}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.schoolAttended && (
                    <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
                  )}
                </div>

                {/* Degree */}
                <div className="relative">
                  <input
                    {...register("degree")}
                    type="text"
                    placeholder="Degree (e.g., B.Sc, M.Sc, PhD)"
                    defaultValue={formData.degree}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.degree && (
                    <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>
                  )}
                </div>

                {/* Area of Specialization */}
                <div className="relative">
                  <input
                    {...register("areaOfSpecialization")}
                    type="text"
                    placeholder="Area of Specialization"
                    defaultValue={formData.areaOfSpecialization}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.areaOfSpecialization && (
                    <p className="text-red-500 text-xs mt-1">{errors.areaOfSpecialization.message}</p>
                  )}
                </div>

                {/* Other Certifications */}
                <div className="relative">
                  <textarea
                    {...register("otherCertifications")}
                    placeholder="Other Certifications (Optional)"
                    defaultValue={formData.otherCertifications}
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                </div>

                {/* Professional Certificate */}
                <div className="relative">
                  <input
                    {...register("professionalCertificate")}
                    type="text"
                    placeholder="Professional Certificate (Optional)"
                    defaultValue={formData.professionalCertificate}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                {/* Membership of Professional Bodies */}
                <div className="relative">
                  <textarea
                    {...register("membershipOfProfessionalBodies")}
                    placeholder="Membership of Professional Bodies (Optional)"
                    defaultValue={formData.membershipOfProfessionalBodies}
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2.5 rounded-lg shadow-md transition duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-1">
                  Upload Passport Photograph
                </h3>
                  {/* Country */}
                <div className="relative">
                  <input
                    {...register("country")}
                    type="text"
                    placeholder="Country"
                    defaultValue={formData.country}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
                  )}
                </div>
        
                {/* State */}
                <div className="relative">
                  <input
                    {...register("state")}
                    type="text"
                    placeholder="State"
                    defaultValue={formData.state}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                  )}
                </div>
                {/* socail links */}
                  <div className="relative">
                  <input
                    {...register("socialLinks")}
                    type="url"
                    placeholder="any social links"
                    defaultValue={formData.socialLinks}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.socialLinks.message}</p>
                  )}
                </div>

              {/* CV / PDF Upload */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 dark:text-gray-300">
                  Upload CV / Certificate (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:ring-2 focus:ring-indigo-400"
                />
                
                {pdfName && (
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">{pdfName}</p>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="text-red-500 text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>


                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  {!passportPreview ? (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Click to upload your passport photograph
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                        PNG, JPG up to 5MB
                      </p>
                      <label className="cursor-pointer">
                        <span className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg inline-block transition">
                          Choose File
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePassportUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={passportPreview}
                        alt="Passport preview"
                        className="mx-auto h-40 w-40 object-cover rounded-lg border-2 border-indigo-600 mb-3"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {passportFile?.name}
                      </p>
                      <button
                        type="button"
                        onClick={removePassport}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2.5 rounded-lg shadow-md transition duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNext({})}
                    disabled={loading}
                    className={`flex-1 flex items-center justify-center gap-2 ${
                      loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>Complete Registration</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p
            onClick={() => navigate("/tutor/login")}
            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm cursor-pointer"
          >
            Already have an account? Sign in
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;