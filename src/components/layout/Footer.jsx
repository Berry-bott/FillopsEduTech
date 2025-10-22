import Github from "lucide-react/dist/esm/icons/github.js";
import Twitter from "lucide-react/dist/esm/icons/twitter.js";
import Linkedin from "lucide-react/dist/esm/icons/linkedin.js";
import Mail from "lucide-react/dist/esm/icons/mail.js";
import logo from "../../assets/images/fillops-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-10 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo or Brand */}
        <div className="w-40 h-32">
          <img src={logo} alt="Fillops Logo" className="w-full h-full object-contain" />
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-6 text-gray-600">
          <li className="hover:text-gray-900 transition-colors cursor-pointer">Home</li>
          <li className="hover:text-gray-900 transition-colors cursor-pointer">About</li>
          <li className="hover:text-gray-900 transition-colors cursor-pointer">Services</li>
          <li className="hover:text-gray-900 transition-colors cursor-pointer">Contact</li>
        </ul>

        {/* Social Links */}
        <div className="flex gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <Github className="w-5 h-5 text-gray-700" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors"
          >
            <Twitter className="w-5 h-5 text-blue-500" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors"
          >
            <Linkedin className="w-5 h-5 text-blue-700" />
          </a>
          <a
            href="mailto:youremail@example.com"
            className="p-2 rounded-full bg-gray-200 hover:bg-red-100 transition-colors"
          >
            <Mail className="w-5 h-5 text-red-500" />
          </a>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8 text-sm">
        &copy; {new Date().getFullYear()}  <span className="text-maincolor text">FILLOP TECH</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
