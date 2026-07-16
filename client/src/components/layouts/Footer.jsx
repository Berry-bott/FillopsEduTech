
import React from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
  FaYoutube 
} from "react-icons/fa6";

const NAV_LINKS = [
  { label: "Privacy Policy", href: "https://filloptech.com/privacy" },
  { label: "Terms of Service", href: "https://filloptech.com/terms" },
  { label: "Resource Person", href: "https://filloptech.com/resource-person" },
  { label: "Content Creator", href: "https://filloptech.com/creators" },
  { label: "Refund Policy", href: "https://filloptech.com/refund-policy" },
];

const SERVICE_LINKS = [
  { label: "MarketPlace", href: "https://business.filloptech.com/" },
  { label: "CBT Guru Download", href: "https://business.filloptech.com/marketplace" },
  { label: "Research", href: "https://business.filloptech.com/research" },
  { label: "Buy Books", href: "https://business.filloptech.com/research" },
  { label: "Technology Services", href: "https://business.filloptech.com/enterprise" },
];

function Footer() {
  return (
    <footer className="bg-muted border-t  border-border px-6 pt-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          <div className="flex flex-col gap-4">
            <span className="text-xl font-bold text-primary">Fillop</span>
            <p className="text-muted-foreground">
              Building skills, powering solutions...
            </p>

          <div className="flex gap-4 text-xl">
            <a
              href="https://facebook.com/filloptech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 transition-all duration-300 hover:text-blue-600 hover:-translate-y-1 hover:scale-110"
            >
              <FaFacebook />
            </a>

            <a
              href="https://linkedin.com/in/filloptech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 transition-all duration-300 hover:text-blue-700 hover:-translate-y-1 hover:scale-110"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://x.com/filloptech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 transition-all duration-300 hover:text-black hover:-translate-y-1 hover:scale-110"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://youtube.com/@filloptech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 transition-all duration-300 hover:text-pink-600 hover:-translate-y-1 hover:scale-110"

            >
              <FaYoutube  />
            </a>
            <a
              href="https://instagram.com/filloptech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 transition-all duration-300 hover:text-pink-600 hover:-translate-y-1 hover:scale-110"

            >
              <FaInstagram />
            </a>

          </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6 ">Company</h4>
            <ul className="space-y-3 p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex self-start text-muted-foreground hover:text-primary no-underline transition-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Fillop Business</h4>
            <ul className="space-y-3 p-0">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary no-underline transition-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Study</h4>
            <ul className="space-y-3 p-0">
              <li className="text-muted-foreground">
               Professional Courses
              </li>
              <li className="text-muted-foreground">
                JAMB
              </li>
              <li className="text-muted-foreground">
                WAEC
              </li>
              <li className="text-muted-foreground">
                NECO
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6">Contact</h4>
            <ul className="space-y-3 p-0">
              <li className="text-muted-foreground">
                Physical HQ: Nigeria, <br/>
                91 Ago Palace way, Okota, Isolo Lagos.
              </li>
              <li className="text-muted-foreground">
                Nigeria: 44 Sanni Ogun, Ikot Ekpene, Akwa Ibom.
              </li>
              <li className="text-muted-foreground">
          
                <a
                  href="http://www.filloptech.com"
                  className="hover:text-primary hover:underline"
                >  Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-xs text-muted-foreground">
           
            © 2026 Fillops Tech. All rights reserved.
          </p>
        
        </div>
      </div>
    </footer>
  );
}

export default Footer;