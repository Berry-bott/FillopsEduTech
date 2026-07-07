

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Button } from "../ui/button";
import { MapPin, Phone, Mail, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ContactForm = () => {
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".left-panel", {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".left-panel",
          start: "top 80%",
        },
      });

      gsap.from(".right-panel", {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".right-panel",
          start: "top 80%",
        },
      });

      gsap.from(".form-field", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".form-field",
          start: "top 85%",
        },
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={formRef}
      className="min-h-screen flex items-center justify-center 
                 dark:bg-background p-4 transition-colors duration-500"
    >
      <div className="w-full max-w-6xl 
                      bg-white dark:bg-gray-900 
                      rounded-xl shadow-2xl 
                      overflow-hidden grid md:grid-cols-2">
        
        {/* Left Panel - Info */}
        <div className="left-panel bg-primary 
                        p-12 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-indigo-100 mb-8">
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  {/* <p className="text-indigo-100">+234 123-4567</p> */}
                  <a href="https://wa.me/qr/MCB5PYD3ZG3XD1" target="_blank" rel="noopener noreferrer">
                    +1 (217) 216-0029
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="https://maps.app.goo.gl/uK4e6o7gsaV6B21k6" className="text-indigo-100">info@filloptech.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                    <a href="https://maps.app.goo.gl/uK4e6o7gsaV6B21k6" target="_blank">Google Map</a>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="relative mt-8">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-0 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="right-panel p-8 dark:bg-gray-800">
          <form className="space-y-3">
            <div className="form-field">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg 
                           bg-gray-50 dark:bg-gray-900 
                           border border-gray-200 dark:border-gray-700 
                           text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           outline-none transition-all duration-300"
                placeholder="John Doe"
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg 
                           bg-gray-50 dark:bg-gray-900 
                           border border-gray-200 dark:border-gray-700 
                           text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           outline-none transition-all duration-300"
                placeholder="john@example.com"
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-lg 
                           bg-gray-50 dark:bg-gray-900 
                           border border-gray-200 dark:border-gray-700 
                           text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           outline-none transition-all duration-300"
                placeholder="+234 (025) 2700 250"
              />
            </div>

            <div className="form-field">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows=""
                className="w-full px-4 py-3 rounded-lg 
                           bg-gray-50 dark:bg-gray-900 
                           border border-gray-200 dark:border-gray-700 
                           text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           outline-none resize-none transition-all duration-300"
                placeholder="Tell us about your project..."
              />
            </div>

            <Button 
              type="submit"
              className="w-full py-4 rounded-lg 
                         bg-primary
                         hover:to-primary-hover
                         text-white font-semibold
                         shadow-lg hover:shadow-xl 
                         transform hover:scale-[1.02]
                         transition-all duration-300">
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;