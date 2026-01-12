import React, { useState } from 'react';
import { Button, Stack } from '@mui/material';
import {
  Car,
  Wrench,
  Package,
  PackagePlus,
  Calendar,
  QrCode,
  MessageCircle,
  Star,
  Users,
  TrendingUp,
  Clock,
  ShieldCheck,
  Store,
  ClipboardCheck,
  ShoppingCart,
  DollarSign,
  BarChart3
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
  const [activeUserType, setActiveUserType] = useState<'car-users' | 'service-centers' | 'spare-parts'>('car-users');

  const userTypeButtons = [
    { id: 'car-users', label: 'Car Users', icon: <Car size={20} /> },
    { id: 'service-centers', label: 'Service Centers', icon: <Wrench size={20} /> },
    { id: 'spare-parts', label: 'Spare Parts Sellers', icon: <Package size={20} /> }
  ];

  const carUserSteps = [
    {
      number: '01',
      title: 'Download & Get Started',
      description: 'Download the MotorTrace app and create your profile with vehicle details for personalized service recommendations.',
      icon: <Car size={24} />
    },
    {
      number: '02',
      title: 'Discover & Book Services',
      description: 'Browse verified service centers, compare ratings, prices, and availability. Book your preferred time slot with just a few taps.',
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
      description: 'Track your vehicle service in real-time on the booked date and receive updates from check-in to completion.',
      icon: <Clock size={24} />
    },
    {
      number: '05',
      title: 'Find Compatible Spare Parts',
      description: "Search for genuine spare parts using your vehicle's specifications, view compatibility, pricing, and seller ratings instantly.",
      icon: <Package size={24} />
    },
    {
      number: '06',
      title: 'Connect & Share Knowledge',
      description: "Join our community forum to share experiences, get expert advice, and help fellow car owners with maintenance tips.",
      icon: <MessageCircle size={24} />
    }
  ];

  const serviceCenterSteps = [
    {
      number: '01',
      title: 'Register Your Business',
      description: 'Set up your service center profile with business details, operating hours, service categories, and team information.',
      icon: <ClipboardCheck size={24} />
    },
    {
      number: '02',
      title: 'List Your Services',
      description: 'Create detailed service listings with pricing, duration estimates, and requirements to attract the right customers.',
      icon: <Wrench size={24} />
    },
    {
      number: '03',
      title: 'Manage Smart Bookings',
      description: 'Receive booking requests, review customer details, and accept appointments with automated advance payment handling.',
      icon: <Calendar size={24} />
    },
    {
      number: '04',
      title: 'Optimize Resource Allocation',
      description: 'Use our Kanban board to assign technicians to service bays and track workload distribution efficiently.',
      icon: <Users size={24} />
    },
    {
      number: '05',
      title: 'Deliver Excellence',
      description: 'Update service progress in real-time, generate digital bills, and provide transparent communication throughout the process.',
      icon: <TrendingUp size={24} />
    },
    {
      number: '06',
      title: 'Build Your Reputation',
      description: "Receive customer reviews, respond to feedback, and track your earnings with detailed analytics and reporting tools.",
      icon: <Star size = {24} />
    }
  ];

  const sparePartsSteps = [
    {
      number: '01',
      title: 'Register Your Shop',
      description: 'Create your seller profile with shop details, operating hours, and contact information to start reaching customers.',
      icon: <Store size={24} />
    },
    {
      number: '02',
      title: 'Build Your Inventory',
      description: 'List spare parts with detailed compatibility information, pricing, quantities, and high-quality images for better visibility.',
      icon: <PackagePlus size={24} />
    },
    {
      number: '03',
      title: 'Receive Smart Orders',
      description: 'Get purchase requests with vehicle compatibility details, review availability, and confirm orders with preparation timelines.',
      icon: <ShoppingCart size={24} />
    },
    {
      number: '04',
      title: 'Process Secure Payments',
      description: 'Receive confirmed orders with payments, ensuring guaranteed sales and reduced transaction risks.',
      icon: <DollarSign size={24} />
    },
    {
      number: '05',
      title: 'Fulfill Orders Efficiently',
      description: 'Prepare parts for pickup or delivery, update order status, and use QR verification for seamless customer handovers.',
      icon: <QrCode size={24} />
    },
    {
      number: '06',
      title: 'Grow Your Business',
      description: 'Track sales performance, manage customer reviews, and access detailed analytics to optimize your inventory and pricing.',
      icon: <BarChart3 size={24} />
    }
  ];

  const getCurrentSteps = () => {
    switch (activeUserType) {
      case 'car-users':
        return carUserSteps;
      case 'service-centers':
        return serviceCenterSteps;
      case 'spare-parts':
        return sparePartsSteps;
      default:
        return carUserSteps;
    }
  };

  return (
    <section id = "how-it-works" className = "how-it-works">
      <div className="container">
        {/* Header */}
        <div className="how-it-works-header">
          <h2 className="section-title">How MotorTrace Works</h2>
          <p className="section-subtitle">
            We connect car users with reliable service centers and spare parts providers, building a seamless automotive service ecosystem.
          </p>
        </div>

        {/* User Type Selector */}
        <div className="user-type-selector">
          <Stack direction={'row'} spacing={5}>

            {userTypeButtons.map((button) => (
              <Button
                key={button.id}
                variant="text"
                startIcon={button.icon}
                onClick={() => setActiveUserType(button.id as any)}
                sx={{
                  color: activeUserType === button.id ? 'primary.main' : 'text.secondary',
                  borderBottom: activeUserType === button.id ? 2 : 0,
                  borderColor: 'primary.main',
                  borderRadius: 0,
                  fontSize: '1.05rem',
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent', // Prevents background change
                    color: 'primary.main',
                    borderBottom: 2,
                    borderColor: 'primary.main'
                  }

                }}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
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