// import { Button } from "../ui/button";
// import { Badge } from "../ui/badge";
// import { Target, Users, Award, ArrowRight } from "lucide-react";

// const AboutSection = () => {
//   return (
//     <section
//       className="py-0 bg-gradient-to-b from-background to-muted/30"
//       id="about"
//     >
//       <div className="container mx-auto px-4 md:px-8">
//         {/* Header */}
//         <div className="text-center max-w-3xl mx-auto mb-10">
//           <Badge
//             variant="outline"
//             className="mb-6 px-4 py-2 rounded-full text-sm tracking-wide"
//           >
//             About Fillop Tech
//           </Badge>
//           <h2 className="text-4xl md:text-5xl font-extrabold text-gray-700 mb-6 leading-tight">
//             Transforming Education Through
//             <span className="text-primary-hover"> Innovation</span>
//           </h2>
//           <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
//             Fillop is a platform designed to enhance learning experiences by
//             providing seamless access to educational resources and tools. Our
//             mission is to empower learners and educators worldwide.
//           </p>
//         </div>

//         {/* Mission & Vision */}
//         <div className="grid lg:grid-cols-2 gap-12 items-start mb-24">
//           <div className="space-y-10">
//             <div className="p-6 bg-background rounded-2xl shadow-sm hover:shadow-md transition">
//               <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
//               <p className="text-muted-foreground">
//                 To empower every student with the tools, knowledge, and
//                 confidence they need to excel in their WAEC, NECO, and JAMB
//                 examinations through innovative technology and personalized
//                 learning.
//               </p>
//             </div>
//             <div className="p-6 bg-background rounded-2xl shadow-sm hover:shadow-md transition">
//               <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
//               <p className="text-muted-foreground">
//                 To become Nigeria's leading educational technology platform,
//                 revolutionizing how students prepare for standardized
//                 examinations and achieve academic success.
//               </p>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <h3 className="text-2xl font-bold mb-4">Why Students Choose Us</h3>
//             <div className="grid gap-6">
//               {[
//                 {
//                   icon: Award,
//                   title: "Proven Results",
//                   description:
//                     "95% of our students report improved exam performance and confidence levels.",
//                 },
//                 {
//                   icon: Users,
//                   title: "Expert Team",
//                   description:
//                     "Our content is created by experienced educators and examination specialists.",
//                 },
//                 {
//                   icon: Target,
//                   title: "Focused Approach",
//                   description:
//                     "Tailored specifically for Nigerian examination systems and curriculum requirements.",
//                 },
//               ].map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-start gap-4 p-6 rounded-lg bg-muted/40 backdrop-blur-sm border 
//                   hover:bg-muted/60 transition"
//                 >
//                   <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
//                     <item.icon className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
//                     <p className="text-sm text-muted-foreground">
//                       {item.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Features Stats */}
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-3xl shadow-xl px-4 py-8 md:p-16 
//         text-white">
//           <div className="text-center mb-12">
//             <h3 className="text-3xl md:text-4xl font-bold mb-4">
//               Comprehensive Learning Ecosystem
//             </h3>
//             <p className="text-md text-white/80 max-w-2xl mx-auto">
//               Our platform goes beyond just providing content; it's an
//               all-encompassing tool that helps students prepare effectively,
//               track their progress, and build confidence.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//             {/* Subjects */}
//             <div className="space-y-2">
//               <div className="text-4xl font-extrabold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
//                 10+
//               </div>
//               <p className="text-sm md:text-base text-white/70">
//                 Subjects Covered
//               </p>
//             </div>

//             {/* Modules */}
//             <div className="space-y-2">
//               <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">
//                 15
//               </div>
//               <p className="text-sm md:text-base text-white/70">
//                 Learning Modules
//               </p>
//             </div>

//             {/* AI Support */}
//             <div className="space-y-2">
//               <div className="text-4xl font-extrabold bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg">
//                 24/7
//               </div>
//               <p className="text-sm md:text-base text-white/70">AI Support</p>
//             </div>

//             {/* Coverage */}
//             <div className="space-y-2">
//               <div className="text-4xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
//                 100%
//               </div>
//               <p className="text-sm md:text-base text-white/70">
//                 Syllabus Coverage
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="text-center mt-20">
//           <h3 className="text-3xl md:text-4xl font-bold mb-6">
//             Ready to Start Your Success Journey?
//           </h3>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
//             Join thousands of students who have transformed their academic
//             performance with Fillop Tech.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button
//               size="lg"
//               className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 group rounded-lg shadow-lg"
//             >
//               Get Started Today
//               <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//             </Button>
//             <Button
//               variant="outline"
//               size="lg"
//               className="px-8 py-3 rounded-lg"
//             >
//               Learn More
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;


import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Target, Users, Award, ArrowRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-background dark:via-muted/20 dark:to-muted/40"
    >
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="mb-6 px-5 py-2.5 rounded-full text-sm tracking-wide text-primary border-primary/40"
          >
            About Fillop Tech
          </Badge>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 leading-tight">
            Transforming Education Through{" "}
            <span className="text-primary">Innovation</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Fillop is a platform designed to enhance learning experiences by
            providing seamless access to educational resources and tools. Our
            mission is to empower learners and educators worldwide.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-14 items-start mb-24">
          <div className="space-y-10">
            <div className="p-8 bg-white/70 dark:bg-muted rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To empower every student with the tools, knowledge, and
                confidence they need to excel in their WAEC, NECO, and JAMB
                examinations through innovative technology and personalized
                learning.
              </p>
            </div>

            <div className="p-8 bg-white/70 dark:bg-muted rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To become Nigeria's leading educational technology platform,
                revolutionizing how students prepare for standardized
                examinations and achieve academic success.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Why Students Choose Us
            </h3>
            <div className="grid gap-6">
              {[
                {
                  icon: Award,
                  title: "Proven Results",
                  description:
                    "95% of our students report improved exam performance and confidence levels.",
                },
                {
                  icon: Users,
                  title: "Expert Team",
                  description:
                    "Our content is created by experienced educators and examination specialists.",
                },
                {
                  icon: Target,
                  title: "Focused Approach",
                  description:
                    "Tailored specifically for Nigerian examination systems and curriculum requirements.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-5 p-6 rounded-xl bg-gray-50 dark:bg-muted/60 border border-gray-200 dark:border-muted hover:bg-gray-100 dark:hover:bg-muted transition"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-3xl shadow-2xl px-6 py-12 md:px-16 text-white">
          <div className="text-center mb-14">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Learning Ecosystem
            </h3>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Our platform goes beyond just providing content; it's an
              all-encompassing tool that helps students prepare effectively,
              track their progress, and build confidence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "Subjects Covered" },
              { value: "15", label: "Learning Modules" },
              { value: "24/7", label: "AI Support" },
              { value: "100%", label: "Syllabus Coverage" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-200 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
                  {item.value}
                </div>
                <p className="text-sm md:text-base text-white/80">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-5">
            Ready to Start Your Success Journey?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of students who have transformed their academic
            performance with Fillop Tech.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-10 py-4 group rounded-lg shadow-lg text-base font-semibold"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-10 py-4 text-base font-semibold rounded-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
