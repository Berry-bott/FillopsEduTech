import { Link } from "react-router-dom"
import { ArrowLeft, Cookie, ShieldCheck } from "lucide-react"
import { CookiePolicySummary } from "@/components/CookieConsent"

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <div className="flex items-center gap-3">
          <Cookie className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold">Fillop Tech Ltd Cookie Policy</h1>
        </div>
        <div className="mt-3 space-y-1 text-sm text-slate-500 dark:text-slate-400">
          <p>Effective Date: November, 2025</p>
          <p>Last Updated: November, 2025</p>
        </div>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <CookiePolicySummary />

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">1. Introduction</h2>
            <p className="mt-2">Fillop Tech Ltd ("FillopTech", "we", "our", or "us") uses cookies and similar technologies to improve user experience, enhance website functionality, analyze website usage, and provide personalized services across our platforms, including FillopTech, Fillop Study Platform, Fillop Marketplace, Fillop Research Hub, Fillop CBT Guru, and related services.</p>
            <p className="mt-2">This Cookie Policy explains what cookies are, how we use them, and the choices available to you regarding their use.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">2. How We Collect Information</h2>
            <p className="mt-2">We use cookies, web beacons, tracking pixels, scripts, and similar technologies ("Data Collection Tools") to collect information about how users interact with our websites and services.</p>
            <p className="mt-2">These technologies help us:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Remember your preferences and settings.</li>
              <li>Improve website performance and functionality.</li>
              <li>Understand how visitors use our services.</li>
              <li>Secure user accounts and prevent fraud.</li>
              <li>Deliver relevant content and advertisements.</li>
              <li>Support social media sharing features.</li>
            </ul>
            <p className="mt-2">Some of these technologies may automatically collect information about your device, browser, usage patterns, and approximate location while using our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">3. What Are Cookies?</h2>
            <p className="mt-2">Cookies are small text files stored on your computer, smartphone, tablet, or other device when you visit a website. Cookies help websites recognize your device and remember information about your visit.</p>
            <p className="mt-2">Cookies may be temporary (session cookies) or remain on your device after you leave the website (persistent cookies).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">4. Types of Cookies We Use</h2>
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Strictly Necessary Cookies</h3>
            <p className="mt-2">These cookies are essential for the operation of our services. They help us:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Authenticate users and maintain login sessions.</li>
              <li>Secure user accounts.</li>
              <li>Protect against unauthorized access and fraudulent activities.</li>
              <li>Enable access to restricted areas of the platform.</li>
              <li>Ensure the proper functioning of our services.</li>
            </ul>
            <p className="mt-2">Without these cookies, certain parts of our websites and applications may not function correctly.</p>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Functional Cookies</h3>
            <p className="mt-2">These cookies improve your experience by remembering your preferences and settings.</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Save display and interface preferences.</li>
              <li>Personalize content based on your interests.</li>
              <li>Remember accessibility settings.</li>
              <li>Improve user convenience across sessions.</li>
            </ul>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Performance and Analytics Cookies</h3>
            <p className="mt-2">These cookies help us understand how visitors interact with our services and allow us to improve performance.</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Monitor website traffic.</li>
              <li>Analyze user behavior and engagement.</li>
              <li>Measure page performance.</li>
              <li>Identify technical issues.</li>
              <li>Evaluate the effectiveness of features and content.</li>
              <li>Track email open rates and delivery performance.</li>
            </ul>
            <p className="mt-2">We may use analytics services such as Google Analytics and other approved analytics providers for these purposes.</p>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Advertising Cookies</h3>
            <p className="mt-2">These cookies help us provide relevant advertisements and marketing communications. They may be used to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Display personalized advertisements.</li>
              <li>Measure advertising effectiveness.</li>
              <li>Limit repeated advertisement displays.</li>
              <li>Understand user interests and preferences.</li>
              <li>Support remarketing and promotional campaigns.</li>
            </ul>
            <p className="mt-2">Advertising cookies may be placed by FillopTech or trusted third-party advertising partners.</p>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Social Media Cookies</h3>
            <p className="mt-2">These cookies support social media features and integrations. They may allow users to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Share content on social networks.</li>
              <li>Interact with social media widgets.</li>
              <li>Connect accounts with social media platforms.</li>
            </ul>
            <p className="mt-2">These cookies may also be used by social media providers to track interactions across different websites.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">5. Why We Use Cookies</h2>
            <p className="mt-2">We use cookies and similar technologies to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Operate and secure our platforms.</li>
              <li>Improve user experience.</li>
              <li>Deliver educational content effectively.</li>
              <li>Provide personalized services.</li>
              <li>Analyze website usage and trends.</li>
              <li>Enhance platform functionality.</li>
              <li>Monitor service performance.</li>
              <li>Support customer service and technical support.</li>
              <li>Conduct research and analytics.</li>
              <li>Improve marketing and communication efforts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">6. Third-Party Services</h2>
            <p className="mt-2">Some cookies may be placed by trusted third-party providers who support our operations, including:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Analytics providers</li>
              <li>Payment processors</li>
              <li>Advertising partners</li>
              <li>Social media platforms</li>
              <li>Security and fraud prevention services</li>
              <li>Cloud hosting and infrastructure providers</li>
            </ul>
            <p className="mt-2">These third parties may collect information in accordance with their own privacy policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">7. Managing Your Cookie Preferences</h2>
            <p className="mt-2">You may control or disable cookies through your browser settings.</p>
            <p className="mt-2">Most web browsers allow you to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>View stored cookies.</li>
              <li>Delete existing cookies.</li>
              <li>Block specific cookies.</li>
              <li>Block all cookies.</li>
              <li>Receive notifications before cookies are stored.</li>
            </ul>
            <p className="mt-2">Please note that disabling cookies may affect the functionality of some parts of our services and may limit your ability to access certain features.</p>
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Choosing to Decline</h3>
            <p className="mt-2">When the cookie consent prompt appears, you can decline cookies by clicking the <strong>X</strong> button in the top-right corner (or the "Decline cookies" link). Declining records your choice and lets you continue to sign in without agreeing to non-essential cookies.</p>
            <p className="mt-2">You can change your decision at any time by clearing your browser cookies or updating your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">8. Updates to This Cookie Policy</h2>
            <p className="mt-2">Fillop Tech Ltd may update this Cookie Policy periodically to reflect changes in technology, legal requirements, or our business operations.</p>
            <p className="mt-2">Any updates will be published on our website with a revised "Last Updated" date.</p>
          </section>

          <p className="border-t border-slate-200 pt-6 font-medium dark:border-slate-700">By continuing to use Fillop Services, you acknowledge and agree to the use of cookies and similar technologies as described in this Cookie Policy.</p>
        </div>

        <div className="mt-8 flex items-center gap-2 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Essential authentication and security cookies only.
        </div>
      </article>
    </main>
  )
}
