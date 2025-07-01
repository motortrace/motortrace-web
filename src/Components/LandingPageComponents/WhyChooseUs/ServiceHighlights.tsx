import React from 'react';
import { FaTruck, FaUndoAlt, FaCheckCircle } from 'react-icons/fa';
import './ServiceHighlights.scss';

const ServiceHighlights = () => {
  return (
<section className="highlights-cards">
  <div className="highlight-card">
    <FaTruck className="icon" />
    <h4>Fast Shipping</h4>
    <p>Quick delivery across India</p>
  </div>
  <div className="highlight-card">
    <FaUndoAlt className="icon" />
    <h4>Easy Returns</h4>
    <p>Hassle-free 7-day returns</p>
  </div>
  <div className="highlight-card">
    <FaCheckCircle className="icon" />
    <h4>Genuine Parts</h4>
    <p>Only 100% authentic brands</p>
  </div>
</section>

  );
};

export default ServiceHighlights;
