import React from "react";
import { useEffect, useState, useRef } from "react";





// ─── Table of Contents Data ────────────────────────────────────────────────────
const TOC = [
  { id: "using-filloptech",        label: "1. Using Filloptech" },
  { id: "content-offerings",       label: "2. Content Offerings" },
  { id: "your-content",            label: "3. Your Content" },
  { id: "security",                label: "4. Security" },
  { id: "third-party-content",     label: "5. Third Party Content" },
  { id: "copyright-trademark",     label: "6. Copyright and Trademark" },
  { id: "education-research",      label: "7. Education Research" },
  { id: "paid-services",           label: "8. Paid Services" },
  { id: "modifying-services",      label: "9. Modifying or Terminating Services" },
  { id: "disclaimers",             label: "10. Disclaimers" },
  { id: "limitation-liability",    label: "11. Limitation of Liability" },
  { id: "export-controls",         label: "12. Export Controls" },
  { id: "indemnification",         label: "13. Indemnification" },
  { id: "governing-law",           label: "14. Governing Law and Venue" },
  { id: "binding-arbitration",     label: "15. Binding Arbitration & Class Action Waiver" },
  { id: "general-terms",           label: "16. General Terms" },
  { id: "referenced-policies",     label: "17. Referenced Policies" },
  { id: "acceptable-use",          label: "→ Acceptable Use Policy" },
  { id: "copyright-policy",        label: "→ Copyright & Trademark Policy" },
  { id: "refund-policy",           label: "→ Refund & Cancellation Policy" },
  { id: "honor-code",              label: "→ Honor Code" },
];

// ─── Scroll helper ─────────────────────────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
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

// ─── Sub section ───────────────────────────────────────────────────────────────
function SubSection({ title, children }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// ─── Bullet list ───────────────────────────────────────────────────────────────
function BulletList({ items }) {
  return (
    <ul className="list-none space-y-1.5 ml-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Alert box ─────────────────────────────────────────────────────────────────
function Alert({ children }) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-3 text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
      {children}
    </div>
  );
}

// ─── Policy section header ─────────────────────────────────────────────────────
function PolicyHeader({ id, title, effective }) {
  return (
    <div id={id} className="scroll-mt-24 mb-6 mt-12 p-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl">
      <h2 className="text-xl font-black text-indigo-800 dark:text-indigo-200">{title}</h2>
      <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">Effective: {effective}</p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function TermsOfUsePage() {

  const [activeId, setActiveId] = useState("");
  const [tocOpen, setTocOpen] = useState(false);


  useEffect(() => {
  const hash = window.location.hash?.replace("#", "");
  if (hash) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  }
}, []);

  // Highlight active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    TOC.forEach(({ id }) => {
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
            <h1 className="text-base font-black text-gray-900 dark:text-white">Terms of Use</h1>
            <p className="text-xs text-gray-400">Effective: November 1, 2025 · Fillop Tech Ltd.</p>
          </div>
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="lg:hidden text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold"
          >
            {tocOpen ? "Close" : "Sections"}
          </button>
        </div>

        {/* Mobile TOC dropdown */}
        {tocOpen && (
          <div className="lg:hidden mt-2 max-h-60 overflow-y-auto border-t border-gray-200 dark:border-gray-800 pt-2 pb-1 space-y-0.5">
            {TOC.map(({ id, label }) => (
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
              {TOC.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-all ${
                    activeId === id
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  } ${label.startsWith("→") ? "pl-5 text-indigo-500 dark:text-indigo-400" : ""}`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 lg:p-10">

          {/* Intro */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Thank you for being a part of Filloptech! These Terms of Use govern your use of our website, apps, and other products and services. By clicking "I accept" or using our Services, you agree to be bound by these Terms.
          </p>

          <Alert>
            THESE TERMS INCLUDE AN ARBITRATION AGREEMENT, JURY TRIAL WAIVER AND CLASS ACTION WAIVER. You will only be permitted to pursue disputes on an individual basis, and you are waiving your right to a jury trial. The terms of the arbitration agreement shall not apply if unenforceable under the laws of Nigeria or the country in which you reside.
          </Alert>

          <div className="mt-8 space-y-0">

            {/* 1 */}
            <Section id="using-filloptech" numbered="1" title="Using Filloptech">
              <SubSection title="Who May Use Our Services">
                <p>Any use or access by anyone under the age of 13 is strictly prohibited. You may use our Services only if you:</p>
                <BulletList items={[
                  "Can form a binding contract with Filloptech;",
                  "Comply with these Terms, all applicable laws, and our policies (including the Acceptable Use Policy, Honor Code, and any other applicable policies);",
                  "Are over the age at which you can provide consent to data processing under the laws of Nigeria or any country you reside.",
                ]} />
                <p>Any violation of our Terms may result in your access being suspended, disabled, or terminated. When you create your account, you must provide accurate and complete information.</p>
              </SubSection>
              <SubSection title="Our License to You">
                <p>Subject to these Terms, we grant you a limited, personal, non-exclusive, non-transferable, and revocable license to use our Services for your personal, non-commercial use only. You agree to create and use only one user account unless expressly permitted by Filloptech.</p>
              </SubSection>
              <SubSection title="Commercial Use">
                <p>Any use of our Services for commercial purposes is strictly prohibited without a separate written agreement with Filloptech.</p>
              </SubSection>
            </Section>

            {/* 2 */}
            <Section id="content-offerings" numbered="2" title="Content Offerings">
              <SubSection title="Changes to Content Offerings">
                <p>Filloptech offers courses and content ("Content Offerings") from universities, Polytechnics and other providers. Filloptech reserves the right to cancel, interrupt, reschedule, or modify any Content Offerings at any time.</p>
              </SubSection>
              <SubSection title="No Academic Credit">
                <p>Filloptech does not grant academic credit for the completion of Content Offerings. Participation or completion does not confer any academic credit unless explicitly indicated by a credit-granting institution.</p>
              </SubSection>
              <SubSection title="Disclaimer of Student-Content Provider Relationship">
                <p>Unless otherwise described, nothing in these Terms establishes any relationship between you and any Content Provider, enrolls you in any institution, or entitles you to use the resources of any Content Provider institution beyond participation in the Content Offering.</p>
              </SubSection>
            </Section>

            {/* 3 */}
            <Section id="your-content" numbered="3" title="Your Content">
              <SubSection title="User Content">
                <p>The Services enable you to share content such as homework, quizzes, exams, projects, forum posts, and more ("User Content"). You retain all intellectual property rights in the User Content you create and share.</p>
              </SubSection>
              <SubSection title="How Filloptech and Others May Use User Content">
                <p>By providing User Content, you grant Filloptech a fully-transferable, royalty-free, perpetual, sublicensable, non-exclusive, worldwide license to copy, distribute, modify, create derivative works based on, publicly perform, display, and otherwise use the User Content. We reserve the right to remove or modify User Content for any reason, including content that violates these Terms.</p>
              </SubSection>
              <SubSection title="Feedback">
                <p>By submitting any Feedback (suggestions, ideas, comments), you grant us the right to use it without restriction or compensation to you.</p>
              </SubSection>
            </Section>

            {/* 4 */}
            <Section id="security" numbered="4" title="Security">
              <p>We care about the security of our users. While we work to protect your account, Filloptech cannot guarantee that unauthorized third parties will not be able to defeat our security measures. Please notify us immediately of any compromise or unauthorized use of your account by emailing <strong>help@filloptech.com</strong>.</p>
            </Section>

            {/* 5 */}
            <Section id="third-party-content" numbered="5" title="Third Party Content">
              <p>Through the Services, you may access content provided by instructors, other users, and/or other third parties. Filloptech cannot guarantee that such third party content will be free of material you may find objectionable, or of malware or other contaminants. Filloptech disclaims any responsibility related to your access or use of such third party content.</p>
            </Section>

            {/* 6 */}
            <Section id="copyright-trademark" numbered="6" title="Copyright and Trademark">
              <p>Filloptech respects the intellectual property rights of our users, Content Providers, and other third parties and expects our users to do the same. We have adopted and implemented the Filloptech Copyright and Trademark Policy in accordance with applicable law, including the Nigerian Copyright Act 2022.</p>
            </Section>

            {/* 7 */}
            <Section id="education-research" numbered="7" title="Education Research">
              <p>Filloptech is committed to advancing the science of learning and teaching. Records of your participation in courses may be used for education research. Research findings will typically be reported at the aggregate level. Your personal identity will not be publicly disclosed without your express consent.</p>
            </Section>

            {/* 8 */}
            <Section id="paid-services" numbered="8" title="Paid Services from Filloptech">
              <p>Filloptech offers paid Services for a fee. You are responsible for paying all fees and applicable taxes in a timely manner. Fees may vary based on your location, and Filloptech reserves the right to change any fees at any time. Refunds may be available as described in our Refund Policy.</p>
              <SubSection title="Degree, Diplomas and University Certificate Programs">
                <p>Our Content Providers serve as the distance education providers of these programs and determine admissions, refund, and graduation policies. Tuition and fees may vary and Filloptech reserves the right to change these for future semesters. Filloptech does not guarantee licensure, certification or qualification for any profession based on completion of a Content Offering.</p>
              </SubSection>
            </Section>

            {/* 9 */}
            <Section id="modifying-services" numbered="9" title="Modifying or Terminating our Services">
              <p>We are constantly changing and improving our Services. We may add or remove functions and features, and we may suspend or stop part of our Services altogether. Filloptech may terminate your use of any Service for any reason. You can stop using our Services at any time.</p>
            </Section>

            {/* 10 */}
            <Section id="disclaimers" numbered="10" title="Disclaimers">
              <Alert>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICES AND ALL INCLUDED CONTENT ARE PROVIDED ON AN "AS IS" BASIS WITHOUT WARRANTY OF ANY KIND. THE FILLOPTECH PARTIES SPECIFICALLY DISCLAIM ANY AND ALL WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. YOUR ACCESS TO OR USE OF THE SERVICES IS AT YOUR OWN RISK.
              </Alert>
            </Section>

            {/* 11 */}
            <Section id="limitation-liability" numbered="11" title="Limitation of Liability">
              <Alert>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FILLOPTECH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES. IN NO EVENT SHALL FILLOPTECH'S AGGREGATE LIABILITY EXCEED TEN U.S. DOLLARS ($10) OR THE TOTAL AMOUNT OF FEES RECEIVED FROM YOU DURING THE PAST SIX MONTHS, WHICHEVER IS GREATER.
              </Alert>
              <p>You agree that any cause of action related to the Services must commence within one (1) year after the cause of action accrues. Otherwise, such cause of action is permanently barred.</p>
            </Section>

            {/* 12 */}
            <Section id="export-controls" numbered="12" title="Export Controls">
              <p>By using our Services, you warrant that you are not located in, under the control of, or a national of any country subject to applicable Nigerian laws preventing Filloptech from providing you access to the Services. Use of VPN services for the purpose of circumventing these laws is strictly prohibited.</p>
              <p>You also warrant that you are not named on any government prohibited, denied, or sanctions list. You will immediately discontinue use of the Services if you are placed on any such list.</p>
            </Section>

            {/* 13 */}
            <Section id="indemnification" numbered="13" title="Indemnification">
              <p>You agree to indemnify, defend, and hold harmless Filloptech from any and all claims, liabilities, expenses, and damages, including reasonable attorneys' fees, made by any third party related to:</p>
              <BulletList items={[
                "Your use or attempted use of the Services in violation of these Terms;",
                "Your violation of any law or rights of any third party; or",
                "User Content, including any claim of infringement of intellectual property rights.",
              ]} />
            </Section>

            {/* 14 */}
            <Section id="governing-law" numbered="14" title="Governing Law and Venue">
              <p>The Services are managed by Fillop Tech Ltd., located in Lagos and Akwa Ibom, Nigeria. You agree that these Terms will be governed by the laws of Nigeria, excluding its conflicts of law provisions.</p>
              <p>For any dispute not subject to binding arbitration, you and Filloptech will submit to the personal jurisdiction of courts located in and serving Nigeria.</p>
            </Section>

            {/* 15 */}
            <Section id="binding-arbitration" numbered="15" title="Binding Arbitration and Class Action Waiver">
              <Alert>
                YOU AND FILLOPTECH HEREBY WAIVE ANY CONSTITUTIONAL AND STATUTORY RIGHTS TO SUE IN COURT AND HAVE A TRIAL IN FRONT OF A JUDGE OR A JURY. ALL CLAIMS SHALL BE RESOLVED BY ARBITRATION. EACH OF US MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN INDIVIDUAL BASIS — NOT ON A CLASS, REPRESENTATIVE, OR COLLECTIVE BASIS.
              </Alert>
              <p className="mt-3">You and Filloptech agree to submit to binding arbitration any and all disputes, claims, or controversies arising out of or relating to our Services or these Terms. Before filing an arbitration, you and we will try in good faith to informally resolve any claims.</p>
              <SubSection title="Notice of Dispute">
                <p>To start the dispute process, send a written notice ("Notice of Dispute") to <strong>report@filloptech.com</strong> that includes your name, phone number, username, email address, a description of the claim and how you'd like it resolved, and counsel contact information if applicable. Once received, the recipient has 60 days to investigate.</p>
              </SubSection>
              <SubSection title="Arbitration Process">
                <p>Arbitration will be conducted in accordance with the National Arbitration &amp; Mediation ("NAM") Comprehensive Dispute Resolution Rules and Procedures. Send arbitration requests to:</p>
                <BulletList items={[
                  "Mail: Fillop Tech Ltd, 44 Sanni Ogun, Ikot Ekpene, Nigeria",
                  "Email: report@filloptech.com",
                ]} />
              </SubSection>
            </Section>

            {/* 16 */}
            <Section id="general-terms" numbered="16" title="General Terms">
              <SubSection title="Revisions to the Terms">
                <p>We reserve the right to revise the Terms at our sole discretion at any time. Revisions will be effective immediately upon posting. Your continued use of the Services after publication of changes constitutes binding acceptance of the revised Terms.</p>
              </SubSection>
              <SubSection title="Severability; Waiver">
                <p>If it turns out that a particular provision of these Terms is not enforceable, this will not affect any other terms. If you do not comply with these Terms and we do not take immediate action, this does not indicate that we relinquish any rights.</p>
              </SubSection>
              <SubSection title="Content Providers">
                <p>Our Content Providers and integrated service providers are third party beneficiaries of the Terms and may enforce those provisions that relate to them.</p>
              </SubSection>
            </Section>

            {/* 17 */}
            <Section id="referenced-policies" numbered="17" title="Referenced Policies">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Acceptable Use Policy", id: "acceptable-use" },
                  { label: "Copyright & Trademark Policy", id: "copyright-policy" },
                  { label: "Refund Policy", id: "refund-policy" },
                  { label: "Honour Code", id: "honor-code" },
                ].map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="text-left text-xs bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition font-semibold"
                  >
                    → {label}
                  </button>
                ))}
              </div>
            </Section>

            {/* ── ACCEPTABLE USE POLICY ── */}
            <PolicyHeader id="acceptable-use" title="Acceptable Use Policy" effective="November 1, 2024" />
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 mb-10">
              <p>Our mission is to provide universal access to the world's best education. We believe in preserving free speech and expression, and academic freedom. We also want all users and instructors to feel safe and comfortable while using our Services.</p>
              <SubSection title="1. You are prohibited from using our Services to share content that:">
                <BulletList items={[
                  "Contains illegal content or promotes illegal activities with the intent to commit such activities.",
                  "Contains credible threats or organizes acts of real-world violence.",
                  "Harasses others. Abusive or otherwise inappropriate content directed at private individuals is not allowed.",
                  "Violates intellectual property, privacy, or other rights.",
                  "Spams others with irrelevant or inappropriate advertising or promotional content.",
                  "Otherwise violates the Filloptech Terms of Use.",
                ]} />
              </SubSection>
              <SubSection title="2. You also aren't allowed to:">
                <BulletList items={[
                  "Do anything that violates local, state, national, or international law.",
                  "Share your password or let anyone else access your account.",
                  "Attempt to access any other user's account.",
                  "Reproduce, transfer, sell, resell, or otherwise misuse any content from our Services.",
                  "Access, tamper with, or use non-public areas of our systems.",
                  "Break or circumvent our authentication or security measures.",
                  "Try to reverse engineer any portion of our Services.",
                  "Use our Services to distribute malware.",
                  "Impersonate or misrepresent your affiliation with any person or entity.",
                ]} />
              </SubSection>
              <SubSection title="3. Without prior written consent, you also aren't allowed to:">
                <BulletList items={[
                  "Visit or use our Services for any form of content, data, or text scraping through manual, mechanical, or automated means.",
                  "Use any content, data, or text for text or data mining purposes, or to develop or train any AI or machine learning models.",
                ]} />
              </SubSection>
            </div>

            {/* ── COPYRIGHT POLICY ── */}
            <PolicyHeader id="copyright-policy" title="Copyright and Trademark Policy" effective="November 1, 2025" />
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 mb-10">
              <p>Filloptech respects the intellectual property rights of Content Providers, instructors, users, and other third parties. We reserve the right to suspend, disable, or terminate accounts of users who repeatedly infringe copyrights, trademarks, or other intellectual property rights.</p>
              <p>If you believe materials on the Filloptech platform infringe your copyright, please send a notice to us that includes:</p>
              <BulletList items={[
                "The physical or electronic signature of a person authorized to act on behalf of the copyright owner;",
                "Identification of the copyrighted work claimed to have been infringed;",
                "Identification of the material that is claimed to be infringing;",
                "Your name, address, telephone number, and email address;",
                "A statement that you have a good faith belief that the use is not authorized;",
                "A statement that the information in the notification is accurate.",
              ]} />
              <p>Notices can be sent to:</p>
              <BulletList items={[
                "Mail: Fillop Tech Ltd, 44 Sanni Ogun, Ikot Ekpene, Nigeria",
                "Email: report@filloptech.com",
              ]} />
            </div>

            {/* ── REFUND POLICY ── */}
            <PolicyHeader id="refund-policy" title="Refund and Cancellation Policy" effective="November 1, 2025" />
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 mb-10">
              <SubSection title="1. One-time Purchases">
                <p><strong>Guided Projects/Projects:</strong> Filloptech does not offer refunds for Guided Projects or any other projects.</p>
                <p><strong>Courses:</strong> For courses purchased with a one-time payment, you may receive a full refund if you cancel within 24 hours of payment. For software purchases, no refund will be made once the software is activated.</p>
              </SubSection>
              <SubSection title="2. Subscription Plans">
                <p>Filloptech offers a 3-day refund period for all subscription offerings. Certificates cannot be earned during the free trial. All subscriptions automatically renew unless cancelled.</p>
                <p>Refunds for subscription plans are not provided except where required by law, where you've upgraded and wish to cancel, or in limited cases explicitly stated by Filloptech.</p>
                <p><strong>Cancellation:</strong> For monthly subscriptions, cancel before the 3-day trial period ends to avoid being charged. Cancel under your account "Subscription" page or through Fillop Help Page.</p>
              </SubSection>
              <SubSection title="3. Diploma, Degree and University Certificate Programs">
                <p>Refund policies for these programs are set and administered by the content provider offering the program.</p>
              </SubSection>
              <SubSection title="4–7. Other Policies">
                <BulletList items={[
                  "Other Paid Services: Filloptech is not obligated to provide refunds for other paid services unless otherwise stated.",
                  "Third-Party Marketplaces: If purchased through a third-party marketplace, that marketplace's refund policy applies.",
                  "Promotional Offers: Eligibility is determined at Filloptech's sole discretion.",
                  "Price Changes: Filloptech reserves the right to change subscription plans or pricing at any time with advance notice.",
                ]} />
              </SubSection>
              <p className="text-xs text-gray-400">Please allow 7–10 business days for any applicable refund to be processed.</p>
            </div>

            {/* ── HONOR CODE ── */}
            <PolicyHeader id="honor-code" title="Honor Code" effective="November 1, 2025" />
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 mb-10">
              <p>All users are expected to abide by the following standards to ensure the integrity of learning within Filloptech learning experiences.</p>
              <SubSection title="Violations — Academic Misconduct Includes:">
                <BulletList items={[
                  "Plagiarism: Copying or reproducing words, ideas, or materials from another source without giving credit to the original author.",
                  "Use of Unauthorized Materials: Using unauthorized materials or devices including generative AI tools such as ChatGPT, unless expressly permitted.",
                  "Unauthorized Collaboration: Working together with any person on any work unless expressly permitted.",
                  "Contract Cheating: Paying or otherwise getting another person to create work for submission.",
                  "Impersonation: Completing work logged in as another user or having another user complete work logged in as you.",
                  "Unauthorized Sharing: Making solutions to homework, quizzes, exams, or other assessments available to anyone else.",
                  "Fraud: Any misrepresentation about authorship or conditions under which work was performed.",
                  "Other: Any behavior that confers an unfair advantage or dishonestly improves results.",
                ]} />
              </SubSection>
              <SubSection title="Consequences">
                <p><strong>Non-degree Products:</strong> Filloptech will determine relevant sanctions based on the kind of misconduct, severity, and any previous history. No refunds will be issued in the case of any corrective action. Honor Code violations are determined at the sole discretion of Filloptech.</p>
                <p><strong>Diploma and Degree Products:</strong> Consequences are at the sole discretion of the content provider.</p>
              </SubSection>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Fillop Tech Ltd. · Lagos & Akwa Ibom, Nigeria · RC No. 8402349</p>
            <p className="text-xs text-gray-400 mt-1">Questions? Contact us at <strong>help@filloptech.com</strong></p>
          </div>
        </main>
      </div>
    </div>
  );
}