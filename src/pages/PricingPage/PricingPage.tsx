import Header from '../../components/LandingPage/Header/Header';
import Footer from '../../components/LandingPage/Footer/Footer';
import Button from '@mui/material/Button';
import { Wrench, PackageSearch, Check, Users, BarChart3, Calendar, Settings, ShoppingCart, Truck, Star } from "lucide-react";
import "./Pricing.scss";

interface PricingProps {
    className?: string;
}

const PricingPage: React.FC<PricingProps> = ({ className = '' }) => {
    const handleContactUs = () => {
        // Redirect to contact us page
        window.location.href = '/contact';
    };

    return (
        <>
            <Header />
            <section className={`pricing-section ${className}`}>
            <div className="pricing-section__container">
                {/* Header */}
                <div className="pricing-section__header">
                    <h1 className="pricing-section__title">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="pricing-section__subtitle">
                        Simple, transparent pricing designed for your automotive business needs.
                        No hidden fees, no complicated tiers - just powerful features at fair prices.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="pricing-section__cards">
                    {/* Service Center Plan */}
                    <div className="pricing-card pricing-card--service">
                        <div className="pricing-card__header">
                            <div className="pricing-card__icon">
                                <Wrench size={32} />
                            </div>
                            <h3 className="pricing-card__title">Service Center</h3>
                            <p className="pricing-card__description">
                                Complete workshop management solution for automotive service centers
                            </p>
                        </div>

                        <div className="pricing-card__price">
                            <span className="price-currency">LKR</span>
                            <span className="price-amount">8,500</span>
                            <span className="price-period">/month</span>
                        </div>

                        <div className="pricing-card__features">
                            <h4 className="features-title">Everything you need:</h4>
                            <ul className="features-list">
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Unlimited vehicle inspections</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Technician management & assignment</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Booking & appointment system</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Customer management portal</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Invoice & billing management</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Inventory tracking</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Performance analytics</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Mobile app access</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>24/7 dedicated support</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pricing-card__stats">
                            <div className="stat-item">
                                <Users size={20} />
                                <span>Up to 10 technicians</span>
                            </div>
                            <div className="stat-item">
                                <BarChart3 size={20} />
                                <span>Advanced reporting</span>
                            </div>
                        </div>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            fullWidth
                            onClick={handleContactUs}
                            className="pricing-card__button"
                            sx={{ 
                                textTransform: 'none', 
                                fontFamily: 'Poppins, sans-serif',
                                padding: '14px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            Get Started Today
                        </Button>

                        <p className="pricing-card__note">
                            Perfect for workshops with 5-50 service bays
                        </p>
                    </div>

                    {/* Parts Seller Plan */}
                    <div className="pricing-card pricing-card--parts">
                        <div className="pricing-card__header">
                            <div className="pricing-card__icon">
                                <PackageSearch size={32} />
                            </div>
                            <h3 className="pricing-card__title">Parts Seller</h3>
                            <p className="pricing-card__description">
                                Comprehensive inventory and sales management for spare parts dealers
                            </p>
                        </div>

                        <div className="pricing-card__price">
                            <span className="price-currency">LKR</span>
                            <span className="price-amount">6,500</span>
                            <span className="price-period">/month</span>
                        </div>

                        <div className="pricing-card__features">
                            <h4 className="features-title">Everything you need:</h4>
                            <ul className="features-list">
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Unlimited product listings</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Advanced inventory management</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Order processing & tracking</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Supplier management system</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Automated stock alerts</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Sales analytics & reports</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Multi-location support</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Customer portal access</span>
                                </li>
                                <li className="feature-item">
                                    <Check size={18} />
                                    <span>Priority customer support</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pricing-card__stats">
                            <div className="stat-item">
                                <ShoppingCart size={20} />
                                <span>Unlimited transactions</span>
                            </div>
                            <div className="stat-item">
                                <Truck size={20} />
                                <span>Delivery management</span>
                            </div>
                        </div>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            fullWidth
                            onClick={handleContactUs}
                            className="pricing-card__button"
                            sx={{ 
                                textTransform: 'none', 
                                fontFamily: 'Poppins, sans-serif',
                                padding: '14px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            Get Started Today
                        </Button>

                        <p className="pricing-card__note">
                            Ideal for parts dealers and distributors
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pricing-section__bottom">
                    <div className="pricing-section__support">
                        <h4>Need something custom?</h4>
                        <p>Enterprise solutions available for large operations with multiple locations.</p>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={handleContactUs}
                            sx={{ 
                                textTransform: 'none', 
                                fontFamily: 'Poppins, sans-serif',
                                marginTop: '12px'
                            }}
                        >
                            Contact Sales Team
                        </Button>
                    </div>
                </div>
            </div>
        </section>
            <Footer />
        </>
    );
}; 

export default PricingPage; 