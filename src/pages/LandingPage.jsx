import { useState } from 'react'
import Header from '../components/layout/Header'
import HeroSection from '../components/layout/HeroSection'
import FeaturesSection from '../components/layout/FeaturesSection'
import AboutSection from '../components/layout/AboutSection'
import Contact from '../components/layout/Contact'
import Footer from '../components/layout/Footer'

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
