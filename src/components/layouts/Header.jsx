  import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import fillopLogo from "../../assets/images/fillopsLogo.png";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-border shadow-boxShadow-elegant">
      <div className="container mx-auto px-3 py-3">
        <div className="flex items-center justify-between">
          {/* ===== Logo ===== */}
          <div className="flex items-center">
            <img
              src={fillopLogo}
              alt="Fillop Logo"
              className="w-12 h-12  object-contain"
            />
            <div className="leading-none ml-4">
              <p className="text-primary text-lg sm:text-2xl md:text-3xl font-bold">
                FILLOP TECH
              </p>
              <p className="text-[8px] sm:text-[10px] md:text-[11.5px] text-education-orange font-merriweather ml-[0px] 
              sm:ml-[ 0px] md:ml-[10px]">
                ....simplifying your tech world
              </p>
            </div>
          </div>

          {/* ===== Search Bar (Adjustable) ===== */}
          <div className="hidden md:block w-full max-w-md mx-6 flex-1">
            <div className="relative group">
              <input
                type="search"
                placeholder="Search..."
                className="w-full border border-gray-200 rounded-2xl py-2 pl-10 pr-4 text-sm transition-all duration-300 ease-in-out focus:w-[110%] focus:outline-none focus:ring-2 focus:ring-primary"
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
            {/* Exams Dropdown */}
            <div
              className="relative group"
              onMouseEnter={toggleDropdown}
              onMouseLeave={() => {
                setIsDropdownOpen(false);
                closeExamHover();
              }}
            >
              <button className="flex items-center text-Graphite font-medium hover:text-primary transition-smooth">
                Exams <ChevronDown className="ml-1 w-4 h-4" />
              </button>

              {/* First-level dropdown */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-0 bg-white border border-gray-200 rounded-xl shadow-lg w-44 py-2 z-50">
                  {["WAEC", "NECO", "JAMB"].map((exam) => (
                    <div
                      key={exam}
                      className="relative group/item"
                      onMouseEnter={() => handleExamHover(exam)}
                      onMouseLeave={closeExamHover}
                    >
                      <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white cursor-pointer">
                        {exam} <ChevronRight className="w-4 h-4" />
                      </div>

                      {/* Nested dropdown (Check Result, Syllabus, Latest) */}
                      {activeExam === exam && (
                        <div className="absolute left-full top-0 ml-0 bg-white border border-gray-200 rounded-xl shadow-lg w-40 py-2">
                          <a
                            href={`/${exam.toLowerCase()}/result`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white"
                          >
                            Check Result
                          </a>
                          <a
                            href={`/${exam.toLowerCase()}/syllabus`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white"
                          >
                            Syllabus
                          </a>
                          <a
                            href={`/${exam.toLowerCase()}/latest`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white"
                          >
                            Latest
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#"
              className="text-sm text-Graphite border-b border-transparent hover:border-primary transition"
            >
              Teach in our platform
            </a>
          </nav>

          {/* ===== Desktop Auth Buttons ===== */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="relative overflow-hidden h-10 group px-6 flex items-center justify-center hover:bg-green-700"
              onClick={() => navigate("/login")}
            >
              <div className="relative h-5 overflow-hidden">
                <span className="text-Graphite block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  Login
                </span>
                <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full text-white">
                  Login
                </span>
              </div>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="bg-primary-hover/70 relative overflow-hidden h-10 group px-6 flex items-center justify-center"
              onClick={() => navigate("/register")}
            >
              <div className="relative h-5 overflow-hidden hover:text-primary">
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  Sign Up
                </span>
                <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full text-white">
                  Sign Up
                </span>
              </div>
            </Button>
          </div>

          {/* ===== Mobile Menu Button ===== */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ===== Mobile Navigation ===== */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border px-4 space-y-4">
            {/* Search (Mobile) */}
            <div className="relative mt-2">
              <input
                type="search"
                placeholder="Search..."
                className="w-full border border-gray-200 rounded-2xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
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

            {/* Exams Dropdown (Mobile) */}
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full text-Graphite font-medium py-2"
              >
                Exams{" "}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="pl-4 space-y-3">
                  {["WAEC", "NECO", "JAMB"].map((exam) => (
                    <details key={exam} className="group">
                      <summary className="cursor-pointer text-sm text-gray-700 hover:text-primary flex justify-between items-center">
                        {exam}
                        <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="pl-4 mt-2 space-y-1">
                        <a
                          href={`/${exam.toLowerCase()}/result`}
                          className="block text-sm text-gray-600 hover:text-primary"
                        >
                          Check Result
                        </a>
                        <a
                          href={`/${exam.toLowerCase()}/syllabus`}
                          className="block text-sm text-gray-600 hover:text-primary"
                        >
                          Syllabus
                        </a>
                        <a
                          href={`/${exam.toLowerCase()}/latest`}
                          className="block text-sm text-gray-600 hover:text-primary"
                        >
                          Latest
                        </a>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>

            <a href="#" className="block text-sm text-Graphite border-b pb-2">
              Teach in our platform
            </a>

            {/* Auth Buttons (Mobile) */}
            <div className="flex flex-col space-y-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="relative overflow-hidden h-10 group px-6 flex items-center justify-center hover:bg-green-700"
                onClick={() => navigate("/login")}
              >
                <div className="relative h-5 overflow-hidden">
                  <span className="block transition-transform duration-300 text-Graphite ease-in-out group-hover:-translate-y-full">
                    Login
                  </span>
                  <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full text-white">
                    Login
                  </span>
                </div>
              </Button>

              <Button
                variant="default"
                size="sm"
                className="relative overflow-hidden h-10 group px-6 flex items-center justify-center"
                onClick={() => navigate("/register")}
              >
                <div className="relative h-5 overflow-hidden">
                  <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                    Sign Up
                  </span>
                  <span className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out group-hover:-translate-y-full text-white">
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
