import React from 'react';
import { ShieldCheck, Award, HeartPulse, MapPin, Phone, Mail } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialPackages';

export default function About() {
  return (
    <div className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">ABOUT AL-ZAIN DIAGNOSTICS</span>
          <h1 className="section-title">Accurate | Reliable | Trusted</h1>
          <p className="section-description">
            Dedicated to providing high-quality diagnostic laboratory services to the people of Pullampet and nearby regions.
          </p>
        </div>

        <div className="why-grid mb-5" style={{ marginBottom: '3rem' }}>
          <div className="why-card">
            <h3 className="mb-2">Our Mission</h3>
            <p>
              To deliver accurate, prompt, and affordable clinical laboratory diagnostic services using modern analyzers, ensuring every patient receives trustworthy results for informed healthcare decisions.
            </p>
          </div>

          <div className="why-card">
            <h3 className="mb-2">Quality & Hygiene</h3>
            <p>
              We maintain strict quality control standards, employing sterile single-use sampling equipment, calibrated testing instruments, and qualified laboratory personnel.
            </p>
          </div>

          <div className="why-card">
            <h3 className="mb-2">Community Commitment</h3>
            <p>
              Located conveniently on Rajampet Road near V.M. Hospital in Pullampet, we eliminate the need for patients to travel far for comprehensive diagnostic health checkups.
            </p>
          </div>
        </div>

        <div className="contact-card-box">
          <div className="contact-box-info" style={{ width: '100%', gridColumn: 'span 2' }}>
            <span className="section-subtitle">VISIT OUR LABORATORY</span>
            <h2>AL-ZAIN DIAGNOSTICS</h2>
            <p className="contact-address">
              <MapPin size={18} className="text-emerald inline-icon" />
              {BUSINESS_INFO.address}
            </p>
            <p><strong>Primary Phone:</strong> {BUSINESS_INFO.phones[0]} | {BUSINESS_INFO.phones[1]}</p>
            <p><strong>Email:</strong> {BUSINESS_INFO.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
