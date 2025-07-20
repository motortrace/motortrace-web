import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import "../../../styles/variables.scss"
import './Header.scss';
import Logo from '../../../assets/images/motortraceLogo.png';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>('home');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (linkName: string): void => {
    setActiveLink(linkName);
    setIsMobileMenuOpen(false); // Close mobile menu when link is clicked
  };

  const handleHashLinkClick = (linkName: string, hash: string): void => {
    setActiveLink(linkName);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to the section
    const element = document.getElementById(hash);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // Update active link based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveLink('home');
    } else if (path === '/pricing') {
      setActiveLink('pricing');
    } else if (path === '/contactUs') {
      setActiveLink('contact');
    }
  }, [location]);

  // Handle scroll-based active link for hash links
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        const featuresSection = document.getElementById('features');
        const howItWorksSection = document.getElementById('how-it-works');
        
        if (featuresSection && howItWorksSection) {
          const scrollPosition = window.scrollY + 100; // Offset for navbar height
          const featuresTop = featuresSection.offsetTop;
          const howItWorksTop = howItWorksSection.offsetTop;
          
          if (scrollPosition >= howItWorksTop) {
            setActiveLink('how-it-works');
          } else if (scrollPosition >= featuresTop) {
            setActiveLink('features');
          } else {
            setActiveLink('home');
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return (
    <nav className="header">
      <div className="header__logo">
        <img src={Logo} alt="MotorTrace Logo" />
        <span>MotorTrace</span>
      </div>

      {/* Mobile menu button */}
      <button 
        className="header__mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`header__links-holder ${isMobileMenuOpen ? 'header__links-holder--open' : ''}`}>
        <Link 
          to="/" 
          className={`header__links-holder__link ${activeLink === 'home' ? 'active' : ''}`}
          onClick={() => handleLinkClick('home')}
        >
          Home
        </Link>
        <a 
          href="#features" 
          className={`header__links-holder__link ${activeLink === 'features' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleHashLinkClick('features', 'features');
          }}
        >
          Features
        </a>
        <a 
          href="#how-it-works" 
          className={`header__links-holder__link ${activeLink === 'how-it-works' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleHashLinkClick('how-it-works', 'how-it-works');
          }}
        >
          How It Works
        </a>
        <Link 
          to="/pricing" 
          className={`header__links-holder__link ${activeLink === 'pricing' ? 'active' : ''}`}
          onClick={() => handleLinkClick('pricing')}
        >
          Pricing
        </Link>
        {/* <Link 
          to="/contactUs" 
          className={`header__links-holder__link ${activeLink === 'contact' ? 'active' : ''}`}
          onClick={() => handleLinkClick('contact')}
        >
          Contact Us
        </Link> */}

         <a 
          href="#footer" 
          className={`header__links-holder__link ${activeLink === 'footer' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleHashLinkClick('footer', 'footer');
          }}
        >
          Contact Us
        </a>

        <Button 
          variant='contained'  
          sx={{ textTransform: 'none', fontFamily: 'Poppins, sans-serif'}}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Header;