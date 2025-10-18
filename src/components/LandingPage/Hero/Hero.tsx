import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Calendar, Clock, Car, Wrench, Users, Smartphone } from "lucide-react"

import "../../../styles/variables.scss"
import './Hero.scss';
// import HeroImg from "../../../assets/images/heroSectionImage.jpg"
import HeroImg from "../../../assets/images/landingBgImage.png"
import Mech1 from "../../../assets/images/mech1.jpg"
import Mech2 from "../../../assets/images/mech2.jpg"
import UserPic from "../../../assets/images/userPic.jpg"

interface HeroSectionProps {
    className?: string;
}

const Hero: React.FC<HeroSectionProps> = ({ className = '' }) => {
    return (
        <section className={`hero-section ${className}`}>
            <div className="hero-section__container">
                {/* Left Content */}
                <div className="hero-section__content">

                    <h1 className="hero-section__title">
                        Your Trusted
                    </h1>
                    <h1 className="hero-section__title">
                        Car Service Partner
                    </h1>

                    <div className="hero-section__description">
                        <p style={{ textAlign: 'justify', paddingRight: '6rem' }}>
                            Simplify car care with MotorTrace. Book services, track your repairs live, and keep your entire service history in one easy-to-use mobile app.
                        </p>

                    </div>

                    {/* <div className="hero-section__stats">
                        <div className="stat-item">
                            <div className="stat-number">1000+</div>
                            <div className="stat-label">Vehicles Serviced</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Happy Customers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">5★</div>
                            <div className="stat-label">Trusted Rating</div>
                        </div>
                    </div> */}

                    <div className="hero-section__stats">
                        <Stack direction="row" spacing={1.5} style={{ marginLeft: '5rem' }}>
                            <Button variant="contained" color="primary" size="large"
                                sx={{
                                    textTransform: 'none', fontFamily: 'Poppins, sans-serif',
                                    padding: '10px 25px',
                                    backgroundColor: 'var(--color-primary)',
                                    '&:hover': { backgroundColor: 'var(--color-primary-dark)' }
                                }}>
                                <Smartphone style={{ marginRight: "7.5px" }} />
                                Download MotorTrace Mobile App
                            </Button>
                        </Stack>
                    </div>
                </div>

                {/* Right Dashboard Mockup */}
                <div className="hero-section__dashboard">
                    <div className="hero-section__person">
                        <img
                            src={HeroImg}
                            alt="Professional using Motor Trace platform"
                            className="hero-section__person-image"
                        />
                    </div>

                    {/* Service Progress Tracking Card */}
                    <div className="hero-section__floating-card hero-section__floating-card--assign">
                        <div className="card-header">
                            <span className="card-icon"><Clock size={20} /></span>
                            <span className="card-title">Track Service Progress</span>
                        </div>
                        <div className="card-content">
                            <div className="technician-item">
                                <div className="technician-avatar">
                                    <img src={Mech1} alt="Technician 1" />
                                </div>
                                <div className="technician-info">
                                    <div className="technician-name">Amal Perera</div>
                                    <div className="technician-status">Oil Change - 100%</div>
                                </div>
                                <div className="status-indicator status-indicator--active"></div>
                            </div>
                            <div className="technician-item">
                                <div className="technician-avatar technician-avatar--alt">
                                    <img src={Mech2} alt="Technician 2" />
                                </div>
                                <div className="technician-info">
                                    <div className="technician-name">Sirimal Silva</div>
                                    <div className="technician-status">Brake Service - 25%</div>
                                </div>
                                <div className="status-indicator"></div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Appointments Card */}
                    <div className="hero-section__floating-card hero-section__floating-card--bookings">
                        <div className="card-header">
                            <span className="card-icon"><Calendar size={20} /></span>
                            <span className="card-title">View Work Order Flow</span>
                        </div>
                        <div className="card-content">
                            <div className="booking-item booking-item--confirmed">
                                <div className="booking-info">
                                    <div className="booking-customer">Amal Perera</div>
                                    <div className="booking-service">
                                        <Car size={12} />
                                        <span>Oil Change</span>
                                    </div>
                                    <div className="booking-time">
                                        <Clock size={10} />
                                        <span>Completed at 10:55 AM </span>
                                    </div>
                                </div>
                                <div className="booking-status booking-status--confirmed">
                                    ✓ Done
                                </div>
                            </div>
                            <div className="booking-item booking-item--new">
                                <div className="booking-info">
                                    <div className="booking-customer">Sirimal Silva</div>
                                    <div className="booking-service">
                                        <Wrench size={12} />
                                        <span>Brake Repair</span>
                                    </div>
                                    <div className="booking-time">
                                        <Clock size={10} />
                                        <span>Started at 11:00 AM </span>
                                    </div>

                                </div>
                                <div className="booking-status booking-status--in-progress">
                                    🔄 In Progress
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-section__floating-card hero-section__floating-card--rating">
                        <div className="card-content">
                            <div className="rating-avatar">
                                <img src={UserPic} alt="Customer review" />
                            </div>
                            <div className="customer-review">
                                <div className="rating-stars">
                                    <span>⭐⭐⭐⭐⭐</span>
                                </div>
                                <div className="review-text">"Love the app! Real-time updates are amazing!"</div>
                            </div>
                        </div>
                    </div>

                    {/* App Usage Stats Card */}
                    <div className="hero-section__floating-card hero-section__floating-card--stats">
                        <div className="card-content">
                            <div className="quick-stat">
                                <div className="stat-icon">
                                    <Car color="var(--color-primary)" />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">500+</div>
                                    <div className="stat-desc">Vehicles Serviced</div>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <div className="stat-icon">
                                    <Users color='var(--color-primary)' />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">350+</div>
                                    <div className="stat-desc">Happy Customers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
};

export default Hero;