import { useState } from 'react'
import Header from '../../components/layouts/Header'
import HeroSection from '../../components/layouts/HeroSection'
import FeaturesSection from '../../components/layouts/FeaturesSection'
import AboutSection from '../../components/layouts/AboutSection'
import Contact from '../../components/layouts/Contact'
import Footer from '../../components/layouts/Footer'
import BotChat from '../../chat-bot/BotChat'



const LandingPage = ()=>  {

  return (
    <>
       <div>
        <Header/>
        <HeroSection/>
        <BotChat/>
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
