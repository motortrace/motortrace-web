import { Button } from "@mui/material"
import "../../../styles/variables.scss"
import "./Features.scss"
import FeatureCard from "./FeatureCard"
import Dahsboard from "../../../assets/images/dashboard.png"
import AssignTechnician from "../../../assets/images/assignTechnician.jpg"
import ManageInventory from "../../../assets/images/manageInventory.jpg"

import MobileFeatureCard from "./MobileFeatureCard"
import MobileUI1 from "../../../assets/images/mobileUI1.png"
import MobileUI2 from "../../../assets/images/mobileUI2.png"
import MobileUI3 from "../../../assets/images/mobileUI3.webp"

const Features = () => {
    return (

        <div id = "features">
            <h2 className = "service-center-features__title">
                Transform Your Service Center into a Revenue Driver with Us
            </h2>

            <div className="feature-cards-container">

                <FeatureCard
                    imageSrc={Dahsboard}
                    header="Run Your Service Centers Like the Pros"
                    description="Get enterprise-level insights, seamless workflow management, and professional reporting that makes your small shop operate like a high-end service center."
                />

                <FeatureCard
                    imageSrc={AssignTechnician}
                    header="Get Complete Control Over Your Service Center"
                    description="See every technician, every job, and every available slot at a glance. Schedule appointments, track service progress & eliminate the costings your money."
                />

                <FeatureCard
                    imageSrc={ManageInventory}
                    header="Never Say We Don't Have That Part Again"
                    description="Eliminate embarrassing stockouts and frustrated customers with intelligent inventory tracking that keeps your most-needed parts in stock while reducing overall inventory costs"
                />
            </div>

           <div className = "service-center-features__btn-container">
                {/* <button>Register as a Service Center</button> */}
                <Button variant = "outlined" color="primary" size="large" sx={{ textTransform: 'none', fontFamily: 'Poppins, sans-serif'}}>
                    Register as a Service Center
                </Button>
           </div>

           {/* To build excitement for mobile app */}

           <h2 className = "service-center-features__title">
                Take Complete Control of Your Car Care Experience
            </h2>

            <div className="feature-cards-container">

                <MobileFeatureCard 
                    imageSrc={MobileUI1}
                    header="Your Car's Complete Digital History"
                    description = "Never miss another service, forget a repair detail, or wonder about your vehicle's health again. Get instant access to everything your car needs to run like new."
                />

                <MobileFeatureCard 
                    imageSrc={MobileUI2}
                    header="Get Your Car Serviced Without the Hassle"
                    description="No more taking time off work or sitting in waiting rooms. Book online, drop off your car, and get back to your life while we handle everything else."
                />
                <MobileFeatureCard 
                    imageSrc={MobileUI3}
                    header="Never Wonder Is My Car Ready Yet"
                    description="Get real time updates on every step of your service from inspection to completion. Know exactly what is happening to your car and when you can pick it up."
                />

            </div>

           <div className = "service-center-features__btn-container">
                {/* <button>Download Your Car Care App</button> */}
                <Button variant = "outlined" color="primary" size="large" sx={{ textTransform: 'none', fontFamily: 'Poppins, sans-serif'}}>
                    Download Your Car Care App
                </Button>
           </div>

        </div>
    )
}

export default Features
