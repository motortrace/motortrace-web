
import { useState } from 'react';
import Header from '../../components/LandingPage/Header/Header';
import Footer from '../../components/LandingPage/Footer/Footer';
import { Car, Wrench, Sparkles, Check, Smartphone, Clock } from 'lucide-react';
import './Pricing.scss';

interface Service {
    id: 'service' | 'repair' | 'detailing';
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    lightGradient: string;
    accentColor: string;
    borderColor: string;
    description: string;
    features: string[];
    duration: string;
    badge: string;
    price: string;
    highlight: boolean;
}

interface ServiceColors {
    service: { gradient: string; light: string };
    repair: { gradient: string; light: string };
    detailing: { gradient: string; light: string };
}

export default function PricingPage() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const handleBookService = (serviceName: string): void => {
        console.log(`Booking ${serviceName}`);
    };

    const services: Service[] = [
        {
            id: 'service',
            title: 'Full Vehicle Service',
            icon: Car,
            gradient: 'from-blue-500 to-blue-600',
            lightGradient: 'from-blue-50 to-blue-100',
            accentColor: 'text-blue-600',
            borderColor: 'border-blue-200',
            description: 'Comprehensive maintenance to keep your car running smoothly',
            features: [
                'Engine oil & filter change',
                'Air filter replacement',
                'Brake system inspection',
                'Tire pressure & condition check',
                'Battery & electrical test',
                'Fluid level inspection'
            ],
            duration: '3-5 hours',
            badge: 'Most Popular',
            price: 'Starting at LKR 10,000',
            highlight: true
        },
        {
            id: 'repair',
            title: 'Engine Diagnostics & Fix',
            icon: Wrench,
            gradient: 'from-teal-500 to-teal-600',
            lightGradient: 'from-teal-50 to-teal-100',
            accentColor: 'text-teal-600',
            borderColor: 'border-teal-200',
            description: 'Advanced diagnostics with precision repairs',
            features: [
                'Computer diagnostic scan',
                'Engine performance analysis',
                'Emission system check',
                'Fuel system inspection',
                'Transmission diagnostics',
                'Detailed repair report'
            ],
            duration: '5-7 hours',
            badge: 'Expert Technicians',
            price: 'Starting at LKR 25,000',
            highlight: false
        },
        {
            id: 'detailing',
            title: 'Interior & Exterior Detailing',
            icon: Sparkles,
            gradient: 'from-emerald-500 to-emerald-600',
            lightGradient: 'from-emerald-50 to-emerald-100',
            accentColor: 'text-emerald-600',
            borderColor: 'border-emerald-200',
            description: 'Professional detailing for showroom perfection',
            features: [
                'Exterior wash & wax',
                'Interior vacuum & cleaning',
                'Dashboard & console polish',
                'Leather seat conditioning',
                'Window cleaning',
                'Tire shine & rim cleaning'
            ],
            duration: '2-4 hours',
            badge: 'Premium Quality',
            price: 'Starting at LKR 15,000',
            highlight: false
        }
    ];

    const serviceColors: ServiceColors = {
        service: { gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', light: 'linear-gradient(135deg, #eff6ff, #dbeafe)' },
        repair: { gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)', light: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)' },
        detailing: { gradient: 'linear-gradient(135deg, #10b981, #059669)', light: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }
    };

    return (
        <>
            <Header />
            <div className="ep-container">
                {/* Animated Background Shapes */}
                <div className="ep-bg-shapes">
                    <div className="ep-blob ep-blob-1"></div>
                    <div className="ep-blob ep-blob-2"></div>
                    <div className="ep-blob ep-blob-3"></div>
                </div>

                {/* Content */}
                <div className="ep-content">
                    {/* Hero Section */}
                 

                    {/* Pricing Cards Section */}
                    <section className="ep-services">
                        <div className="ep-services__header">
                            <h2 className="ep-services__title">Our Popular Services</h2>
                            <p className="ep-services__subtitle">Choose from our most popular services or explore more in the app</p>
                        </div>

                        {/* Cards Grid */}
                        <div className="ep-cards-grid">
                            {services.map((service, idx) => {
                                const Icon = service.icon;
                                const isHovered = hoveredCard === idx;
                                const colorScheme = serviceColors[service.id];

                                return (
                                    <div
                                        key={idx}
                                        onMouseEnter={() => setHoveredCard(idx)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        className={`ep-service-card ${service.highlight ? 'ep-service-card--highlight' : ''} ${isHovered ? 'ep-service-card--hovered' : ''}`}
                                    >
                                        {/* Background Accent */}
                                        <div
                                            className="ep-service-card__accent"
                                            style={{ background: colorScheme.light }}
                                        ></div>

                                        {/* Badge */}
                                        {service.highlight && (
                                            <div className="ep-service-card__badge ep-service-card__badge--primary">
                                                ⭐ {service.badge}
                                            </div>
                                        )}
                                        {!service.highlight && (
                                            <div className="ep-service-card__badge ep-service-card__badge--secondary">
                                                {service.badge}
                                            </div>
                                        )}

                                        {/* Icon */}
                                        <div
                                            className="ep-service-card__icon"
                                            style={{ background: colorScheme.gradient }}
                                        >
                                            <Icon className="ep-service-card__icon-svg" />
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="ep-service-card__title">{service.title}</h3>
                                        <p className="ep-service-card__description">{service.description}</p>

                                        {/* Features List */}
                                        <div className="ep-service-card__features">
                                            {service.features.map((feature, fidx) => (
                                                <div key={fidx} className="ep-service-card__feature-item">
                                                    <Check className="ep-service-card__feature-icon" />
                                                    <span className="ep-service-card__feature-text">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Duration & Price */}
                                        <div className="ep-service-card__footer">
                                            <div className="ep-service-card__duration">
                                                <Clock className="ep-service-card__duration-icon" />
                                                <span>{service.duration}</span>
                                            </div>
                                            <p className={`ep-service-card__price ${service.highlight ? 'ep-service-card__price--highlight' : ''}`}>
                                                {service.price}
                                            </p>
                                        </div>

                                        
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="ep-cta">
                        <div className="ep-cta__inner">
                            <div className="ep-cta__bg-shapes">
                                <div className="ep-cta__bg-circle ep-cta__bg-circle--1"></div>
                                <div className="ep-cta__bg-circle ep-cta__bg-circle--2"></div>
                            </div>

                            <div className="ep-cta__content">
                                <h2 className="ep-cta__title">Ready to Experience the Difference?</h2>
                                <p className="ep-cta__subtitle">
                                    Download the MotorTrace app to explore all services, get real-time updates, and join thousands of happy car owners.
                                </p>

                                <button className="ep-cta__button">
                                    <Smartphone className="ep-cta__button-icon" />
                                    Download Free App
                                </button>
                            </div>
                        </div>
                    </section>

                    
                </div>
            </div>

            <Footer />
        </>
    );
}