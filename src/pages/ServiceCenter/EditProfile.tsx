import React, { useRef, useState } from 'react';
import { Star, MapPin, Clock, Shield, Award, Verified, Camera, Edit3, Phone, Mail, Globe, Users, Calendar, TrendingUp } from 'lucide-react';
import './EditProfile.scss';

const EditProfile = () => {
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [shopPhotos, setShopPhotos] = useState([
    'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=400&q=80'
  ]);

  const handleProfilePhotoClick = () => {
    profileInputRef.current?.click();
  };

  const handleCoverPhotoClick = () => {
    coverInputRef.current?.click();
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    console.log('Uploading photos:', files);
  };

  return (
    <div className="edit-profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="cover-section">
          <img 
            className="cover-image" 
            src="https://images.unsplash.com/photo-1486754735734-325b5831c3ad?auto=format&fit=crop&w=1200&q=80" 
            alt="Shop Cover" 
          />
          <button className="cover-edit-btn" onClick={handleCoverPhotoClick}>
            <Camera size={16} />
            Edit Cover
          </button>
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
        </div>
        
        <div className="profile-info-section">
          <div className="profile-main">
            <div className="profile-image-container">
              <img 
                className="profile-image" 
                src="https://i.pravatar.cc/150?img=12" 
                alt="Shop Profile" 
              />
              <button className="profile-edit-btn" onClick={handleProfilePhotoClick}>
                <Camera size={14} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={profileInputRef}
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </div>
            
            <div className="profile-details">
              <div className="shop-name-section">
                <h1 className="shop-name">Elite Auto Repair Services</h1>
                <div className="verification-badges">
                  <span className="badge verified">
                    <Verified size={14} />
                    Verified
                  </span>
                  <span className="badge premium">
                    <Award size={14} />
                    Premium
                  </span>
                  <span className="badge trusted">
                    <Shield size={14} />
                    Trusted
                  </span>
                </div>
              </div>
              
              <p className="shop-tagline">Professional automotive repair and maintenance services</p>
              
              <div className="shop-meta">
                <div className="meta-item">
                  <Star size={16} className="star-icon" />
                  <span className="rating">4.9</span>
                  <span className="reviews">(127 reviews)</span>
                </div>
                <div className="meta-item">
                  <MapPin size={16} />
                  <span>Downtown Auto District, City Center</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>Mon-Fri: 8AM-6PM, Sat: 9AM-4PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Stats Cards */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">15+</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">98%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">24hr</div>
            <div className="stat-label">Response Time</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="left-column">
          {/* Shop Photos */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Shop Gallery</h2>
              <button className="edit-btn">
                <Edit3 size={16} />
                Edit Gallery
              </button>
            </div>
            <div className="photo-grid">
              {shopPhotos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Shop ${index + 1}`} />
                  <div className="photo-overlay">
                    <Edit3 size={16} />
                  </div>
                </div>
              ))}
              <div className="photo-upload-card">
                <Camera size={32} />
                <span>Add Photo</span>
              </div>
            </div>
          </div>

          {/* Certifications & Awards */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Certifications & Awards</h2>
              <button className="edit-btn">
                <Edit3 size={16} />
                Edit
              </button>
            </div>
            <div className="certifications-grid">
              <div className="cert-card">
                <div className="cert-icon">🏆</div>
                <div className="cert-content">
                  <h3>ASE Certified</h3>
                  <p>Automotive Service Excellence</p>
                  <span className="cert-year">2020</span>
                </div>
              </div>
              <div className="cert-card">
                <div className="cert-icon">🥇</div>
                <div className="cert-content">
                  <h3>Best Auto Shop</h3>
                  <p>City Business Awards</p>
                  <span className="cert-year">2023</span>
                </div>
              </div>
              <div className="cert-card">
                <div className="cert-icon">⭐</div>
                <div className="cert-content">
                  <h3>Top Rated</h3>
                  <p>Customer Choice Award</p>
                  <span className="cert-year">2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">About Our Shop</h2>
              <button className="edit-btn">
                <Edit3 size={16} />
                Edit
              </button>
            </div>
            <div className="about-content">
              <p>
                With over 15 years of experience in automotive repair, Elite Auto Repair Services 
                provides comprehensive vehicle maintenance and repair solutions. Our certified 
                technicians use state-of-the-art equipment to ensure your vehicle runs smoothly 
                and safely.
              </p>
              <p>
                We specialize in both domestic and foreign vehicles, offering everything from 
                routine maintenance to complex engine repairs. Customer satisfaction is our 
                top priority, and we stand behind all our work with comprehensive warranties.
              </p>
              
              <div className="features-list">
                <div className="feature-item">
                  <Shield size={20} />
                  <span>Licensed & Insured</span>
                </div>
                <div className="feature-item">
                  <Award size={20} />
                  <span>Certified Technicians</span>
                </div>
                <div className="feature-item">
                  <Clock size={20} />
                  <span>Same Day Service</span>
                </div>
                <div className="feature-item">
                  <Star size={20} />
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          {/* Contact Information */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Contact Information</h3>
            <div className="contact-list">
              <div className="contact-item">
                <Phone size={18} />
                <div className="contact-details">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">(555) 123-4567</span>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">info@eliteautorepair.com</span>
                </div>
              </div>
              <div className="contact-item">
                <Globe size={18} />
                <div className="contact-details">
                  <span className="contact-label">Website</span>
                  <span className="contact-value">www.eliteautorepair.com</span>
                </div>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <div className="contact-details">
                  <span className="contact-label">Address</span>
                  <span className="contact-value">123 Auto Lane, Downtown District</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Business Hours</h3>
            <div className="hours-list">
              <div className="hour-item">
                <span className="day">Monday</span>
                <span className="time">8:00 AM - 6:00 PM</span>
              </div>
              <div className="hour-item">
                <span className="day">Tuesday</span>
                <span className="time">8:00 AM - 6:00 PM</span>
              </div>
              <div className="hour-item">
                <span className="day">Wednesday</span>
                <span className="time">8:00 AM - 6:00 PM</span>
              </div>
              <div className="hour-item">
                <span className="day">Thursday</span>
                <span className="time">8:00 AM - 6:00 PM</span>
              </div>
              <div className="hour-item">
                <span className="day">Friday</span>
                <span className="time">8:00 AM - 6:00 PM</span>
              </div>
              <div className="hour-item">
                <span className="day">Saturday</span>
                <span className="time">9:00 AM - 4:00 PM</span>
              </div>
              <div className="hour-item closed">
                <span className="day">Sunday</span>
                <span className="time">Closed</span>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Social Proof</h3>
            <div className="social-stats">
              <div className="social-stat">
                <div className="social-number">4.9/5</div>
                <div className="social-label">Average Rating</div>
              </div>
              <div className="social-stat">
                <div className="social-number">127</div>
                <div className="social-label">Total Reviews</div>
              </div>
              <div className="social-stat">
                <div className="social-number">95%</div>
                <div className="social-label">Recommend Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;