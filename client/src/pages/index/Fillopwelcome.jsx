import { useState, useEffect } from "react";
import TutorGuide  from  "../../assets/images/tutor-guide.jpeg"

function SunIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
    </svg>
  );
}

export default function FillopWelcome() {
  const [dark, setDark] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={dark ? "dark" : ""}>

      <div className="min-h-screen ff-body bg-white dark:bg-[#0c0c12] text-gray-900 dark:text-[#f0ebe3] transition-colors duration-300">

        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-white/[0.06] bg-white/80 dark:bg-[#0c0c12]/80 backdrop-blur-lg">
          <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">

            </div>
            <button
              onClick={() => setDark(d => !d)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-primary-hover hover:text-primary-hover dark:hover:text-primary-hover transition-all"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-5 py-14 pb-24">

          {/* Title */}
          {visible && (
            <div className="au d1 mb-10">

              <h1 className="ff-display font-black text-[clamp(32px,6vw,48px)] leading-[1.08] tracking-tight">
                Tutor Operational <span className="text-primary">Guide</span>
              </h1>
            </div>
          )}

          {/* Content blocks */}
          {visible && (
            <div className="space-y-6 text-[15px] leading-[1.8] text-gray-600 dark:text-gray-300">

              {/* Intro */}
              <p className="au d2">
                The <strong className="text-gray-900 dark:text-white font-semibold">Fillop Study Platform</strong>, developed and managed by FillopTech Limited, is a structured digital learning and examination preparation system designed to support students preparing for{" "}
                <span className="inline-flex flex-wrap gap-1.5 mx-0.5">
                  {["WAEC","NECO","JAMB","PUTME"].map(e => (
                    <span key={e} className="px-2 py-0.5 rounded-md bg-primary dark:bg-primary-hover/20 border
                     border-primary-hover dark:border-primary-hover/40 text-white dark:text-primary-hover text-xs font-semibold ff-body">{e}</span>
                  ))}
                </span>.{" "}
                The platform empowers qualified tutors to create structured academic content based on syllabus, set subscription pricing, and earn revenue transparently while helping students learn effectively through detailed explanations and guided study.
              </p>

              {/* Divider */}
              <div className="au d3 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.07] to-transparent" />

              {/* Registration */}
              <div className="au d3 rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="ff-display font-bold text-base text-gray-800 dark:text-gray-100">Tutor Registration and Approval Process</span>
                </div>
                <p className="font-bold">Step 1: Tutor Registration  Request</p>
                <p className="mb-3">
                  Prospective tutors must first submit a registration request to FillopTech Limited for review, including their full name, email address, phone number, area(s) of specialization, academic qualifications, and teaching experience.
                </p>
                <p className="mb-3">
                  The platform administrator evaluates the tutor's credentials to ensure quality standards are maintained. Once approved, the Admin creates a tutor account, generates a username and temporary password, and sends these login details directly to the tutor's registered email address.
                </p>
                <p>
                  This ensures <strong className="text-gray-800 dark:text-gray-100 font-semibold">centralized account control</strong> and platform integrity.
                </p>
              </div>

              {/* Divider */}
              <div className="au d4 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.07] to-transparent" />

              {/* Login & Security */}
              <div className="au d4 rounded-2xl border border-indigo-100 dark:border-indigo-700/25 bg-gray-50/50 dark:bg-indigo-950/20 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="ff-display font-bold text-base text-gray-800 dark:text-gray-100">First-Time Login & Password Change</span>
                </div>
                <p className="mb-3">
                  Upon receiving login credentials, the tutor must log in to the Fillop Study Platform and <strong className="text-gray-800 dark:text-gray-100 font-semibold">immediately change the temporary password</strong> to a secure personal password. Changing the password is mandatory and ensures account security and data protection.
                </p>
                <p>
                  Security guidelines: use at least 8 characters, combine uppercase, lowercase, numbers, and symbols, and <strong className="text-gray-800 dark:text-gray-100 font-semibold">do not share login credentials</strong> with anyone.
                </p>
              </div>

              {/* Divider */}
              <div className="au d5 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.07] to-transparent" />

              {/* Dashboard */}
              <div className="au d5 rounded-2xl border border-gray-100 dark:border-rose-700/25 bg-gray-50/50 dark:bg-rose-950/20 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="ff-display font-bold text-base text-gray-800 dark:text-gray-100">Tutor Dashboard Overview</span>
                </div>
                <p className="mb-3">
                  After successful login, the tutor gains access to a personalized dashboard — the tutor's command center — which includes: Subject Management, Question Bank Management, Subscription Settings, Revenue Tracking, Student Subscription Overview, Account Settings, and Support, chats and advert.
                </p>
                <p>
                  Tutors are authorized to create subjects under approved examination categories (WAEC, NECO, JAMB, PUTME). Each subject should include a title, detailed description, topics covered, target class level, learning outcomes, and exam focus areas. 
                  <strong className="text-gray-600 dark:text-gray-400 italic font-semibold">Well-structured subjects attract more subscriptions.</strong>
                </p>
              </div>

              {/* Divider */}
              <div className="au d6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.07] to-transparent" />

              {/* Revenue */}
              <div className="au d6 rounded-2xl border border-emerald-100 dark:border-emerald-700/25 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="ff-display font-bold text-base text-gray-800 dark:text-gray-100">Subscription Pricing & Revenue</span>
                </div>
                <p className="mb-3">
                  Tutors are allowed to set pricing for each subject in accordance with FillopTech Limited's pricing terms. Available options include Monthly Subscription, Yearly Subscription at a reduced rate, and Premium Subscription giving access to all subjects forever. Prices must remain within the company's approved range.
                </p>
                <p className="mb-3">
                  Every subscription payment is automatically recorded in the tutor's dashboard, displaying number of active subscribers, total revenue per subject, monthly earnings summary, and overall lifetime revenue.
                </p>
                <p>
                  Tutors earn <strong className="  font-semibold">60% of all subscription payments</strong> generated from their subjects. Tutors can monitor their earnings in real-time and are advised to review payout policies carefully.
                </p>
              </div>

              {/* Divider */}
              <div className="au d7 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.07] to-transparent" />

              {/* Closing */}
              <p className="au d7  text-base text-gray-500 dark:text-gray-400 italic">
                The Fillop Study Platform provides tutors with secure onboarding, structured content creation tools, a subscription-based revenue model, transparent earnings tracking, and long-term digital teaching opportunities.{" "}
                {/* <span className="text-primary-hover not-italic font-semibold"></span>  */}
              </p>
              <p className="font-bold ">Welcome to Fillop Study Hub.</p>

              {/* Image container */}
              <div className="au d8 mt-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02] overflow-hidden">
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-600">

                  <img src={TutorGuide} alt="" className="h-full" />
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          {visible && <div className="au d7 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/[0.07] to-transparent my-10" />}

          {/* Agreement + CTA */}
          {visible && (
            <div className="au d8 text-center">
              <label className="inline-flex items-start gap-3 cursor-pointer group mb-7 max-w-sm text-left">
                <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <div className={`w-5 h-5 mt-0.5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-200
                  ${agreed
                    ? "bg-primary-hover border-primary-hover text-white"
                    : "border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 group-hover:border-primary-hover"}`}>
                  {agreed && <CheckIcon />}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  I have read and agree to the{" "}
                  <span className="text-primary-hover font-semibold">Terms of Use</span>,{" "}
                  <span className="text-primary-hover font-semibold">Privacy Policy</span>, and{" "}
                  <span className="text-primary-hover font-semibold">End User Agreement</span>
                </span>
              </label>

              <div>
                <button
                  disabled={!agreed}
                  onClick={() => window.location.href = "/tutor/register"}
                  className={`px-10 py-4 rounded-xl ff-display font-bold text-[15px] tracking-wide transition-all duration-200
                    ${agreed
                      ? "bg-primary text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 cursor-pointer"
                      : "bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 cursor-not-allowed"}`}>
                  Get Started with Fillop →
                </button>
              </div>

              <p className="text-md text-gray-700 dark:text-gray-700 mt-4 ff-body">
                By continuing, you confirm you've read and understood all the above
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}