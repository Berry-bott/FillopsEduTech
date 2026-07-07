import { Twitter, Linkedin, Mail, Facebook, Youtube, MessageCircle, Instagram } from "lucide-react";
import logo from "../../assets/images/fillopsLogo.png";

const Footer = () => {
  const whatsappNumber = "2172160029";

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    {
      icon: MessageCircle,
      link: `https://wa.me/${whatsappNumber}`,
      label: "WhatsApp",
    },
    { icon: Facebook, link: "https://facebook.com/filloptech", label: "Facebook" },
    { icon: Twitter, link: "https://X.com/filloptech", label: "Twitter" },
    { icon: Youtube, link: "https://Youtube.com/@filloptech", label: "YouTube" },
    { icon: Instagram, link: "https://instagram.com/filloptech", label: "Instagram" },
    { icon: Mail, link: "mailto:help@filloptech.com", label: "Email" },
  ];

  return (
    <footer className="relative bg-background border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between gap-8">
          {/* Logo and Description Section */}
          <div className="flex  items-center md:items-start gap-4">
            <img
              src={logo}
              alt="Fillops Logo"
              className="w-16 h-16 object-contain"
            />
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              Building skills, powering solutions. Empowering students and tutors through innovative educational technology.
            </p>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              Connect With Us
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {socialLinks.map(({ icon: Icon, link, label }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 transform hover:-translate-y-1"
                  title={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-primary">
                Fillops Tech
              </span>
              . All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;