import { useState } from 'react'
import Header from '../../components/layouts/Header'
import HeroSection from '../../components/layouts/HeroSection'
import FeaturesSection from '../../components/layouts/FeaturesSection'
import AboutSection from '../../components/layouts/AboutSection'
import Contact from '../../components/layouts/Contact'
import Footer from '../../components/layouts/Footer'




const LandingPage = ()=>  {

  return (
    <>
       <div>
        <Header/>
        <HeroSection/>
        <main>
        <FeaturesSection/>
        <AboutSection/>
        <Contact/>
        <Footer/>
        </main>
       </div>
    </>
  )
}

export default LandingPage
