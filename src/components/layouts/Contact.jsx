"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Button } from "../ui/button";

gsap.registerPlugin(ScrollTrigger);

const ContactForm = () => {
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".form-title", {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".form-title",
          start: "top 80%",
        },
      });

      gsap.from(".form-element", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".form-element",
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
                 dark:bg-background p-6 transition-colors duration-500"
    >
      <div className="w-full max-w-lg 
                      bg-white dark:bg-gray-900 
                      rounded-2xl shadow-2xl dark:shadow-gray-800 
                      p-8 border border-gray-200 dark:border-gray-700
                      transition-colors duration-500">
        <h2 className="form-title text-3xl font-bold 
                       text-gray-900 dark:text-gray-100 mb-6 text-center 
                       text-shadow-sm dark:text-shadow-glow">
          Get in Touch
        </h2>
        <form className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            className="form-element w-full p-3 rounded-lg 
                       bg-gray-100 dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       border border-gray-300 dark:border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-primary
                       transition-colors duration-300"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="form-element w-full p-3 rounded-lg 
                       bg-gray-100 dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       border border-gray-300 dark:border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-primary
                       transition-colors duration-300"
          />
          <textarea
            rows="4"
            placeholder="Your Message"
            className="form-element w-full p-3 rounded-lg 
                       bg-gray-100 dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       border border-gray-300 dark:border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-primary
                       resize-none transition-colors duration-300"
          />

          <Button className="form-element w-full 
                             bg-primary dark:bg-blue-600 
                             hover:bg-primary-hover dark:hover:bg-blue-500 
                             text-white font-semibold py-3 rounded-lg 
                             shadow-md dark:shadow-blue-900 
                             transition-transform transform hover:scale-[1.02]">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
