import { Twitter, Linkedin, Mail, Facebook, Youtube } from "lucide-react";
import logo from "../../assets/images/fillopsLogo.png";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden py-6 px-6 transition-colors duration-300 bg-white dark:bg-backgroundNext text-gray-700 dark:text-gray-300">
      {/* Decorative gradient overlay */}

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img
            src={logo}
            alt="Fillops Logo"
            className="w-12 h-12 object-contain transition-all"
          />
           <p className="text-[6px]  md:text-[9px] xmd:text-[px]  text-education-orange dark:text-education-orange font-merriweather ml-[0px] sm:ml-[0px] ">
                Building skills, powering solutions...  
              </p>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center gap-6 font-medium text-gray-600 dark:text-gray-300">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <li
              key={item}
              className="relative cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* Social Links */}
        <div className="flex gap-2">
          {[
            { icon: Facebook, link: "https://facebook.com/filloptech", color: "text-gray-700 dark:text-gray-200 ", hover: "hover:bg-gray-200 dark:hover:bg-gray-700" },
            { icon: Twitter, link: "https://X.com/filloptech", color: "text-blue-500", hover: "hover:bg-blue-50 dark:hover:bg-blue-900/30" },
            { icon: Youtube, link: "https://Youtube.com/@filloptech", color: "text-red-700 dark:text-red-400", hover: "hover:bg-blue-50 dark:hover:bg-blue-900/30" },
            { icon: Mail, link: "mailto:help@filloptech.com", color: "text-red-500 dark:text-red-400", hover: "hover:bg-red-50 dark:hover:bg-red-900/30" },
          ].map(({ icon: Icon, link, color, hover }, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm ${hover} transition-all transform hover:-translate-y-1 hover:shadow-md`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
            </a>
          ))}
        </div>
      </div>

      {/* Divider line */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-10"></div>

      {/* Bottom text */}
      <div className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          Fillops Tech
        </span>
        . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
