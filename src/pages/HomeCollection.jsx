import React from 'react';
import { Home, Calendar, Phone, MessageCircle, ShieldCheck, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialPackages';

export default function HomeCollection({ onOpenBooking }) {
  const steps = [
    { num: '01', title: 'Select Your Test or Package', desc: 'Choose from our range of health checkups, fever profiles, or individual blood tests.' },
    { num: '02', title: 'Submit Booking Request', desc: 'Provide your name, contact number, preferred date, and residential address.' },
    { num: '03', title: 'Lab Confirmation', desc: 'Our lab representative calls to confirm your appointment and technician arrival slot.' },
    { num: '04', title: 'Hygienic Sample Collection', desc: 'A certified phlebotomist collects blood/urine samples using sterile single-use kits.' },
    { num: '05', title: 'Report Delivery', desc: 'Accurate test reports delivered digitally to your phone or collected from the lab.' }
  ];

  return (
    <div className="section-padding">
      <div className="container">
        {/* Banner */}
        <div className="section-header text-center">
          <span className="section-subtitle">CONVENIENT & HYGIENIC</span>
          <h1 className="section-title">Home Sample Collection Service</h1>
          <p className="section-description">
            Quality laboratory testing brought directly to your home in Pullampet and nearby regions. Safe, professional, and reliable.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="why-grid mb-5" style={{ marginBottom: '3rem' }}>
          <div className="why-card text-center">
            <div className="why-icon-wrapper" style={{ margin: '0 auto 1rem auto' }}>
              <ShieldCheck className="why-icon" />
            </div>
            <h3>100% Sterile & Hygienic</h3>
            <p>Single-use vacuum tubes and disposable needles opened in front of you.</p>
          </div>

          <div className="why-card text-center">
            <div className="why-icon-wrapper" style={{ margin: '0 auto 1rem auto' }}>
              <Clock className="why-icon" />
            </div>
            <h3>Flexible Time Slots</h3>
            <p>Early morning fasting slots (6:30 AM onwards) or regular daytime slots.</p>
          </div>

          <div className="why-card text-center">
            <div className="why-icon-wrapper" style={{ margin: '0 auto 1rem auto' }}>
              <MapPin className="why-icon" />
            </div>
            <h3>Coverage in Pullampet</h3>
            <p>Serving Pullampet, Rajampet Road, near V.M. Hospital, and surrounding locations.</p>
          </div>
        </div>

        {/* Process Walkthrough */}
        <div className="how-it-works-section p-4" style={{ borderRadius: 'var(--radius-xl)', marginBottom: '3rem' }}>
          <h2 className="section-title text-center mb-4">5-Step Home Collection Process</h2>
          <div className="steps-grid">
            {steps.map((step, idx) => (
              <div key={idx} className="step-card">
                <div className="step-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="home-collection-banner text-center" style={{ padding: '3rem 2rem' }}>
          <h2 className="mb-2">Need a Home Sample Collection Today?</h2>
          <p className="mb-4">Call our laboratory directly or book online to reserve your technician slot.</p>
          <div className="collection-cta" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" onClick={() => onOpenBooking()}>
              <Calendar size={20} /> Request Home Collection
            </button>
            <a href={`tel:${BUSINESS_INFO.primaryPhone}`} className="btn btn-outline btn-lg color-white">
              <Phone size={20} /> Call {BUSINESS_INFO.phones[0]}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
