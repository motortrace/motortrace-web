import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { UserCog, Calendar, Check, X, Clock, BarChart3, DollarSign, Car, Wrench, PackageSearch } from "lucide-react"

import "../../../styles/variables.scss"
import './Hero.scss';
import HeroImg from "../../../assets/images/heroSectionImage.jpg"
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
                        Your All-in-One
                    </h1>
                    <h1 className="hero-section__title">
                        Car Care Platform
                    </h1>

                    <div className="hero-section__description">
                        <p>
                            <strong>Streamline your automotive business</strong> with our comprehensive platform. 
                            Whether you're a car owner, service center, or spare parts seller, Motor Trace 
                            connects everyone in the automotive ecosystem.
                        </p>

                    </div>

                    <div className="hero-section__stats">
                        <div className="stat-item">
                            <div className="stat-number">200+</div>
                            <div className="stat-label">Active Service Centers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">400+</div>
                            <div className="stat-label">Happy Car Users</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Spare Parts Sellers</div>
                        </div>
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

                    {/* Enhanced Floating Dashboard Elements */}
                    <div className="hero-section__floating-card hero-section__floating-card--assign">
                        <div className="card-header">
                            <span className="card-icon"><UserCog size={20} /></span>
                            <span className="card-title">Assign Technicians</span>
                        </div>
                        <div className="card-content">
                            <div className="technician-item">
                                <div className="technician-avatar">
                                    <img src={Mech1} alt="Technician 1" />
                                </div>
                                <div className="technician-info">
                                    <div className="technician-name">Amal Perera</div>
                                    <div className="technician-status">Available Now</div>
                                </div>
                                <div className="status-indicator status-indicator--active"></div>
                            </div>
                            <div className="technician-item">
                                <div className="technician-avatar technician-avatar--alt">
                                    <img src={Mech2} alt="Technician 2" />
                                </div>
                                <div className="technician-info">
                                    <div className="technician-name">Sirimal Silva</div>
                                    <div className="technician-status">On Break</div>
                                </div>
                                <div className="status-indicator"></div>
                            </div>
                        </div>
                    </div>

                    {/* New Manage Bookings Card */}
                    <div className="hero-section__floating-card hero-section__floating-card--bookings">
                        <div className="card-header">
                            <span className="card-icon"><Calendar size={20} /></span>
                            <span className="card-title">Manage Bookings</span>
                        </div>
                        <div className="card-content">
                            <div className="booking-item booking-item--new">
                                <div className="booking-info">
                                    <div className="booking-customer">Vishva Fernando</div>
                                    <div className="booking-service">
                                        <Car size={12} />
                                        <span>Oil Change - Toyota Aqua</span>
                                    </div>
                                    <div className="booking-time">
                                        <Clock size={10} />
                                        <span>3:00 PM Tommorow</span>
                                    </div>
                                </div>
                                <div className="booking-actions">
                                    <button className="action-btn action-btn--accept">
                                        <Check size={14} />
                                    </button>
                                    <button className="action-btn action-btn--decline">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="booking-item booking-item--confirmed">
                                <div className="booking-info">
                                    <div className="booking-customer">Ashen Bandara</div>
                                    <div className="booking-service">
                                        <Wrench size={12} />
                                        <span>Brake Repair</span>
                                    </div>
                                    <div className="booking-time">
                                        <Clock size={10} />
                                        <span>11:30 AM Today</span>
                                    </div>
                                </div>
                                <div className="booking-status booking-status--confirmed">
                                    ✓ Confirmed
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
                                <div className="review-text">"Excellent service!"</div>
                            </div>
                        </div>
                    </div>

                    {/* New Quick Stats Card */}
                    <div className="hero-section__floating-card hero-section__floating-card--stats">
                        <div className="card-content">
                            <div className="quick-stat">
                                <div className="stat-icon">
                                    {/* 📊 */}
                                    <BarChart3 color="var(--color-primary)" />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">15</div>
                                    <div className="stat-desc">Today's Bookings</div>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <div className="stat-icon">
                                    {/* 💰 */}
                                    <DollarSign color = 'var(--color-primary)' />
                                </div>
                                <div className="stat-info">
                                    <div className="stat-value">LKR 45K</div>
                                    <div className="stat-desc">Daily Revenue</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <Stack direction="row" spacing={1.5}>
                        <Button variant="outlined" color="primary" size="large" 
                                sx={{ textTransform: 'none', fontFamily: 'Poppins, sans-serif'}}>
                            <Car style={{ marginRight: "5px" }} />
                            Download App
                        </Button>

                        <Button variant="outlined" color="primary" size="large" 
                                sx={{ textTransform: 'none', fontFamily: 'Poppins, sans-serif'}}>
                            <Wrench style={{ marginRight: "5px" }}/>
                            Register Workshop  
                        </Button>

                        <Button variant="outlined" color="primary" size="large" 
                                sx={{ textTransform: 'none', fontFamily: 'Poppins, sans-serif'}}>
                            <PackageSearch style={{ marginRight: "5px" }} />
                            Join as Seller
                        </Button>
                    </Stack>
                </div>
            </div>
        </section>
    );
};

export default Hero;