import { useEffect, useState } from "react"
import { Cookie, ExternalLink, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"

export const COOKIE_CONSENT_KEY = "cbt-cookie-consent"
export const COOKIE_CONSENT_LAST_KEY = "cbt-cookie-consent-last-shown"

// Only an explicit "accepted" counts — declining keeps the prompt coming
// back once a day until the user genuinely accepts..
export function isAccepted() {
  return typeof window !== "undefined" && localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted"
}

export function acceptCookies() {
  localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
}

export function declineCookies() {
  localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
}

export function hasCookieConsent() {
  return typeof window !== "undefined" && localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted"
}

export default function CookieConsent({ onAccepted, onDeclined, variant = "modal" }) {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (variant === "toast") {
      // Dashboard toast: random timer, once a day, until accepted..
      if (isAccepted()) return
      const last = Number(localStorage.getItem(COOKIE_CONSENT_LAST_KEY) || 0)
      if (Date.now() - last < 86400000) return
      const delay = Math.min(3600000, 8000 + (Date.now() % 3600000))  // random 8s-1h
      const t = setTimeout(() => {
        setOpen(true)
        localStorage.setItem(COOKIE_CONSENT_LAST_KEY, String(Date.now()))
      }, delay)
      return () => clearTimeout(t)
    }
    setOpen(!hasCookieConsent())
  }, [variant])

  const accept = () => {
    if (!checked) return
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setOpen(false)
    onAccepted?.()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-full bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cookies & Privacy</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              We use essential cookies to keep you signed in, protect your account,and remember your preferences.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-indigo-600"
          />
          <span>
            I understand and agree to the use of essential cookies. Read our{" "}
            <Link to="/cookies" target="_blank" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Cookie Policy
            </Link>
            .
          </span>
        </label>

        <button
          type="button"
          onClick={accept}
          disabled={!checked}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to login
        </button>
      </div>
    </div>
  )
}

export function CookiePolicySummary() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
      <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-semibold">Essential cookies only</p>
        <p className="mt-1 text-sm">Cookies are used for authentication, security, and preferences. We do not use them to store payment card details.</p>
      </div>
    </div>
  )
}

