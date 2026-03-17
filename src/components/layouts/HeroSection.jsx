


import React from "react";
import { TypeAnimation } from "react-type-animation";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, BookOpen, Users, Award, CheckCircle, Sparkles } from "lucide-react";
import hangoverImage from "../../assets/images/hero-education.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
   const navigate = useNavigate();
  return (
    <section className="relative min-h-screen overflow-hidden transition-colors duration-500">

      <div className="relative container mx-auto px-4 lg:px-8 py-20 md:pt-32 pt-30">
        <div className="grid lg:grid-cols-[55%_45%] gap-4 ">
          
          {/* Left Content */}
          <div className="space-y-1 z-10 ">
         

            {/* Main Heading */}
            <div className="">
              <h1 className="max-sm:text-[1.8rem] sm:text-3xl md:text-4xl text-center md:text-left font-merriweather lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight max-lg:pb-6">
                Empowering the Future{" "}
                <span className="lg:block mt-2">
                 of{" "}
                  <span className="bg-primary bg-clip-text text-transparent">
                    <TypeAnimation
                      sequence={[
                        "Education.",
                        3000,
                        "Learning.",
                        3000,
                        "Excellence.",
                        3000,
                      ]}
                      wrapper="span"
                      speed={50}
                      repeat={Infinity}
                      cursor={true}
                    />
                  </span>
                </span>
              </h1>

              <p className="text-lg md:text-[19px] max-md:text-center my-6 text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
              Our platform is designed to empower both students and educators by
              providing comprehensive tools, structured learning resources, 
              and interactive features that support effective teaching and meaningful
                learning experiences.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3">
              {[
                { icon: CheckCircle, text: "WAEC/NECO CBT Practice", color: "text-green-500" },
                { icon: CheckCircle, text: "JAMB/UTME Preparation", color: "text-red-500" },
                { icon: CheckCircle, text: "AI-Powered Learning Tools", color: "text-purple-500" },
                { icon: CheckCircle, text: "Daily Quiz", color: "text-blue-500" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <feature.icon className={`w-5 h-5 ${feature.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-slate-700 dark:text-slate-200 font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center pb-2">
            {/* Get Started Button */}
            <Button
              size="lg"
              className="relative overflow-hidden group bg-primary-hover hover:bg-primary text-primary-foreground dark:text-white px-8 py-3 
              text-lg font-semibold shadow-elegant flex items-center justify-center transition-colors"
            >
              <div className="relative h-6 overflow-hidden">
                <span
                onClick={() => navigate('/login')}
                 className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  Get Started
                </span>
                <span
                onClick={() => navigate('/login')}
                  className="absolute left-0 top-full w-full text-center transition-transform duration-300 
                    ease-in-out group-hover:-translate-y-full text-white"
                >
                  Get Started
                </span>
              </div>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
                {/* chat-bot  */}
            {/* <ChatBot/> */}

            {/* Download Button */}
            <Button
              variant="outline"
              size="lg"
              className="relative overflow-hidden group border-2 border-primary text-primary hover:bg-primary px-8 py-3 text-lg font-semibold backdrop-blur-sm flex items-center justify-center dark:text-blue-300 dark:border-blue-300 transition-colors"
            >
              <div className="relative h-6 overflow-hidden ">
                  <a href="https://cbt.filloptech.com" className="no-underline"> 
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                 
                  Download CBT Guru
                </span>
                  </a>
                  <a href="https://cbt.filloptech.com" className="no-underline"> 
                <span
                  className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out
                   group-hover:-translate-y-full text-white"
                >
                  Get App Now
                </span>
                </a>

              </div>
            </Button>
          </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-3 border-t border-slate-200 dark:border-slate-700">
              {[
                { value: "50K+", label: "Students",color: "text-blue-500" },
                { value: "95%", label: "Success Rate",color: "text-green-500" },
                { value: "1000+", label: "Questions",color: "text-yellow-500" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className={ `text-3xl lg:text-3xl font-bold ${stat.color} bg-clip-text text- -mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:h-[350px] z-10 mt-9">
            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary rounded-2xl rotate-12 opacity-20 blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-2xl -rotate-12 opacity-20 blur-xl"></div>

            {/* Main Image Container */}
            <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              {/* Image */}
              <img
                src={hangoverImage}
                className="w-full h-[350px] object-cover"
                alt="Education background"
              />

            </div>
               {/* Floating Badge */}
            <Badge
              variant="secondary"
              className=" absolute md:min-w-[500px] top-0 right-0 mt-2 mr-4 inline-flex items-center gap-2 px-2 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border
               border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-xs font-semibold bg-primary-hover bg-clip-text text-transparent">
                Nigeria's #1 CBT Platform
              </span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 dark:bg-slate-500 rounded-full mt-2"></div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
