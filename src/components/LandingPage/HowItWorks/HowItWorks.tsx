import React from 'react';
import {
  Calendar,
  Star,
  Clock,
  ShieldCheck, 
  Download
} from 'lucide-react';
import "../../../styles/variables.scss"
import './HowItWorks.scss';

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon}) => (
  <div className={`step`}>
    <div className="step-number">{number}</div>
    <div className="step-header">
      <div className="step-icon">{icon}</div>
      <h3 className="step-title">{title}</h3>
    </div>
    <div className="step-content">
      <p className="step-description">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {

  const carUserSteps = [
    {
      number: '01',
      title: 'Download MotorTrace App',
      description: 'Download our mobile app and create your profile with vehicle details for personalized service recommendations.',
      icon: <Download size={24} />
    },
    {
      number: '02',
      title: 'Book Your Service',
      description: 'Browse our service offerings, check availability, and book your preferred time slot with just a few taps.',
      icon: <Calendar size={24} />
    },
    {
      number: '03',
      title: 'Secure Your Appointment',
      description: 'Make a convenient advance payment to confirm your booking and receive a unique QR code for seamless check-in.',
      icon: <ShieldCheck size={24} />
    },
    {
      number: '04',
      title: 'Track Service Progress',
      description: 'Track your vehicle service in real-time and receive live updates from check-in to completion.',
      icon: <Clock size={24} />
    },
    {
      number: '05',
      title: 'Review & Rate Service',
      description: "Review your completed service, rate your experience, and help us maintain our high quality standards.",
      icon: <Star size={24} />
    },
    {
      number: '06',
      title: 'Access Service History',
      description: "View your complete service history, upcoming maintenance reminders, and keep track of all your vehicle's care.",
      icon: <Clock size={24} />
    }
  ];

  const getCurrentSteps = () => {
    return carUserSteps;
  };

  return (
    <section id = "how-it-works" className = "how-it-works">
      <div className="container">
        {/* Header */}
        <div className="how-it-works-header">
          <h2 className="section-title">How MotorTrace Works</h2>
          <p className="section-subtitle">
            Experience seamless car service with our trusted automotive service center. 
            Download our app and enjoy digital convenience, real-time tracking, and complete service transparency.
          </p>
        </div>

        {/* Steps */}
        <div className="steps-container">
          <div className="steps-grid">
            {getCurrentSteps().map((step, index) => (
              <Step
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;