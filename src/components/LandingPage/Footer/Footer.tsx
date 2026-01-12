import React from 'react';
import { Facebook, Instagram, Twitter, Phone, Mail, Clock, MapPin } from 'lucide-react';
import "../../../styles/variables.scss"
import './Footer.scss';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer id = "footer" className={`footer ${className}`}>
      <div className="footer__container">
        <div className="footer__content">
          {/* Brand Section */}
          <div className="footer__section footer__brand">
            <h2 className="footer__logo">MotorTrace</h2>
            <p className="footer__description">
              Simplifying car care one click at a time. Smart scheduling, real-time updates, and professional service that fits your life.
            </p>
            <div className="footer__social">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="footer__social-link"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__links">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="footer__link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h3 className="footer__title">Contact Info</h3>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Phone size={16} />
                <span>+94 11 234 5678</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={16} />
                <span>Motortrace64@gmail.com</span>
              </div>
              <div className="footer__contact-item">
                <Clock size={16} />
                <span>10 AM - 6 PM Week Days</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="footer__section">
            <h3 className="footer__title">Location</h3>
            <div className="footer__location">
              <div className="footer__contact-item">
                <MapPin size={16} />
                <span>No. 25, Marine Drive Wellawatte, Colombo 06 Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} MotorTrace. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;