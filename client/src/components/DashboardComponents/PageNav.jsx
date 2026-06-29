
import { useEffect, useState } from "react";
import { Menu, X, User, LogOut, Crown, Calendar, Lock } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useStudyStore } from "@/store/studyStore";
import Logo from "../../assets/images/fillopsLogo.png";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PageNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { paid, expiresAt, activeSubscriptions, checkStatus } = usePaymentStore();
  const { activeId, saved } = useStudyStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [examType, setExamType] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [ready, setReady] = useState(false);
  const [hasPremiumForCurrent, setHasPremiumForCurrent] = useState(false);

  const currentActiveId = activeId;

  /* ===============================
     LOAD LOCAL STORAGE & CHECK PAYMENT STATUS
  =============================== */
  useEffect(() => {
    const timer = setTimeout(async () => {
      const localSaved = JSON.parse(localStorage.getItem("studySelections"));
      console.log("📦 Loaded study selections:", localSaved);

      setExamType(localSaved?.exam || saved?.exam || "");
      setStudyMode((prev) => prev || localStorage.getItem("studyMode") || "Learning");

      await checkStatus();
      setReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [checkStatus, saved]);

  /* ===============================
     DYNAMIC STUDY MODE BASED ON PATH
  =============================== */
  useEffect(() => {
    if (location.pathname.includes("/study") || location.pathname.includes("/learning")) {
      setStudyMode("Learning");
    } else if (location.pathname.includes("/quiz")) {
      setStudyMode("Quiz");
    } else if (location.pathname.includes("/exam")) {
      setStudyMode("Exams");
    } else {
      setStudyMode("Learning");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (currentActiveId) {
      console.log("🎯 Active ID changed to:", currentActiveId);
    }
  }, [currentActiveId]);

  /* =============================
  CHECK PREMIUM / SUBSCRIBE STATUS
  =============================== */
  const checkIfCurrentContentPaid = () => {
    if (!activeSubscriptions || activeSubscriptions.length === 0) return false;
    if (!currentActiveId) return false;

    const mode = saved?.mode;

    return activeSubscriptions.some((sub) => {
      let match = false;

      if (mode === "subject") {
        const subjectMatch =
          sub.subjectId === currentActiveId ||
          sub.id === currentActiveId ||
          sub._id === currentActiveId;
        const categoryMatch = sub.category === examType?.toUpperCase();
        match = subjectMatch && categoryMatch;
      } else if (mode === "topic") {
        const topicMatch =
          sub.topicId === currentActiveId ||
          sub.id === currentActiveId ||
          sub._id === currentActiveId;

        const parentSubjectId = Object.keys(saved?.topics || {}).find((subId) =>
          saved.topics[subId].includes(currentActiveId)
        );

        const subjectMatch =
          parentSubjectId &&
          (sub.subjectId === parentSubjectId ||
            sub.id === parentSubjectId ||
            sub._id === parentSubjectId);

        const categoryMatch = sub.category === examType?.toUpperCase();
        match = (topicMatch || subjectMatch) && categoryMatch;
      }

      return match;
    });
  };

  // ✅ Update premium status whenever dependencies change
  useEffect(() => {
    const owns = checkIfCurrentContentPaid();
    setHasPremiumForCurrent(owns);
  }, [currentActiveId, saved, examType, activeSubscriptions]);

  const navigationItems = [
    { name: "Dashboard", path: "/user/dashboard" },
    { name: "Study", path: "" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatExpiry = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

      if (daysLeft < 0) return "Expired";
      if (daysLeft === 0) return "Expires today";
      if (daysLeft === 1) return "1 day left";
      if (daysLeft <= 7) return `${daysLeft} days left`;

      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  /* ===============================
     SKELETON NAV
  =============================== */
  if (!ready) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b">
        <div className="mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-300 rounded animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-28 bg-gray-300 rounded animate-pulse" />
              <div className="h-2 w-36 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  /* ============================
     MAIN NAV
  =============================== */
  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999999] bg-white dark:bg-gray-800 shadow border-b">
      <div className="mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Logo Section */}
            <div className="flex items-center border-r-2 pr-2 md:pr-6 dark:border-gray-700">
              <Link to="/" className="flex items-center gap-3">
                <img src={Logo} alt="Fillop Tech" width={32} height={32} className="flex-shrink-0" />
                <div>
                  <span className="md:text-2xl font-semibold text-primary duration-200">
                    Fillop Tech
                  </span>
                  <p className="text-[7.5px] text-destructive/100 dark:text-red-500">
                    Building skills, powering solutions..
                  </p>
                </div>
              </Link>
            </div>

            {/* Exam Info */}
            <div>
              <p className="text-[11px] font-semibold text-red-500">{studyMode} Mode</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{examType}</p>
            </div>

            {/* Premium / Subscribe Badge (Desktop) */}
            {hasPremiumForCurrent ? (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-full">
                <Crown className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">Premium</span>
                  {expiresAt && (
                    <>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                          {formatExpiry(expiresAt)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/checkout"
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-full hover:shadow-md transition-all"
              >
                <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Subscribe</span>
              </Link>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2">
           <Avatar className="h-8 w-8">
            <AvatarImage
                src={user?.passportPhotoUrl || "/placeholder.svg?height=32&width=32"}
                alt={`${user?.firstName || "User"} profile photo`}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.firstName || "User"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:block text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>

            <button onClick={() => setIsMenuOpen((p) => !p)} className="md:hidden">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-2 dark:border-gray-700">
            <div className="px-3 py-2 mb-2">
              {hasPremiumForCurrent ? (
                <div className="px-3 py-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                      Premium Active
                    </p>
                  </div>

                  {currentActiveId && (
                    <div className="space-y-1 mt-2">
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                        Current {saved?.mode} has Premium access
                      </p>
                    </div>
                  )}

                  {expiresAt && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">{formatExpiry(expiresAt)}</p>
                  )}
                </div>
              ) : (
                <Link
                  to="/checkout"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
                >
                  <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Subscribe Now</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Get unlimited access to this {saved?.mode || "content"}
                    </p>
                  </div>
                </Link>
              )}
            </div>

            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
