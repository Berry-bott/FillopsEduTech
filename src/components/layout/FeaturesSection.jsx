import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { TypeAnimation } from "react-type-animation";
import FeaturesImage1 from "../../assets/images/featuresImage1.jpg";
import FeaturesImage2 from "../../assets/images/featuresImage2.jpg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Text fade-up
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

export default function FeaturesSection() {
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);

  useEffect(() => {
    const animateImage = (img) => {
      if (!img) return;

      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: "top 30%", // start earlier for smoothness
          end: "bottom top+=70", // extend distance for slower animation
          scrub: 1.5, // smooth scrubbing (seconds of lag)
          markers: false,
        },
        y: "100vh", // push far enough out of screen
        opacity: 0,
        scale: 0.7,
        ease: "power2.inOut", // smoother easing
      });

      // Desktop tilt effect
      const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return;

        const { innerWidth, innerHeight } = window;
        const offsetX = (e.clientX / innerWidth - 0.5) * 2;
        const offsetY = (e.clientY / innerHeight - 0.5) * 2;

        gsap.to(img, {
          rotationX: offsetY * 10,
          rotationY: offsetX * 10,
          transformPerspective: 1000,
          transformOrigin: "center",
          ease: "power2.out",
          duration: 0.6,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    };

    const cleanup1 = animateImage(imageRef1.current);
    const cleanup2 = animateImage(imageRef2.current);

    return () => {
      cleanup1 && cleanup1();
      cleanup2 && cleanup2();
    };
  }, []);

  return (
    <section className="relative py-28 bg-background overflow-hidden md:mx-8 mx-2">
      <div className="container mx-auto px-2">
        {/* HEADER */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <Badge
            variant="secondary"
            className="px-5 py-1 mb-6 rounded-full text-Graphite "
          >
            Our Services
          </Badge>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight h-24">
            <TypeAnimation
              sequence={[
                "Smart Tools for Smarter Results.",
                2000,
                "Ace Your Exams with Confidence.",
                2000,
                "Personalized AI Study Paths.",
                2000,
              ]}
              wrapper="span"
              speed={60}
              deletionSpeed={80}
              repeat={Infinity}
              cursor={true}
              className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-transparent bg-clip-text drop-shadow-md"
            />
          </h2>
        </motion.div>

        {/* SECTION 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* IMAGE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-blue-500/30"
          >
            <img
              ref={imageRef1}
              src={FeaturesImage1}
              alt="Features"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* TEXT */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="flex flex-col gap-6 self-start"
          >
            <motion.h3
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-2xl md:text-3xl font-bold text-Graphite"
            >
              Welcome to Fillop Study Platform!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              This is our Gateway to WAEC/NECO and JAMB/UTME Success. We've
              designed this platform to be your ultimate study partner,
              providing comprehensive and personalized learning experience. The
              mission is to empower every student with the tools, knowledge, and
              confidence they need to excel in their WAEC and NECO examinations.
            </motion.p>
          </motion.div>
        </div>

        {/* SECTION 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
          {/* TEXT */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="flex flex-col gap-6 self-start order-2 md:order-1"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-lg text-muted-foreground leading-relaxed mt-6"
            >
            This platform encompasses the study and hands-on practice of WAEC/NECO and those preparing to write JAMB and PUTME. This platform goes beyond just providing content; it’s an all-encompassing tool that helps students prepare effectively, track their progress, and build confidence in these exams.This is an AI-powered system that analyzes a student's performance, behavior, adapt to each candidate's unique needs, and learning style to create a custom study path making the learning process smarter and more efficient.
            </motion.p>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 order-1 md:order-2"
          >
            <img
              ref={imageRef2}
              src={FeaturesImage2}
              alt="Study AI"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
