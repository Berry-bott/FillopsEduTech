import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import fillopLogo from "../../assets/images/fillopsLogo.png";
import { ThemeToggle } from "../DashboardComponents/theme-toggle";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeExam, setActiveExam] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleExamHover = (exam) => setActiveExam(exam);
  const closeExamHover = () => setActiveExam(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-background backdrop-blur-sm border-b border-border 
    dark:border-gray-700 shadow-boxShadow-elegant transition-colors duration-300">
      <div className="container mx-auto px-3 py-3">
        <div className="flex items-center justify-between">
          {/* ===== Logo ===== */}
          <div className="flex items-center">
            <img
              src={fillopLogo}
              alt="Fillop Logo"
              className="w-12 h-12 object-contain"
            />
            <div className="leading-none mx-4 md:ml-2">
              <p className="text-primary dark:text-primary text-xl md:text-[1rem] xmd:text-2xl lg:text-3xl font-bold font-merriweather">
                FILLOP TECH
              </p>
              <p className="text-[8px]  md:text-[10px] xmd:text-[11.5px] lg:text-sm text-education-orange dark:text-education-orange font-merriweather ml-[0px] sm:ml-[0px] md:ml-[10px]">
                ....simplifying your tech world
              </p>
            </div>
          </div>

          <ThemeToggle />

          {/* ===== Search Bar ===== */}
          <div className="hidden md:block w-full max-w-md mr-2 flex-1">
            <div className="relative group">
              <input
                type="search"
                placeholder="Search..."
                className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary 
                focus:outline-none transition-all duration-300 ease-in-out focus:w-[110%]"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </div>
          </div>

          {/* ===== Desktop Navigation ===== */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Exams Dropdown with Rolling Effect */}
            <div
              className="relative group"
              onMouseEnter={toggleDropdown}
              onMouseLeave={() => {
                setIsDropdownOpen(false);
                closeExamHover();
              }}
            >
              <button className="relative overflow-hidden flex items-center text-Graphite dark:text-gray-100 font-medium hover:text-primary transition-smooth h-6">
                <span className="relative block">
                  <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Exams
                  </span>
                  <span className="absolute left-0 top-full transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Exams
                  </span>
                </span>
                <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* Dropdown with slide down animation */}
              <div className={`absolute left-0  bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
              rounded shadow-lg w-44 p-2  z-50 origin-top transition-all duration-300 ${
                isDropdownOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'
              }`}>
                {["WAEC", "NECO", "JAMB"].map((exam, index) => (
                  <div
                    key={exam}
                    className="relative group/item"
                    onMouseEnter={() => handleExamHover(exam)}
                    onMouseLeave={closeExamHover}
                    style={{ 
                      transitionDelay: isDropdownOpen ? `${index * 50}ms` : '0ms',
                      animation: isDropdownOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none'
                    }}
                  >
                    <div className="relative overflow-hidden px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary
                     hover:text-white cursor-pointer transition-colors duration-300">
                      <div className="flex justify-between items-center">
                        <span className="relative block h-5">
                          <span className="block transition-transform duration-300 ease-in-out ">
                            {exam}
                          </span>

                        </span>
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/item:translate-x-1" />
                      </div>
                    </div>

                    {/* Sub-menu with slide effect */}
                    <div className={`absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200
                     dark:border-gray-700 rounded shadow-lg w-40 p-2 origin-left transition-all duration-300 ${
                      activeExam === exam ? 'opacity-100 scale-x-100 translate-x-0' : 'opacity-0 scale-x-0 -translate-x-4 pointer-events-none'
                    }`}>
                      {[
                        { label: "Check Result", path: `/${exam.toLowerCase()}/result` },
                        { label: "Syllabus", path: `/${exam.toLowerCase()}/syllabus` },
                        { label: "Latest", path: `/${exam.toLowerCase()}/latest` }
                      ].map((item, subIndex) => (
                        <a
                          key={item.label}
                          href={item.path}
                          className="relative block overflow-hidden px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors duration-300 group/link"
                          style={{ 
                            transitionDelay: activeExam === exam ? `${subIndex * 50}ms` : '0ms'
                          }}
                        >
                          <span className="relative block h-5">
                            <span className="block transition-transform duration-300 ease-in-out ">
                              {item.label}
                            </span>

                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teach in Platform with Rolling Card */}
            <div className="relative group">
              <button className="relative overflow-hidden text-sm text-Graphite dark:text-gray-100 font-medium h-6">
                <span className="relative block">
                  <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Teach in our platform
                  </span>
                  <span className="absolute left-0 top-full transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Teach in our platform
                  </span>
                </span>
              </button>

              {/* Hover Card with roll down effect */}
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 mt-3 w-40 bg-white dark:bg-gray-800 border border-gray-200
               dark:border-gray-700 rounded shadow-xl py-8 px-4 z-50 origin-top transition-all duration-300 opacity-0 scale-y-0 -translate-y-4 
               pointer-events-none group-hover:opacity-100 group-hover:scale-y-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
                  Become a Tutor
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/tutor/register")}
                    className="relative overflow-hidden w-full px-4 py-2 rounded-xl bg-primary-hover text-white font-semibold text-sm transition-all duration-300 group/btn"
                  >
                    <span className="relative block h-5">
                      <span className="block transition-transform duration-300 ease-in-out ">
                        Register
                      </span>
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/tutor/login")}
                    className="relative overflow-hidden w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group/btn"
                  >
                    <span className="relative block h-5">
                      <span className="block transition-transform duration-300 ease-in-out">
                        Login
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* ===== Desktop Auth Buttons ===== */}
          <div className="hidden md:flex items-center space-x-2 ml-4">
            {/* LOGIN BUTTON */}
            <Button
              variant="outline"
              size="sm"
              className="relative overflow-hidden group border-2 border-primary-hover text-primary-hover hover:text-white hover:bg-primary-hover px-8 py-3 text-base font-semibold rounded-xl shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-300 flex items-center justify-center dark:border-primary-hover dark:text-primary-hover dark:hover:bg-primary-hover dark:hover:text-white dark:shadow-[0_0_15px_rgba(96,165,250,0.6)]"
              onClick={() => navigate('/login')}
            >
              <div className="relative h-5 overflow-hidden">
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  Login
                </span>
                <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  Login
                </span>
              </div>
            </Button>

            {/* SIGN UP BUTTON */}
            <Button
              variant="default"
              size="sm"
              className="relative overflow-hidden group bg-primary-hover hover:bg-primary text-white px-8 py-3 text-base font-semibold rounded-xl shadow-[0_0_12px_rgba(37,99,235,0.5)] flex items-center justify-center transition-all duration-300 dark:bg-blue-500 dark:hover:bg-primary-hover dark:shadow-[0_0_15px_rgba(96,165,250,0.6)]"
              onClick={() => navigate('/register')}
            >
              <div className="relative h-5 overflow-hidden">
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  Sign Up
                </span>
                <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  Sign Up
                </span>
              </div>
            </Button>
          </div>

          {/* ===== Mobile Menu Button ===== */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-foreground dark:text-gray-100 hover:text-primary transition-smooth"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ===== Mobile Navigation ===== */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border dark:border-gray-700 px-4 space-y-4">
            <div className="relative mt-2">
              <input
                type="search"
                placeholder="Search..."
                className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <button
                onClick={toggleDropdown}
                className="relative overflow-hidden flex items-center justify-between w-full text-Graphite dark:text-gray-100 font-medium py-2 group"
              >
                <span className="relative block h-6">
                  <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Exams
                  </span>
                  <span className="absolute left-0 top-full transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Exams
                  </span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="pl-4 space-y-3">
                  {["WAEC", "NECO", "JAMB"].map((exam) => (
                    <details key={exam} className="group/details">
                      <summary className="cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:text-primary flex justify-between items-center">
                        {exam}
                        <ChevronDown className="w-4 h-4 group-open/details:rotate-180 transition-transform" />
                      </summary>
                      <div className="pl-4 mt-2 space-y-1">
                        <a
                          href={`/${exam.toLowerCase()}/result`}
                          className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                          Check Result
                        </a>
                        <a
                          href={`/${exam.toLowerCase()}/syllabus`}
                          className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                          Syllabus
                        </a>
                        <a
                          href={`/${exam.toLowerCase()}/latest`}
                          className="block text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                          Latest
                        </a>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>

            <div className="relative group">
              <button className="relative overflow-hidden text-sm text-Graphite dark:text-gray-100 font-medium h-6">
                <span className="relative block">
                  <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Teach in our platform
                  </span>

                </span>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 z-50 origin-top transition-all duration-300 opacity-0 scale-y-0 -translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:scale-y-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
                  Become a Tutor
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/register")}
                    className="relative overflow-hidden w-full px-4 py-2 rounded-xl bg-primary-hover text-white font-semibold text-sm transition-all duration-300 group/btn"
                  >
                    <span className="relative block h-5">
                      <span className="block transition-transform duration-300 ease-in-out group-hover/btn:-translate-y-full">
                        Register
                      </span>
                      <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover/btn:-translate-y-full">
                        Register
                      </span>
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="relative overflow-hidden w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group/btn"
                  >
                    <span className="relative block h-5">
                      <span className="block transition-transform duration-300 ease-in-out group-hover/btn:-translate-y-full">
                        Login
                      </span>
                      <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover/btn:-translate-y-full">
                        Login
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              {/* LOGIN BUTTON */}
              <Button
                variant="outline"
                size="sm"
                className="relative overflow-hidden group border-2 border-primary-hover text-primary-hover hover:text-white hover:bg-primary-hover px-8 py-3 text-base font-semibold rounded-xl shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-300 flex items-center justify-center dark:border-primary-hover dark:text-primary-hover dark:hover:bg-primary-hover dark:hover:text-white dark:shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                onClick={() => navigate('/login')}
              >
                <div className="relative h-5 overflow-hidden">
                  <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Login
                  </span>
                  <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Login
                  </span>
                </div>
              </Button>

              {/* SIGN UP BUTTON */}
              <Button
                variant="default"
                size="sm"
                className="relative overflow-hidden group bg-primary-hover hover:bg-primary text-white px-8 py-3 text-base font-semibold rounded-xl shadow-[0_0_12px_rgba(37,99,235,0.5)] flex items-center justify-center transition-all duration-300 dark:bg-blue-500 dark:hover:bg-primary-hover dark:shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                onClick={() => navigate('/register')}
              >
                <div className="relative h-5 overflow-hidden">
                  <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Sign Up
                  </span>
                  <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Sign Up
                  </span>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;