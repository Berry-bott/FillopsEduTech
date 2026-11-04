
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Formio } from "formiojs";
import "formiojs/dist/formio.full.min.css";
import { useToast } from "@/components/ui/use-toast";
import Logo from "../../assets/images/fillopsLogo.png";

// =====================================================
// CPANEL PHP ENDPOINT
// =====================================================

const CPANEL_FORM_URL = "https://support.filloptech.com/form.php";

// =====================================================
// BASE64 STORAGE PROVIDER
// =====================================================

const Base64StorageProvider = {
  type: "base64",

  config: {
    public: true,
  },

  upload: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve({
          storage: "base64",
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
        });
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  },

  download: (file) => {
    return file.data;
  },
};

// =====================================================
// PROGRESS INDICATOR
// =====================================================

const ProgressIndicator = ({ currentStep }) => {
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
                    ? "bg-primary-hover text-white"
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

// =====================================================
// STEP 1 - PERSONAL INFORMATION
// =====================================================

const STEP1_SCHEMA = {
  display: "form",

  components: [
    {
      type: "textfield",
      key: "firstName",
      label: "First Name",
      placeholder: "First Name",
      validateOn: "submit",
      validate: {
        required: true,
      },
    },

    {
      type: "textfield",
      key: "lastName",
      label: "Last Name",
      placeholder: "Last Name",
      validateOn: "submit",
      validate: {
        required: true,
      },
    },

    {
      type: "email",
      key: "email",
      label: "Email Address",
      placeholder: "Email Address",
      validateOn: "submit",
      validate: {
        required: true,
      },
    },

    {
      type: "textfield",
      key: "phoneNumber",
      label: "Phone Number",
      placeholder: "Phone Number",
      validateOn: "submit",
      validate: {
        required: true,
        minLength: 10,
      },
    },

    {
      type: "datetime",
      key: "dateOfBirth",
      label: "Date of Birth",
      format: "yyyy-MM-dd",
      validateOn: "submit",
      validate: {
        required: true,
      },
    },

    {
      type: "select",
      key: "gender",
      label: "Gender",
      placeholder: "Select Gender",
      dataSrc: "values",

      data: {
        values: [
          {
            label: "Male",
            value: "male",
          },
          {
            label: "Female",
            value: "female",
          },
          {
            label: "Other",
            value: "other",
          },
        ],
      },

      widget: "html5",

      validateOn: "submit",

      validate: {
        required: true,
      },
    },
  ],
};

// =====================================================
// STEP 2 - EDUCATION
// =====================================================

const STEP2_SCHEMA = {
  display: "form",

  components: [
    {
      type: "textfield",
      key: "schoolAttended",
      label: "School Attended",
      placeholder: "School Attended",
      validateOn: "submit",

      validate: {
        required: true,
      },
    },

    {
      type: "textfield",
      key: "department",
      label: "Department",
      placeholder: "Department",
    },

    {
      type: "textfield",
      key: "degree",
      label: "Degree (e.g., B.Sc, M.Sc, PhD)",
      placeholder: "Degree",
      validateOn: "submit",

      validate: {
        required: true,
      },
    },

    {
      type: "textfield",
      key: "areaOfSpecialization",
      label: "Area of Specialization",
      placeholder: "Area of Specialization",
      validateOn: "submit",

      validate: {
        required: true,
      },
    },

    {
      type: "textarea",
      key: "otherCertifications",
      label: "Other Certifications (Optional)",
      placeholder: "Other Certifications",
    },

    {
      type: "textfield",
      key: "professionalCertificate",
      label: "Professional Certificate (Optional)",
      placeholder: "Professional Certificate",
    },

    {
      type: "textarea",
      key: "membershipOfProfessionalBodies",
      label: "Membership of Professional Bodies (Optional)",
      placeholder: "Membership of Professional Bodies",
    },
  ],
};

// =====================================================
// STEP 3 - MORE DETAILS
// =====================================================

const STEP3_SCHEMA = {
  display: "form",

  components: [
    {
      type: "textfield",
      key: "country",
      label: "Country",
      placeholder: "Country",
      validateOn: "submit",

      validate: {
        required: true,
      },
    },

    {
      type: "textfield",
      key: "state",
      label: "State",
      placeholder: "State",
      validateOn: "submit",

      validate: {
        required: true,
      },
    },

    {
      type: "url",
      key: "socialLinks",
      label: "Any social links (optional)",
      placeholder: "https://...",
    },

    {
      type: "file",
      key: "pdf",
      label: "Upload CV / Certificate (PDF)",

      file: {
        type: ["application/pdf"],
      },

      storage: "base64",
    },

    {
      type: "file",
      key: "passport",
      label: "Upload Passport Photograph",

      file: {
        type: ["image/png", "image/jpeg"],
      },

      storage: "base64",

      validateOn: "submit",

      validate: {
        required: true,
      },
    },
  ],
};

// =====================================================
// MAIN REGISTER COMPONENT
// =====================================================

const Register = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);

  const [showSuccessNotice, setShowSuccessNotice] = useState(false);

  const [submittedEmail, setSubmittedEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});

  const formDataRef = useRef({});

  const currentStepRef = useRef(0);

  const formRef = useRef(null);

  const formioInstanceRef = useRef(null);

  const isInitializingRef = useRef(false);

  const schemas = [STEP1_SCHEMA, STEP2_SCHEMA, STEP3_SCHEMA];

  // ===================================================
  // KEEP REFS IN SYNC
  // ===================================================

  useEffect(() => {
    formDataRef.current = formData;
    currentStepRef.current = currentStep;
  }, [formData, currentStep]);

  // ===================================================
  // SCROLL TO TOP
  // ===================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentStep]);

  // ===================================================
  // REGISTER BASE64 PROVIDER
  // ===================================================

  useEffect(() => {
    if (Formio && !Formio.storage) {
      Formio.storage = {};
    }

    if (Formio && !Formio.storage.base64) {
      Formio.storage.base64 = Base64StorageProvider;
    }
  }, []);

  // ===================================================
  // INITIALIZE FORM.IO
  // ===================================================

  useEffect(() => {
    if (!showSuccessNotice) {
      isInitializingRef.current = true;

      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          if (!formRef.current) {
            return;
          }

          formRef.current.innerHTML = "";

          Formio.createForm(
            formRef.current,
            schemas[currentStep],
            {
              i18n: {
                en: {
                  required: "This field is required",
                },
              },

              validateOn: "submit",
            }
          )
            .then((form) => {
              formioInstanceRef.current = form;

              isInitializingRef.current = false;

              // Restore previously entered data
              if (Object.keys(formDataRef.current).length > 0) {
                form.submission = {
                  data: formDataRef.current,
                };
              }

              // Handle submit
              form.on("submit", handleFormSubmit);

              // Hide default Form.io validation alert
              form.on("error", () => {
                const alert =
                  form.element?.querySelector(".alert.alert-danger");

                if (alert) {
                  alert.style.display = "none";
                }
              });
            })
            .catch((error) => {
              console.error("Error creating Form.io form:", error);

              isInitializingRef.current = false;
            });
        });
      }, 150);

      return () => {
        clearTimeout(timer);

        isInitializingRef.current = false;
      };
    }
  }, [currentStep, showSuccessNotice]);

  // ===================================================
  // CLEANUP
  // ===================================================

  useEffect(() => {
    return () => {
      if (formioInstanceRef.current) {
        formioInstanceRef.current.destroy(true);

        formioInstanceRef.current = null;
      }
    };
  }, []);

  // ===================================================
  // URL PARAMETER MESSAGES
  // ===================================================

  useEffect(() => {
    const verified = searchParams.get("verified");

    const errorParam = searchParams.get("error");

    const reason = searchParams.get("reason");

    if (verified === "true") {
      toast({
        title: "Email Verified 🎉",

        description: "You can now log in to your account.",
      });

      navigate(location.pathname, {
        replace: true,
      });
    }

    if (errorParam) {
      let title = "Error";

      let description =
        "Your verification link is invalid or has expired.";

      if (errorParam === "verification_failed") {
        title = "Verification Failed";

        if (reason === "invalid-or-expired") {
          description =
            "Your verification link is invalid or has expired. Please request a new verification email.";
        } else if (reason) {
          description = reason
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        }
      }

      toast({
        variant: "destructive",

        title: `${title} ❌`,

        description,
      });

      navigate(location.pathname, {
        replace: true,
      });
    }
  }, [searchParams, toast, navigate, location]);

  // ===================================================
  // SUBMIT FORM
  // ===================================================

  const handleFormSubmit = async (submission) => {
    const stepData = submission.data;

    const currentStepValue = currentStepRef.current;

    // Merge current step with previous steps
    const allData = {
      ...formDataRef.current,
      ...stepData,
    };

    // Save data locally in React
    setFormData(allData);

    // =================================================
    // STEP 1 → STEP 2
    // =================================================

    if (currentStepValue < 2) {
      setCurrentStep(currentStepValue + 1);

      return;
    }

    // =================================================
    // STEP 3 → CPANEL
    // =================================================

    if (currentStepValue === 2) {
      setLoading(true);

      try {
        console.log("Submitting tutor application to cPanel...");

        console.log("Tutor data:", allData);

        // Send everything to cPanel PHP
        const response = await fetch(CPANEL_FORM_URL, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(allData),
        });

        // Try to read JSON response
        let result;

        try {
          result = await response.json();
        } catch (jsonError) {
          throw new Error(
            "The cPanel server returned an invalid response."
          );
        }

        console.log("cPanel response:", result);

        // Check server response
        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message ||
              "The tutor application could not be submitted."
          );
        }

        // =================================================
        // SUCCESS
        // =================================================

        setSubmittedEmail(allData.email || "");

        setShowSuccessNotice(true);

        toast({
          title: "Application Submitted 🎉",

          description:
            "Your tutor application has been sent successfully.",
        });
      } catch (error) {
        console.error("Tutor application submission error:", error);

        toast({
          variant: "destructive",

          title: "Submission Failed",

          description:
            error?.message ||
            "Unable to submit your application. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // ===================================================
  // PREVIOUS BUTTON
  // ===================================================

  const handlePrevious = () => {
    if (currentStep > 0 && !loading) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ===================================================
  // NEXT BUTTON
  // ===================================================

  const handleNext = () => {
    if (!formioInstanceRef.current || loading) {
      return;
    }

    formioInstanceRef.current.submit();
  };

  // ===================================================
  // SUCCESS SCREEN
  // ===================================================

  if (showSuccessNotice) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
        <div className="text-center max-w-md">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Application Submitted
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Thank you for applying to become a tutor.
          </p>

          {submittedEmail && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your application was submitted using{" "}
              <strong>{submittedEmail}</strong>.
            </p>
          )}

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
            Our team will review your application and contact you if
            additional information is required.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-md transition"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-background px-3 py-6 transition-colors duration-300">
      <motion.div
        initial={{
          opacity: 0,
          y: 60,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative w-full max-w-2xl bg-white dark:bg-background border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-6 overflow-hidden"
      >
        {/* Decorative Background */}

        <div className="absolute -top-11 -right-9 w-32 h-32">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
            }}
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
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
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

        {/* Progress */}

        <ProgressIndicator currentStep={currentStep} />

        {/* Form.io */}

        <motion.div
          initial={{
            opacity: 0,
            x: 50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          ref={formRef}
          className="formio-container mb-6"
        />

        {/* Navigation */}

        <div className="flex gap-3 mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2.5 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />

              Previous
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-hover"
            } text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200 disabled:opacity-50`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />

                Submitting...
              </>
            ) : currentStep === 2 ? (
              <>Complete Registration</>
            ) : (
              <>
                Next

                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Login */}

        <div className="text-center mt-4">
          <p
            onClick={() => navigate("/tutor/login")}
            className="text-primary dark:text-primary-hover hover:underline text-sm cursor-pointer"
          >
            Already have an account? Sign in
          </p>

          <p className="text-xs">
            By signing in or registering, you agree to our{" "}
            <a
              href="/terms#your-content"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline"
            >
              Terms of Use
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Register;