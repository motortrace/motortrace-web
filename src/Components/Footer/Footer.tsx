import React from 'react';
import './Footer.scss';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import logo from '../../assets/images/logo.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <img src={logo} alt="Brand Logo" />
        <p>Your trusted source for genuine auto parts and unbeatable service quality.</p>

        <div className="footer__socials">
          <FaFacebookF />
          <FaInstagram />
          <FaTwitter />
          <FaYoutube />
        </div>
      </div>

      <div className="footer__bottom">
        © 2025 YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
