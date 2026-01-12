import HowItWorks from "../../components/LandingPage/HowItWorks/HowItWorks"
import Footer from "../../components/LandingPage/Footer/Footer"
import Features from "../../components/LandingPage/Features/Features"
import Hero from "../../components/LandingPage/Hero/Hero"
import Header from "../../components/LandingPage/Header/Header"

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  )
}

export default LandingPage
