// import React from "react";
// import { TypeAnimation } from "react-type-animation";
// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
// // import heroVideo from "../assets/videos/cbtVideo.mp4";
// import hangoverImage from "../../assets/images/hero-education.jpg";

// const HeroSection = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       <div className="absolute inset-0 border-2 border-primary-foreground/20 rounded-lg overflow-hidden"
//       >
//         {/* <video
//           src={heroVideo}
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="w-full h-full object-cover"
//         /> */}
//         <img src={hangoverImage}
//          className="w-full h-full object-cover object-bottom"
//          alt=""
//           />

//         {/* Black + Blue Transparent Overlay */}
//         <div className="absolute inset-0 bg-black/40 ">
//           {/* Cinematic Vignette */}
//           <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_70%,rgba(0,0,0,0.9)_100%)]"></div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 container mx-auto px-4 py-20 mt-1 text-center">
//         <div className="max-w-4xl mx-auto">
//           {/* Badge */}
//           <Badge
//             variant="secondary"
//             className="mb-6 px-4 py-2 text-sm font-medium flex items-center"
//           >
//             <div className="relative w-full overflow-hidden ">
//               <div className="flex items-center animate-slide text-blue-400 font-medium">
//                 <Award className="w-4 h-4 mr-2 text-yellow-500" />
//                 Welcome to Fillop Study Platform! Nigeria's #1 CBT Platform
//               </div>
//             </div>
//           </Badge>

//           {/* Main Heading */}

//           <h1 className="text-5xl md:text-6xl font-merriweather font-bold text-primary-foreground mb-6 leading-tight">
//             Empowering the Future of{" "}
//             <span className="text-primaryHover inline-block min-w-[9ch]  mt-2">
//               <TypeAnimation
//                 sequence={[
//                   "Education.",
//                   5000,
//                   "Learning.",
//                   5000,
//                   "Excellence.",
//                   5000,
//                 ]}
//                 wrapper="span"
//                 speed={40}
//                 repeat={Infinity}
//                 cursor={true}
//               />
//             </span>
//           </h1>

//           {/* Subheading */}
//           <p className="text-xl md:text-base text-primary-foreground/90  mb-8 tracking-wide leading-relaxed max-w-3xl mx-auto">
//             Our platform is designed to help students and teachers alike by
//             providing a comprehensive set of tools and resources to support
//             their learning journey. Join us to experience a seamless and
//             innovative approach to education.
//           </p>

//           {/* Feature Pills */}
//           <div className="flex flex-wrap justify-center gap-4 mb-10">
//             <div className="flex items-center space-x-2 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2">
//               <BookOpen className="w-5 h-5 text-accent" />
//               <span className="text-primary-foreground font-medium text-sm">
//                 WAEC/NECO CBT
//               </span>
//             </div>
//             <div className="flex items-center space-x-2 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2">
//               <Users className="w-5 h-5 text-education-orange" />
//               <span className="text-primary-foreground font-medium text-sm">
//                 JAMB/UTME Prep
//               </span>
//             </div>
//             <div className="flex items-center space-x-2 bg-background/20 backdrop-blur-sm rounded-full px-4 py-2">
//               <Award className="w-5 h-5 text-blue-700 " />
//               <span className="text-primary-foreground font-medium text-sm">
//                 AI-Powered Learning
//               </span>
//             </div>
//           </div>

//           {/* CTA Buttons */}

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
//             {/* Get Started Button */}
//             <Button
//               size="lg"
//               className="relative overflow-hidden group bg-primary-hover hover:bg-primary-hover text-primary-foreground px-8 py-3 
//               text-lg font-semibold shadow-elegant flex items-center justify-center"
//             >
//               <div className="relative h-6 overflow-hidden">
//                 <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
//                   Get Started
//                 </span>
//                 <span
//                   className="absolute left-0 top-full w-full text-center transition-transform duration-300 
//                     ease-in-out
//                 group-hover:-translate-y-full text-white"
//                 >
//                   Get Started
//                 </span>
//               </div>
//               <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//             </Button>

//             {/* Download Button */}
//             <Button
//               variant="outline"
//               size="lg"
//               className="relative overflow-hidden group border-2 border-primary-foreground/30 text-primary
//      hover:bg-primary-foreground/10 px-8 py-3 text-lg font-semibold backdrop-blur-sm flex items-center justify-center"
//             >
//               <div className="relative h-6 overflow-hidden">
//                 <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
//                   Download CBT Guru
//                 </span>
//                 <span
//                   className="absolute left-0 top-full w-full text-center transition-transform duration-300 ease-in-out
//        group-hover:-translate-y-full text-white"
//                 >
//                   Get App Now
//                 </span>
//               </div>
//             </Button>
//           </div>

//           {/* Stats */}
//           <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-blue-700 mb-2">
//                 50,000+
//               </div>
//               <div className="text-primary-foreground/80">
//                 Students Enrolled
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-education-orange mb-2">
//                 95%
//               </div>
//               <div className="text-primary-foreground/80">Success Rate</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-blue-700  mb-2">
//                 1000+
//               </div>
//               <div className="text-primary-foreground/80">
//                 Practice Questions
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
//           <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2"></div>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default HeroSection;


import React from "react";
import { TypeAnimation } from "react-type-animation";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
import hangoverImage from "../../assets/images/hero-education.jpg";
// import ChatBot from "../../chat-bot/BotChat";




const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background dark:bg-backround transition-colors duration-500"
    >
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 border-2 border-primary-foreground/20 rounded-lg overflow-hidden">
        <img
          src={hangoverImage}
          className="w-full h-full object-cover object-[50%_5%]"
          alt="Education background"
        />

        {/* Transparent Overlay */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70 transition-colors duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_70%,rgba(0,0,0,0.9)_100%)]"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 mt-1 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium flex items-center bg-background/60 dark:bg-background/30 transition-colors"
          >
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center animate-slide text-blue-400 font-medium">
                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                Welcome to Fillop Study Platform! Nigeria's #1 CBT Platform
              </div>
            </div>
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-merriweather font-bold text-primary-foreground text-white/90 mb-6 leading-tight transition-colors">
            Empowering the Future of{" "}
            <span className="text-primary-hover dark:text-primary-hover inline-block min-w-[9ch] mt-2">
              <TypeAnimation
                sequence={[
                  "Education.",
                  5000,
                  "Learning.",
                  5000,
                  "Excellence.",
                  5000,
                ]}
                wrapper="span"
                speed={40}
                repeat={Infinity}
                cursor={true}
              />
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-base text-primary-foreground/90 dark:text-foreground/90 mb-8 tracking-wide leading-relaxed max-w-3xl mx-auto transition-colors">
            Our platform is designed to help students and teachers alike by
            providing a comprehensive set of tools and resources to support
            their learning journey. Join us to experience a seamless and
            innovative approach to education.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center space-x-2 bg-background/20 dark:bg-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 transition-colors">
              <BookOpen className="w-5 h-5 text-accent text-white/70" />
              <span className="text-primary-foreground font-medium text-sm dark:text-white/90">
                WAEC/NECO CBT
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-background/20 dark:bg-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 transition-colors">
              <Users className="w-5 h-5 text-education-orange" />
              <span className="text-primary-foreground font-medium text-sm dark:text-white/90">
                JAMB/UTME Prep
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-background/20 dark:bg-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 transition-colors">
              <Award className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              <span className="text-primary-foreground font-medium text-sm dark:text-white/90">
                AI-Powered Learning
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {/* Get Started Button */}
            <Button
              size="lg"
              className="relative overflow-hidden group bg-primary-hover hover:bg-primary text-primary-foreground dark:text-white px-8 py-3 
              text-lg font-semibold shadow-elegant flex items-center justify-center transition-colors"
            >
              <div className="relative h-6 overflow-hidden">
                <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
                  Get Started
                </span>
                <span
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
              className="relative overflow-hidden group border-2 border-primary-foreground/30 text-primary hover:bg-primary-foreground/10 px-8 py-3 text-lg font-semibold backdrop-blur-sm flex items-center justify-center dark:text-blue-300 dark:border-blue-300 transition-colors"
            >
              <div className="relative h-6 overflow-hidden">
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
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                50,000+
              </div>
              <div className="text-primary-foreground/80 dark:text-foreground/80">
                Students Enrolled
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-education-orange mb-2">
                95%
              </div>
              <div className="text-primary-foreground/80 dark:text-foreground/80">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                1000+
              </div>
              <div className="text-primary-foreground/80 dark:text-foreground/80">
                Practice Questions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 dark:border-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 dark:bg-foreground/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
