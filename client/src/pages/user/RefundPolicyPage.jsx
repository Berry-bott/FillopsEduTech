import React, { useEffect, useState } from "react";

// ─── Mini TOC for Refund Policy ────────────────────────────────────────────────
const RefundTOC = [
  { id: "introduction",          label: "Introduction" },
  { id: "one-time-purchases",    label: "1. One-time Purchases" },
  { id: "subscription-plans",    label: "2. Subscription Plans" },
  { id: "degree-programs",       label: "3. Diploma, Degree & Certificate Programs" },
  { id: "other-paid-services",   label: "4. Other Paid Services" },
  { id: "processing-refunds",    label: "5. Processing & Timing" },
  { id: "contact",               label: "Contact Us" },
];

// ─── Scroll helper ─────────────────────────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

// ─── Reusable components ───────────────────────────────────────────────────────
function Section({ id, title, numbered, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-10">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {numbered && <span className="text-indigo-600 dark:text-indigo-400 mr-1">{numbered}.</span>}
        {title}
      </h2>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

function PolicyHeader({ id, title, effective }) {
  return (
    <div id={id} className="scroll-mt-24 mb-6 mt-12 p-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl">
      <h2 className="text-xl font-black text-indigo-800 dark:text-indigo-200">{title}</h2>
      <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">Effective: {effective}</p>
    </div>
  );
}

function Alert({ children }) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-3 text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
      {children}
    </div>
  );
}

// ─── Main Refund Policy Page ───────────────────────────────────────────────────
export default function RefundPolicyPage() {
  const [activeId, setActiveId] = useState("");
  const [tocOpen, setTocOpen] = useState(false);

  // Handle direct hash links & browser back/forward
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        scrollTo(hash);
        setActiveId(hash);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Intersection observer for active TOC highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    RefundTOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

      {/* ── Top Banner ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-black text-gray-900 dark:text-white">Refund & Cancellation Policy</h1>
            <p className="text-xs text-gray-400">Effective: November 1, 2025 · Fillop Tech Ltd.</p>
          </div>
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="lg:hidden text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold"
          >
            {tocOpen ? "Close" : "Sections"}
          </button>
        </div>

        {/* Mobile TOC */}
        {tocOpen && (
          <div className="lg:hidden mt-2 max-h-60 overflow-y-auto border-t border-gray-200 dark:border-gray-800 pt-2 pb-1 space-y-0.5">
            {RefundTOC.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { scrollTo(id); setTocOpen(false); }}
                className={`block w-full text-left text-xs px-3 py-1.5 rounded-lg transition-all ${
                  activeId === id
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">

        {/* ── Sidebar TOC (desktop) ── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 max-h-[calc(100vh-96px)] overflow-y-auto">
            <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Contents</p>
            <nav className="space-y-0.5">
              {RefundTOC.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-all ${
                    activeId === id
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 lg:p-10">

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            At Filloptech, we strive to ensure a fair and transparent refund process. This Refund & Cancellation Policy explains when and how refunds may be issued. Please read it carefully.
          </p>

          <PolicyHeader id="introduction" title="Refund & Cancellation Policy" effective="November 1, 2025" />

          <Section id="one-time-purchases" numbered="1" title="One-time Purchases">
            <p><strong>Guided Projects, Mini Projects & Assessments:</strong> No refunds are offered after purchase or activation.</p>
            <p><strong>Individual Courses (one-time payment):</strong> You may request a full refund if you cancel within <strong>24 hours</strong> of purchase and have not substantially accessed the course content (more than 10% completion or certificate download). Requests after 24 hours are not eligible for refund.</p>
            <p><strong>Software Licenses & Digital Downloads:</strong> No refunds once the product is activated or downloaded.</p>
          </Section>

          <Section id="subscription-plans" numbered="2" title="Subscription Plans">
            <p>Filloptech offers a <strong>3-day risk-free trial</strong> for new subscriptions. You will not be charged during this period, and no certificates can be earned.</p>
            <p>After the trial, subscriptions automatically renew monthly or annually (depending on your plan) unless cancelled.</p>

            <div className="mt-4">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Refund Eligibility</h3>
              <ul className="list-none space-y-1.5 ml-0">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  <span>Full refund within the 3-day trial period (before first charge)</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                  <span>Partial / pro-rated refunds are not offered after the trial period except where required by law</span>
                </li>
              </ul>
            </div>

            <p className="mt-4">
              To cancel your subscription and avoid future charges, go to your account → Subscription settings or contact support before your next billing date.
            </p>
          </Section>

          <Section id="degree-programs" numbered="3" title="Diploma, Degree & University Certificate Programs">
            <p>Refund, cancellation, and withdrawal policies for these programs are determined and administered solely by the partnering Content Provider (university, polytechnic, or institution).</p>
            <p>Filloptech acts only as a platform facilitator and does not set or process refunds for these programs. Please refer to the specific program handbook or contact the institution directly.</p>
          </Section>

          <Section id="other-paid-services" numbered="4" title="Other Paid Services">
            <p>Services such as premium support packages, coaching sessions, event tickets, or partner offerings follow the refund policy stated at the time of purchase or as defined by the service provider.</p>
            <p>Unless explicitly stated otherwise, these are non-refundable after confirmation or delivery.</p>
          </Section>

          <Section id="processing-refunds" numbered="5" title="Processing & Timing">
            <Alert>
              Approved refunds are processed to the original payment method within <strong>7–10 business days</strong>. Processing time may vary depending on your bank or payment provider.
            </Alert>
            <p className="mt-3">Refunds are issued at Filloptech’s sole discretion unless required by applicable consumer protection law in your jurisdiction.</p>
          </Section>

          <Section id="contact" title="Questions or Refund Requests">
            <p>If you believe you are eligible for a refund or have any questions about this policy, please contact us at:</p>
            <p className="font-medium">Email: <strong>help@filloptech.com</strong></p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Include your account email, order/subscription ID, and a clear description of your request.
            </p>
          </Section>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Fillop Tech Ltd. · Lagos & Akwa Ibom, Nigeria · RC No. 8402349</p>
            <p className="text-xs text-gray-400 mt-1">
              Questions? Contact us at <strong>help@filloptech.com</strong>
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}