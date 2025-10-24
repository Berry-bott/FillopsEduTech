// import Github from "lucide-react/dist/esm/icons/github.js";
// import Twitter from "lucide-react/dist/esm/icons/twitter.js";
// import Linkedin from "lucide-react/dist/esm/icons/linkedin.js";
// import Mail from "lucide-react/dist/esm/icons/mail.js";
// import logo from "../../assets/images/fillops-logo.png";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-100 text-gray-800 py-10 px-6 shadow-md">
//       <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
//         {/* Logo or Brand */}
//         <div className="w-40 h-32">
//           <img src={logo} alt="Fillops Logo" className="w-full h-full object-contain" />
//         </div>

//         {/* Navigation Links */}
//         <ul className="flex gap-6 text-gray-600">
//           <li className="hover:text-gray-900 transition-colors cursor-pointer">Home</li>
//           <li className="hover:text-gray-900 transition-colors cursor-pointer">About</li>
//           <li className="hover:text-gray-900 transition-colors cursor-pointer">Services</li>
//           <li className="hover:text-gray-900 transition-colors cursor-pointer">Contact</li>
//         </ul>

//         {/* Social Links */}
//         <div className="flex gap-4">
//           <a
//             href="https://github.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
//           >
//             <Github className="w-5 h-5 text-gray-700" />
//           </a>
//           <a
//             href="https://twitter.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors"
//           >
//             <Twitter className="w-5 h-5 text-blue-500" />
//           </a>
//           <a
//             href="https://linkedin.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors"
//           >
//             <Linkedin className="w-5 h-5 text-blue-700" />
//           </a>
//           <a
//             href="mailto:youremail@example.com"
//             className="p-2 rounded-full bg-gray-200 hover:bg-red-100 transition-colors"
//           >
//             <Mail className="w-5 h-5 text-red-500" />
//           </a>
//         </div>
//       </div>

//       <div className="text-center text-gray-500 mt-8 text-sm">
//         &copy; {new Date().getFullYear()}  <span className="text-maincolor text">FILLOP TECH</span>. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import logo from "../../assets/images/fillops-logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-700 py-12 px-6 relative overflow-hidden">
      {/* Decorative gradient light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.08),_transparent_70%)] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img src={logo} alt="Fillops Logo" className="w-28 h-24 object-contain" />
          <p className="text-sm text-gray-500">Innovating learning through technology.</p>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center gap-6 font-medium text-gray-600">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <li
              key={item}
              className="relative cursor-pointer hover:text-blue-600 transition-colors duration-300 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* Social Links */}
        <div className="flex gap-5">
          {[
            { icon: Github, link: "https://github.com", color: "text-gray-700", hover: "hover:bg-gray-200" },
            { icon: Twitter, link: "https://twitter.com", color: "text-blue-500", hover: "hover:bg-blue-50" },
            { icon: Linkedin, link: "https://linkedin.com", color: "text-blue-700", hover: "hover:bg-blue-50" },
            { icon: Mail, link: "mailto:youremail@example.com", color: "text-red-500", hover: "hover:bg-red-50" },
          ].map(({ icon: Icon, link, color, hover }, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full bg-white shadow-sm ${hover} transition-all transform hover:-translate-y-1 hover:shadow-md`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
            </a>
          ))}
        </div>
      </div>

      {/* Divider line */}
      <div className="border-t border-gray-200 mt-10"></div>

      {/* Bottom text */}
      <div className="text-center text-gray-500 mt-6 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600">Fillops Tech</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
