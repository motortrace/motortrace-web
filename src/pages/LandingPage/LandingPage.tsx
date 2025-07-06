import Navbar from "../../components/LandingPage/Navbar/Navbar"
import HowItWorks from "../../components/LandingPage/HowItWorks/HowItWorks"
import Footer from "../../components/LandingPage/Footer/Footer"
import Features from "../../components/LandingPage/Features/Features"
import Hero from "../../components/LandingPage/Hero/Hero"

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}

export default LandingPage
