import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Menu, X, Calendar, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/initialPackages';
import '../../styles/header.css';

export default function Header({ onOpenBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      {/* Top Bar with Contact Info */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-info-group">
            <a href={`tel:${BUSINESS_INFO.primaryPhone}`} className="top-info-item">
              <Phone size={14} className="icon-emerald" />
              <span>{BUSINESS_INFO.phones[0]}</span>
            </a>
            <a href={`tel:${BUSINESS_INFO.phones[1]}`} className="top-info-item mobile-hide">
              <Phone size={14} className="icon-emerald" />
              <span>{BUSINESS_INFO.phones[1]}</span>
            </a>
            <a href={`mailto:${BUSINESS_INFO.email}`} className="top-info-item mobile-hide">
              <Mail size={14} className="icon-emerald" />
              <span>{BUSINESS_INFO.email}</span>
            </a>
          </div>

          <div className="top-right-group">
            <span className="top-location">
              <MapPin size={14} className="icon-emerald" />
              Near V.M. Hospital, Pullampet
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-navbar">
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
            <img
              src="/assets/logo.png"
              alt="AL-ZAIN DIAGNOSTICS"
              className="brand-logo-img"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home
            </NavLink>
            <NavLink to="/packages" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Packages
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Services
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              About Us
            </NavLink>
            <NavLink to="/home-collection" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Home Collection
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Contact
            </NavLink>
          </nav>

          {/* CTA Action */}
          <div className="nav-actions">
            <button className="btn btn-primary btn-book" onClick={() => onOpenBooking()}>
              <Calendar size={18} />
              <span>Book a Test</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button className="mobile-toggle-btn" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <nav className="mobile-nav-links">
            <NavLink to="/" className="mobile-link" onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/packages" className="mobile-link" onClick={closeMobileMenu}>
              Packages & Tests
            </NavLink>
            <NavLink to="/services" className="mobile-link" onClick={closeMobileMenu}>
              Services
            </NavLink>
            <NavLink to="/about" className="mobile-link" onClick={closeMobileMenu}>
              About Us
            </NavLink>
            <NavLink to="/home-collection" className="mobile-link" onClick={closeMobileMenu}>
              Home Sample Collection
            </NavLink>
            <NavLink to="/contact" className="mobile-link" onClick={closeMobileMenu}>
              Contact & Location
            </NavLink>

            <div className="mobile-drawer-cta">
              <button 
                className="btn btn-primary btn-full"
                onClick={() => {
                  closeMobileMenu();
                  onOpenBooking();
                }}
              >
                <Calendar size={18} />
                <span>Book a Test Now</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
