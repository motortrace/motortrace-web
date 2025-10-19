import { Button } from "@mui/material"
import "../../../styles/variables.scss"
import "./Features.scss"

import MobileFeatureCard from "./MobileFeatureCard"
import MobileUI1 from "../../../assets/images/mobileUI1.png"
import MobileUI2 from "../../../assets/images/mobileUI2.png"
import MobileUI3 from "../../../assets/images/mobileUI3.webp"
import { Download } from "lucide-react"

const Features = () => {
    return (

        <div id = "features">

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
                <Button variant = "outlined" 
                        color="primary" 
                        size="large" 
                        sx={{ 
                            textTransform: 'none', 
                            fontFamily: 'Poppins, sans-serif', 
                            padding: '10px 25px'
                        }}
                >
                    <Download style={{ marginRight: "7.5px"}} />
                    Download MotorTrace Mobile App
                </Button>
           </div>

        </div>
    )
}

export default Features
