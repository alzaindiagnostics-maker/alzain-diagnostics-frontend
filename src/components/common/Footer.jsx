import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO, PACKAGE_CATEGORIES } from '../../data/initialPackages';
import '../../styles/footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-grid">
          {/* Col 1: Brand & Identity */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand-logo">
              <img
                src="/assets/logo.png"
                alt="AL-ZAIN DIAGNOSTICS"
                className="footer-brand-logo-img"
              />
            </Link>
            
            <p className="footer-tagline">{BUSINESS_INFO.tagline}</p>
            <p className="footer-about-brief">
              Providing trusted, accurate, and hygienic medical laboratory diagnostic testing and home sample collection services in Pullampet and nearby regions.
            </p>

            <div className="social-links">
              <a 
                href={`https://instagram.com/${BUSINESS_INFO.instagram}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn" 
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61577311901314&mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn" 
                aria-label="Visit AL-ZAIN DIAGNOSTICS on Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/"><ArrowRight size={14} /> Home</Link></li>
              <li><Link to="/packages"><ArrowRight size={14} /> Health Packages</Link></li>
              <li><Link to="/services"><ArrowRight size={14} /> Diagnostic Services</Link></li>
              <li><Link to="/home-collection"><ArrowRight size={14} /> Home Collection</Link></li>
              <li><Link to="/about"><ArrowRight size={14} /> About Us</Link></li>
              <li><Link to="/contact"><ArrowRight size={14} /> Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Package Categories</h4>
            <ul className="footer-links-list">
              {PACKAGE_CATEGORIES.slice(1, 7).map((cat, idx) => (
                <li key={idx}>
                  <Link to={`/packages?category=${encodeURIComponent(cat)}`}>
                    <ArrowRight size={14} /> {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Contact & Location</h4>
            <div className="footer-contact-items">
              <div className="footer-contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} className="contact-icon" />
                <div>
                  <a href={`tel:${BUSINESS_INFO.phones[0]}`}>{BUSINESS_INFO.phones[0]}</a>, <br />
                  <a href={`tel:${BUSINESS_INFO.phones[1]}`}>{BUSINESS_INFO.phones[1]}</a>
                </div>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} className="contact-icon" />
                <a href={`mailto:${BUSINESS_INFO.email}`}>{BUSINESS_INFO.email}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer Note */}
        <div className="footer-disclaimer-box">
          <p>
            <strong>Medical Disclaimer:</strong> {BUSINESS_INFO.disclaimer}
          </p>
        </div>

        {/* Sub Footer */}
        <div className="sub-footer">
          <p>© {new Date().getFullYear()} AL-ZAIN DIAGNOSTICS. All Rights Reserved.</p>
          <div className="sub-footer-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms">Terms & Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
