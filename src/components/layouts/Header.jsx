import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import fillopLogo from "../../assets/images/fillops-logo.png";


const Header = () => {
  const  navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-border md:px-1 px-0
     shadow-boxShadow-elegant"
    >
      <div className="container mx-auto px-2 py-2 ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={fillopLogo}
              alt="Fillop Logo"
              className="w-20 h-16 md:w-22 md:h-16 object-contain"
            />
            <div className="leading-none">
              <p className="text-maincolor text-lg sm:text-2xl md:text-4xl font-bold">
                FILLOP TECH
              </p>
              <p className="text-[7px] sm:text-[10.5px]
               md:text-[11.5px] text-education-orange font-merriweather
                ml-[8px] sm:ml-[20px] md:ml-[49px]">
                ....simplifying your tech world
              </p>
            </div>
          </div>

        

          {/* Search Bar (Desktop/Tablet only) */}
          <div className="hidden md:block w-full max-w-md mx-auto px-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="w-full border border-gray-200 rounded-2xl py-2 pl-10 pr-4 text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-ring-2 transition"
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

          <div>
            <a href="" className="text-sm text-Graphite border-b md:flex hidden  mx-16">
              Teach in our platform.
            </a>
          </div>

          {/* Desktop Auth Buttons with hover swap */}
          <div className="hidden md:flex items-center space-x-4">
      {/* Login Button */}
      <Button
        variant="outline"
        size="sm"
        className="relative overflow-hidden h-10 group px-6 flex items-center justify-center"
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

      {/* Sign Up Button */}
      <Button
        variant="default"
        size="sm"
        className="relative overflow-hidden h-10 group px-6 flex items-center justify-center"
        onClick={() => navigate("/register")} // ✅ moved here
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border px-4 ">
            {/* Mobile Search */}
            <div className="relative mb-16 mt-4">
              <input
                type="search"
                placeholder="Search..."
                className="w-full border border-gray-200 rounded-2xl py-2 pl-10 pr-4 text-sm 
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-blue-50 transition"
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

            <div>
            <a href="" className="text-sm text-Graphite border-b inlineblock  md:hidden  md:mx-16">
              Teach in our platform.
            </a>
          </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                className="relative overflow-hidden h-10 group px-6 flex items-center justify-center"
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
