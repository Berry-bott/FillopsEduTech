import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Menu, X, ChevronDown, ChevronRight, Search, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import fillopLogo from "../../assets/images/fillopsLogo.png";
import { ThemeToggle } from "../DashboardComponents/theme-toggle";

// ── Exam Links Config ─────────────────────────────────────────────────────────

const EXAM_LINKS = {
  WAEC: [
    { label: "Check Result", href: "https://www.waecdirect.org/" },
    { label: "Syllabus",     href: "https://waecsyllabus.com/" },
    { label: "Latest",       href: "https://www.waecdirect.org/" },
  ],
  NECO: [
    { label: "Check Result", href: "https://results.neco.gov.ng/" },
    { label: "Syllabus",     href: "https://syllabus2026.blog/neco-syllabus-2026-2027-for-all-subjects/" },
    { label: "Latest",       href: "https://results.neco.gov.ng/" },
  ],
  JAMB: [
    { label: "Login to CAPS", href: "https://efacility.jamb.gov.ng/" },
    { label: "Latest",        href: "https://jamb.gov.ng/" },
  ],
}

// Helper — opens external URL without React Router intercepting
const openExternal = (href) => window.open(href, "_blank", "noopener,noreferrer")

// ── In-Page Search Hook ───────────────────────────────────────────────────────

function useInPageSearch() {
  const [query, setQuery] = useState("")
  const [matchCount, setMatchCount] = useState(0)
  const [currentMatch, setCurrentMatch] = useState(0)
  const matchesRef = useRef([])

  const clearHighlights = useCallback(() => {
    document.querySelectorAll("mark[data-search-highlight]").forEach((mark) => {
      const parent = mark.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent), mark)
        parent.normalize()
      }
    })
    matchesRef.current = []
    setMatchCount(0)
    setCurrentMatch(0)
  }, [])

  function getTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT
        const tag = parent.tagName?.toLowerCase()
        if (["script", "style", "noscript", "input", "textarea", "select"].includes(tag))
          return NodeFilter.FILTER_REJECT
        if (parent.closest("header")) return NodeFilter.FILTER_REJECT
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    })
    const nodes = []
    let node
    while ((node = walker.nextNode())) nodes.push(node)
    return nodes
  }

  const highlight = useCallback((searchQuery) => {
    clearHighlights()
    const q = searchQuery.trim()
    if (!q || q.length < 2) return

    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const textNodes = getTextNodes(document.body)
    const newMatches = []

    textNodes.forEach((textNode) => {
      const text = textNode.textContent
      if (!regex.test(text)) return
      regex.lastIndex = 0

      const fragment = document.createDocumentFragment()
      let lastIndex = 0
      let match

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex)
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)))

        const mark = document.createElement("mark")
        mark.setAttribute("data-search-highlight", "true")
        mark.textContent = match[0]
        mark.style.cssText = "background:#fef08a;color:#1a1a1a;border-radius:2px;padding:0 1px;"
        fragment.appendChild(mark)
        newMatches.push(mark)
        lastIndex = match.index + match[0].length
      }

      if (lastIndex < text.length)
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)))

      textNode.parentNode.replaceChild(fragment, textNode)
    })

    matchesRef.current = newMatches
    setMatchCount(newMatches.length)
    if (newMatches.length > 0) { setCurrentMatch(1); scrollToMatch(newMatches[0]) }
  }, [clearHighlights])

  function scrollToMatch(el) {
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "center" })
    matchesRef.current.forEach((m) => {
      m.style.background = "#fef08a"; m.style.color = "#1a1a1a"; m.style.outline = "none"
    })
    el.style.background = "#f97316"
    el.style.color = "#fff"
    el.style.outline = "2px solid #ea580c"
    el.style.borderRadius = "3px"
  }

  function goToNext() {
    if (!matchesRef.current.length) return
    const next = currentMatch % matchesRef.current.length
    setCurrentMatch(next + 1)
    scrollToMatch(matchesRef.current[next])
  }

  function goToPrev() {
    if (!matchesRef.current.length) return
    const prev = (currentMatch - 2 + matchesRef.current.length) % matchesRef.current.length
    setCurrentMatch(prev + 1)
    scrollToMatch(matchesRef.current[prev])
  }

  useEffect(() => () => clearHighlights(), [clearHighlights])

  return { query, setQuery, matchCount, currentMatch, highlight, clearHighlights, goToNext, goToPrev }
}

// ── Search Bar ────────────────────────────────────────────────────────────────

function SearchBar({ className = "" }) {
  const inputRef    = useRef(null)
  const debounceRef = useRef(null)
  const { query, setQuery, matchCount, currentMatch, highlight, clearHighlights, goToNext, goToPrev } = useInPageSearch()

  function handleChange(e) {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { clearHighlights(); return }
    debounceRef.current = setTimeout(() => highlight(val), 300)
  }

  function handleClear() {
    setQuery(""); clearHighlights(); inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === "Enter")  { e.preventDefault(); e.shiftKey ? goToPrev() : goToNext() }
    if (e.key === "Escape") { handleClear(); inputRef.current?.blur() }
  }

  const hasResults = matchCount > 0
  const noResults  = query.trim().length >= 2 && matchCount === 0

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search on this page..."
          className={`w-full border rounded-2xl py-2 pl-10 pr-32 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:outline-none transition-all duration-300 ${
            noResults
              ? "border-red-300 focus:ring-red-200 text-red-600 dark:text-red-400"
              : "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary"
          }`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query.trim().length >= 2 && (
            <span className={`text-xs font-medium px-1.5 min-w-[42px] text-center ${noResults ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
              {noResults ? "0/0" : `${currentMatch}/${matchCount}`}
            </span>
          )}
          {hasResults && (
            <>
              <button onClick={goToPrev} title="Previous (Shift+Enter)" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={goToNext} title="Next (Enter)" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {query && (
            <button onClick={handleClear} title="Clear (Esc)" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {hasResults && (
        <p className="absolute -bottom-5 left-3 text-[10px] text-gray-400">
          Enter = next &nbsp;·&nbsp; Shift+Enter = prev &nbsp;·&nbsp; Esc = clear
        </p>
      )}
    </div>
  )
}

// ── Main Header ───────────────────────────────────────────────────────────────

const Header = () => {
  const navigate = useNavigate()
  const [isMenuOpen,     setIsMenuOpen]     = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeExam,     setActiveExam]     = useState(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-background backdrop-blur-sm border-b border-border dark:border-gray-700 shadow-boxShadow-elegant transition-colors duration-300">
      <div className="container mx-auto px-3 py-3">
        <div className="flex items-center justify-between">

          {/* ===== Logo ===== */}
          <div className="flex items-center">
            <img src={fillopLogo} alt="Fillop Logo" className="w-12 h-12 object-contain" />
            <div className="leading-none mx-4 md:ml-2">
              <p className="text-primary dark:text-primary text-xl md:text-[1rem] xmd:text-2xl lg:text-3xl font-extrabold">
                F<span>illop</span>Tech
              </p>
              <p className="text-[6px] md:text-[9px] text-education-orange dark:text-education-orange font-merriweather">
                Building skills, powering solutions...
              </p>
            </div>
          </div>

          <ThemeToggle />

          {/* ===== Desktop Search ===== */}
          <SearchBar className="hidden md:block w-full max-w-md mr-2 flex-1" />

          {/* ===== Desktop Nav ===== */}
          <nav className="hidden md:flex items-center space-x-6">

            {/* Blog */}
            <div className="relative group">
              <button
                onClick={() => navigate("/blog")}
                className="relative overflow-hidden text-sm text-Graphite dark:text-gray-100 font-medium h-6"
              >
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Blog</span>
                <span className="absolute left-0 top-full transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Blog</span>
              </button>
            </div>

            {/* Exams Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => { setIsDropdownOpen(false); setActiveExam(null) }}
            >
              <button className="relative overflow-hidden flex items-center text-Graphite dark:text-gray-100 font-medium hover:text-primary transition-smooth h-6">
                <span className="relative block">
                  <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Exams</span>
                  <span className="absolute left-0 top-full transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Exams</span>
                </span>
                <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <div className={`absolute left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg w-44 p-2 z-50 origin-top transition-all duration-300 ${
                isDropdownOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-0 -translate-y-4 pointer-events-none"
              }`}>
                {Object.keys(EXAM_LINKS).map((exam, index) => (
                  <div
                    key={exam}
                    className="relative group/item"
                    onMouseEnter={() => setActiveExam(exam)}
                    onMouseLeave={() => setActiveExam(null)}
                    style={{ transitionDelay: isDropdownOpen ? `${index * 50}ms` : "0ms" }}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white cursor-pointer transition-colors duration-300 rounded">
                      <div className="flex justify-between items-center">
                        <span>{exam}</span>
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/item:translate-x-1" />
                      </div>
                    </div>

                    {/* ✅ Sub-menu — buttons with window.open, no <a> tags */}
                    <div className={`absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg w-44 p-2 origin-left transition-all duration-300 ${
                      activeExam === exam ? "opacity-100 scale-x-100 translate-x-0" : "opacity-0 scale-x-0 -translate-x-4 pointer-events-none"
                    }`}>
                      {EXAM_LINKS[exam].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => openExternal(item.href)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors duration-300 rounded"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Become a Tutor */}
            <div className="relative group">
              <button className="relative overflow-hidden text-sm text-Graphite dark:text-gray-100 font-medium h-6">
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Become a Tutor</span>
              </button>
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 mt-3 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-xl py-8 px-4 z-50 origin-top transition-all duration-300 opacity-0 scale-y-0 -translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:scale-y-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                <div className="space-y-2">
                  <button onClick={() => navigate("/tutor/welcomeTutor")} className="w-full px-4 py-2 rounded-xl bg-primary-hover text-white font-semibold text-sm">Register</button>
                  <button onClick={() => navigate("/tutor/login")} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Login</button>
                </div>
              </div>
            </div>
          </nav>

          {/* ===== Desktop Auth ===== */}
          <div className="hidden md:flex items-center space-x-2 ml-4">
            <Button
              variant="outline" size="sm"
              className="relative overflow-hidden group border-2 border-primary-hover text-primary-hover hover:text-white hover:bg-primary-hover px-8 py-3 text-base font-semibold rounded-xl shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-300 flex items-center justify-center"
              onClick={() => navigate("/login")}
            >
              <div className="relative h-5 overflow-hidden">
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Login</span>
                <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Login</span>
              </div>
            </Button>
            <Button
              variant="default" size="sm"
              className="relative overflow-hidden group bg-primary-hover hover:bg-primary text-white px-8 py-3 text-base font-semibold rounded-xl shadow-[0_0_12px_rgba(37,99,235,0.5)] flex items-center justify-center transition-all duration-300"
              onClick={() => navigate("/register")}
            >
              <div className="relative h-5 overflow-hidden">
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Sign Up</span>
                <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Sign Up</span>
              </div>
            </Button>
          </div>

          {/* ===== Mobile Toggle ===== */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-foreground dark:text-gray-100 hover:text-primary">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ===== Mobile Menu ===== */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border dark:border-gray-700 px-4 space-y-4">

            <div className="mt-3">
              <SearchBar />
            </div>
            {/* Blog */}
            <div className="relative group">
              <button
                onClick={() => navigate("/blog")}
                className="relative overflow-hidden text-sm text-Graphite dark:text-gray-100 font-medium h-6"
              >
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Blog</span>
                <span className="absolute left-0 top-full transition-transform duration-300 ease-in-out group-hover:-translate-y-full">Blog</span>
              </button>
            </div>

            {/* Exams */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full text-Graphite dark:text-gray-100 font-medium py-2"
              >
                <span>Exams</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="pl-4 space-y-3">
                  {Object.entries(EXAM_LINKS).map(([exam, links]) => (
                    <details key={exam} className="group/details">
                      <summary className="cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:text-primary flex justify-between items-center py-1 list-none">
                        <span>{exam}</span>
                        <ChevronDown className="w-4 h-4 group-open/details:rotate-180 transition-transform" />
                      </summary>
                      <div className="pl-4 mt-1 space-y-1">
                        {/* ✅ Mobile — also buttons with window.open, no <a> tags */}
                        {links.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => openExternal(item.href)}
                            className="block w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors py-1.5"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section */}
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">

              {/* Become a Tutor */}
              <details className="group">
                <summary className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors list-none">
                  <span>Become a Tutor</span>
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2 px-2 space-y-3">
                  <Button variant="default" size="sm" className="w-full bg-primary-hover hover:bg-primary text-white font-semibold rounded-xl" onClick={() => navigate("/tutor/register")}>
                    Register as Tutor
                  </Button>
                  <Button variant="outline" size="sm" className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold rounded-xl" onClick={() => navigate("/tutor/login")}>
                    Tutor Login
                  </Button>
                </div>
              </details>

              <Button variant="outline" size="sm" className="w-full border-2 border-primary-hover text-primary-hover hover:text-white hover:bg-primary-hover px-8 py-3 text-base font-semibold rounded-xl" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="default" size="sm" className="w-full bg-primary-hover hover:bg-primary text-white px-8 py-3 text-base font-semibold rounded-xl" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </div>

          </div>
        )}
      </div>
    </header>
  )
}

export default Header;  