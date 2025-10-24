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
      className="min-h-screen flex items-center justify-center bg-gray-50 p-6"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="form-title text-3xl font-bold text-gray-900 mb-6 text-center">
          Get in Touch
        </h2>
        <form className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            className="form-element w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="form-element w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            rows="4"
            placeholder="Your Message"
            className="form-element w-full p-3 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />

          <Button className="form-element w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-[1.02]">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
